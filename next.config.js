//Next.js does not allow config to be a ESModule
const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([[withBundleAnalyzer], [optimizedImages]], {
	trailingSlash: false,
	//Should be handled by CDN
	compress: false,
	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
		};

		return config;
	},
	sassOptions: {
		includePaths: [],
	},
});
