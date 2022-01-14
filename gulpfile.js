const gulp = require("gulp");
const realFavicon = require("gulp-real-favicon");
const fs = require("fs");
const utils = require("util");
const del = require("del");
const eslint = require("gulp-eslint");
const gulpFilter = require("gulp-filter");
const shell = require("gulp-shell");
const contains = require('gulp-contains2');
const PluginError = require("plugin-error");

const CheckAppCheckTokenIsNotCommitted = function () {
	return gulp.src(".env.*")
		.pipe(gulp.src(".env"))
		.pipe(contains({
			search: new RegExp(/NEXT_PUBLIC_APP_CHECK_DEBUG=.*\n?/mg),
			onFound: function (string, file, cb) {
				cb(new PluginError('gulp-contains', new Error("Found a App Check Debug token")));
			}
		}));
}

module.exports["git-hooks/pre-commit#CheckAppCheckTokenIsNotCommitted"] = CheckAppCheckTokenIsNotCommitted;
module.exports["git-hooks/pre-commit"] = gulp.parallel(() => Lint(false), CheckAppCheckTokenIsNotCommitted);

module.exports["git-hooks/prepare-commit-msg"] = function () {

}

// File where the favicon markups are stored
const FAVICON_DATA_FILE = "assets/favicons/faviconData.json";

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
const GenerateFaviconAssets = async function () {
	if (uptoDate) {
		return;
	}
	return utils.promisify(realFavicon.generateFavicon)({
		masterPicture: "./assets/favicons/main.svg",
		dest: "./public/icons/favicon",
		iconsPath: "/icons/favicon",
		design: {
			ios: {
				pictureAspect: "backgroundAndMargin",
				backgroundColor: "#ffffff",
				margin: "14%",
				assets: {
					ios6AndPriorIcons: true,
					ios7AndLaterIcons: true,
					precomposedIcons: true,
					declareOnlyDefaultIcon: true,
				},
				appName: "SubMan 2",
			},
			desktopBrowser: {
				design: "raw",
			},
			windows: {
				pictureAspect: "whiteSilhouette",
				backgroundColor: "#2b5797",
				onConflict: "override",
				assets: {
					windows80Ie10Tile: true,
					windows10Ie11EdgeTiles: {
						small: true,
						medium: true,
						big: false,
						rectangle: false,
					},
				},
				appName: "SubMan 2",
			},
			androidChrome: {
				pictureAspect: "backgroundAndMargin",
				margin: "17%",
				backgroundColor: "#152e4d",
				themeColor: "#152e4d",
				manifest: {
					name: "SubMan 2",
					shortName: "SM2",
					display: "standalone",
					orientation: "notSet",
					onConflict: "override",
					declared: true,
					start_url: "/",
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false,
				},
			},
			safariPinnedTab: {
				pictureAspect: "silhouette",
				themeColor: "#22d3ee",
			},
		},
		settings: {
			compression: 2,
			scalingAlgorithm: "Mitchell",
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: false,
			usePathAsIs: false,
		},
		markupFile: FAVICON_DATA_FILE,
	});
};

let uptoDate = true;

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
const CheckForApiUpdates = async function () {
	let currentVersion;
	if (!fs.existsSync(FAVICON_DATA_FILE)) {
		currentVersion = "";
	} else {
		const file = JSON.parse(await utils.promisify(fs.readFile)(FAVICON_DATA_FILE));
		currentVersion = file?.version ?? "";
	}
	try {
		await utils.promisify(realFavicon.checkForUpdates)(currentVersion);
		uptoDate = true;
		return true;
	} catch (e) {
		if (!e.startsWith("A new version is available for your favicon.")) {
			throw e;
		}
		uptoDate = false;
		return true;
	}
};

module.exports["build/favicons#CheckForApiUpdates"] = CheckForApiUpdates;
module.exports["build/favicons#GenerateAssets"] = GenerateFaviconAssets;
const BuildFavicons = gulp.series(CheckForApiUpdates, GenerateFaviconAssets);
module.exports["build/favicons"] = BuildFavicons;

function CleanNextDirectory() {
	return del(["./.next/*", "./.next/**/*", "./public/service-workers"]);
}

function CleanOutputDirectory() {
	return del(["./out/*", "./out/**/*"]);
}

function CleanFaviconData() {
	return del(["./assets/favicons/faviconData.json", "./public/icons/favicon/*"]);
}

const Clean = gulp.parallel(CleanNextDirectory, CleanOutputDirectory, CleanFaviconData);

const RunNextDevServer = shell.task("yarn node ./dev_server/server.js");

function Lint(fix) {
	return (
		gulp
			.src(["./components/*", "./pages/*", "./lib/*", "*.js", "*.json"])
			// eslint() attaches the lint output to the "eslint" property
			// of the file object so it can be used by other modules.
			.pipe(
				eslint({
					fix: fix,
				})
			)
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			// To have the process exit with an error code (1) on
			// lint error, return the stream and pipe to failAfterError last.
			.pipe(eslint.failAfterError())
	);
}

module.exports["lint"] = () => Lint(process.env.NODE_ENV === "development");
module.exports["lint#no-fix"] = () => Lint(false);
module.exports["clean"] = Clean;
module.exports["clean#CleanNextDirectory"] = CleanNextDirectory;
module.exports["clean#CleanOutputDirectory"] = CleanOutputDirectory;
module.exports["clean#CleanFaviconData"] = CleanFaviconData;
module.exports["dev"] = gulp.series(BuildFavicons, Lint, RunNextDevServer);

const BuildBundle = shell.task("yarn next build");
const BuildStaticCompilation = shell.task("yarn next export");

module.exports["build"] = gulp.series(Clean, Lint, BuildFavicons, BuildBundle, BuildStaticCompilation);

module.exports["depcheck"] = shell.task("yarn dlx depcheck");
module.exports["analyze-bundle"] = gulp.series(
	Clean,
	Lint,
	BuildFavicons,
	shell.task("cross-env ANALYZE=true yarn next build"),
	BuildStaticCompilation
);
