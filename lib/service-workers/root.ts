/// <reference lib="webworker" />
/**
 * Root service worker for the site
 */
import {cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import { skipWaiting, clientsClaim } from "workbox-core"
// @ts-ignore
import {_createRootLogger, ConstructLog} from "../../components/common/LogProvider";
import {registerRoute} from "workbox-routing";
import {CacheFirst, StaleWhileRevalidate} from "workbox-strategies";
import {ExpirationPlugin} from "workbox-expiration";
import {CacheableResponsePlugin} from "workbox-cacheable-response";


declare const self: Window & ServiceWorkerGlobalScope;

/**
 * The current version of the service worker.
 */
const SERVICE_WORKER_VERSION = "1.0.0";
const SERVICE_WORKER_SCOPE = "root";


const log = ConstructLog(_createRootLogger(), `ServiceWorker/${SERVICE_WORKER_SCOPE}`);
const cacheLog = ConstructLog(log, "caching");


const DEBUG_MODE = process.env.NODE_ENV === "development";

const DAY_IN_SECONDS = 24 * 60 * 60;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 30;
const YEAR_IN_SECONDS = DAY_IN_SECONDS * 365;

const CACHE_PREFIX = 'workbox-subman2'
const CACHE_OFFLINE_NAME = `${CACHE_PREFIX}-offline`
const CACHE_SCRIPT_NAME = `${CACHE_PREFIX}-scripts`
const CACHE_STYLES_NAME = `${CACHE_PREFIX}-styles`
const CACHE_DOCUMENTS_NAME = `${CACHE_PREFIX}-documents`
const CACHE_FONTS_NAME = `${CACHE_PREFIX}-fonts`
const CACHE_IMAGES_NAME = `${CACHE_PREFIX}-images`


log.info("Service Worker (%s) v%s", SERVICE_WORKER_SCOPE, SERVICE_WORKER_VERSION);

// -------------------------------------------------------------
// Precaching configuration
// -------------------------------------------------------------
log.debug("Building caching configuration...");
cacheLog.info("Cleaning old cache data...")
cleanupOutdatedCaches();

// Precaching
// Make sure that all the assets passed in the array below are fetched and cached
// The empty array below is replaced at build time with the full list of assets to cache
// This is done by workbox-build-inject.js for the production build
const assetsToCache = self.__WB_MANIFEST;
// To customize the assets afterwards:
//assetsToCache = [...assetsToCache, ???];

cacheLog.debug("Assets selected for caching: %j", assetsToCache);

cacheLog.info("Caching assets...");
precacheAndRoute(assetsToCache);
cacheLog.info("Caching complete! :D")

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------
log.debug("Building route map...");
// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
registerRoute(
	/^https:\/\/fonts\.googleapis\.com/,
	new StaleWhileRevalidate({
		cacheName: CACHE_STYLES_NAME,
	}),
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
registerRoute(
	/^https:\/\/fonts\.gstatic\.com/,
	new CacheFirst({
		cacheName: CACHE_FONTS_NAME,
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxAgeSeconds: YEAR_IN_SECONDS,
				maxEntries: 30,
				purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded.
			}),
		],
	}),
);

// Make JS/CSS fast by returning assets from the cache
// But make sure they're updating in the background for next use
registerRoute(/\.js$/, new StaleWhileRevalidate({
	cacheName: CACHE_SCRIPT_NAME
}));
registerRoute(/\.css$/, new StaleWhileRevalidate({
	cacheName: CACHE_STYLES_NAME
}));

// Cache images
// But clean up after a while
registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	new CacheFirst({
		cacheName: CACHE_IMAGES_NAME,
		plugins: [
			new ExpirationPlugin({
				maxEntries: 250,
				maxAgeSeconds: MONTH_IN_SECONDS,
				purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded.
			}),
		],
	}),
);



skipWaiting()

clientsClaim()