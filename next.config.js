//Next.js does not allow config to be a ESModule
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
const withServiceWorker = require("next-service-worker");

module.exports = withPlugins([
	[withBundleAnalyzer],
	[withServiceWorker, {
		workbox: {
			// workbox config here...
		}
	}]
], {
	trailingSlash: false,
	//Should be handled by CDN
	compress: false,
	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
		};

		return config;
	},
	async headers() {
		const firebaseHeaders = require("./firebase.json").hosting.headers;
		const headers = [];

		firebaseHeaders.forEach(header => {
			if(header.source === "**/*"){
				header.source = "/";
			}
			headers.push(header);
		})

		return headers;
	}
});
