//Next.js does not allow config to be a ESModule
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = withPlugins([
	[withBundleAnalyzer],

], {
	swcMinify: true,
	reactStrictMode: true,
	trailingSlash: false,
	//Should be handled by CDN
	compress: false,
	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
		};
		//TODO Look at this message vesp!
		console.warn("Max precache size has been increased but the actual file should be trimed")
		config.plugins.push(new WorkboxPlugin.InjectManifest({
			swSrc: path.resolve(
				__dirname,
				'./lib/service-workers/root.ts',
			),
			swDest: '../../../public/service-workers/sw_root.js',
			maximumFileSizeToCacheInBytes: 13000000
		}));


		return config;
	},
	async headers() {
		const firebaseHeaders = require("./firebase.json").hosting.headers;
		const headers = [];

		firebaseHeaders.forEach(firebaseHeader => {
			if(firebaseHeader.source === "**/*")
			{
				firebaseHeader.source = "/";
			}
			headers.push(firebaseHeader);
		})

		return headers;
	}
});
