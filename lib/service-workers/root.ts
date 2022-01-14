/// <reference lib="webworker" />
/**
 * Root service worker for the site
 */
import {cleanupOutdatedCaches, precache, precacheAndRoute, PrecacheEntry} from "workbox-precaching";
import * as googleAnalytics from 'workbox-google-analytics';
import { skipWaiting, clientsClaim } from "workbox-core"
// @ts-ignore
import {_createRootLogger, ConstructLog} from "../../components/common/LogProvider";
import {registerRoute} from "workbox-routing";
import {CacheFirst, StaleWhileRevalidate} from "workbox-strategies";
import {ExpirationPlugin} from "workbox-expiration";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {cacheNames} from "workbox-core/_private/cacheNames";


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
//const CACHE_OFFLINE_NAME = `${CACHE_PREFIX}-offline`
const CACHE_SCRIPT_NAME = `${CACHE_PREFIX}-scripts`
const CACHE_STYLES_NAME = `${CACHE_PREFIX}-styles`
const CACHE_DOCUMENTS_NAME = `${CACHE_PREFIX}-documents`
const CACHE_FONTS_NAME = `${CACHE_PREFIX}-fonts`
const CACHE_IMAGES_NAME = `${CACHE_PREFIX}-images`


log.info("Service Worker (%s) v%s", SERVICE_WORKER_SCOPE, SERVICE_WORKER_VERSION);


/**
 * Installs the service worker
 */
self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(Install);
})

self.addEventListener("activate", (event: ExtendableEvent) => {
	event.waitUntil(Activate)
})

skipWaiting()

clientsClaim()

async function Activate() {
	// // @ts-ignore - Beta feature
	// if (self.registration?.navigationPreload) {
	// 	// Enable navigation preloads!
	// 	// @ts-ignore
	// 	await self.registration.navigationPreload.enable();
	// }
}

async function Install(){
	log.info("Installing service worker! Please stand-by...")
	/**
	 * Configures the service workers cache handling for offline functionality
	 */
	async function CachingConfiguration() {
		/**
		 * Configures workbox's routes from fetch to cache
		 */
		function RegisterRoutingInformation(){
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
		}

		log.debug("Building caching configuration...");

		cacheLog.debug("Cleaning old caches...")
		cleanupOutdatedCaches();

		cacheLog.debug("Purging current caches...")
		const cachePurge = Promise.all([
			caches.delete(CACHE_DOCUMENTS_NAME),
			caches.delete(CACHE_SCRIPT_NAME),
			caches.delete(CACHE_STYLES_NAME),
			caches.delete(CACHE_FONTS_NAME),
			caches.delete(cacheNames.getPrecacheName())
			//caches.open(CACHE_OFFLINE_NAME).then((cache) => cache.addAll(offlineUrls))
		])

		const assetsToCache = self.__WB_MANIFEST;
		// To customize the assets afterwards:
		//assetsToCache = [...assetsToCache, ???];

		cacheLog.debug("Assets selected for caching: %j", assetsToCache);

		RegisterRoutingInformation();

		cacheLog.debug("Adding assets to precache...");
		precacheAndRoute(assetsToCache);
		cacheLog.debug("Precache populated!");

		await cachePurge;
	}

	function ConfigureAnalytics() {
		try {
			googleAnalytics.initialize({
				parameterOverrides: {
					cd1: 'offline',
				},
				hitFilter: (params) => {
					const queueTimeInSeconds = Math.round(Number(params.get('qt')) / 1000);
					params.set('cm1', String(queueTimeInSeconds));
				}
			});
			log.debug("Google Analytics hooks installed. Offline events will be remembered and submitted when you reconnect")
		}
		catch (e) {
			log.error("Failed to add Google Analytics hooks. Events will not be reported while offline! %o", e);
		}
	}

	const asyncTasks = Promise.all([
		CachingConfiguration(),
	])

	ConfigureAnalytics();

	await asyncTasks;
	log.info("Installation success! You are now offline ready :D");
}