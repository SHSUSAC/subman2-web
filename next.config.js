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
	trailingSlash: false,
	//Should be handled by CDN
	compress: false,
	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
		};
		config.plugins.push(new WorkboxPlugin.InjectManifest({
			swSrc: path.resolve(
				__dirname,
				'./lib/service-workers/root.ts',
			),
			swDest: '../../../public/service-workers/sw_root.js',
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
