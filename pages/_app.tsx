import React, { ReactElement, ReactNode, useContext, useEffect } from "react";
import { AppProps } from "next/app";
import { NextPage } from "next";
import LogProvider, { _createRootLogger, ConstructLog, useLog } from "../components/common/LogProvider";
import { useRouterLogging } from "../lib/hooks/RouterHooks";
import { Sidebar } from "../components/_app/Sidebar";
import { Navbar } from "../components/_app/Navbar";
import { ToastContainer } from "react-toastify";
import ThemeProvider, { ThemeContext } from "../lib/contexts/theme";
import PanelProvider from "../lib/contexts/panels";
import { SettingsPanel } from "../components/_app/SettingsPanel";
// import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import "../assets/styles/global.css";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "../components/common/ErrorBoundry";
import SquaresLoader from "../components/common/SquaresLoader";
import Head from "next/head";
import * as process from "process";
import { Logger } from "../lib/types/logging";
import fbConfig from "../lib/constants/firebaseConfig";
import { Temporal } from "@js-temporal/polyfill";
import packagejson from "../package.json";
import { useGdprConsent, useGdprConsentBannerShown } from "../lib/hooks/localStorageHooks";
import { Workbox } from "workbox-window";
import { withStore, useSetStoreValue } from "react-context-hook";
import Script from "next/script";

// faConfig.autoAddCss = false;

const panelPortalId = "panelPortal";
export const PanelPortalSelector = "#" + panelPortalId;

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const FirebaseComponents = dynamic(
	// @ts-ignore
	() => {
		return import("../components/_app/FirebaseComponents").then((mod) => mod.default);
	},
	{ ssr: false }
);

export type GlobalStore = {
	gisLoaded: boolean;
	gisReady: boolean;
};
const initialState: GlobalStore = { gisLoaded: false, gisReady: false };
const storeLog = ConstructLog(_createRootLogger(), "GlobalState");
const storeConfig = {
	listener: (state: Object, key: string, prevValue: any, nextValue: any) => {
		storeLog.debug("%s updated to %j from %j", key, nextValue, prevValue);
		storeLog.trace("Store state: %j", state);
	},
	logging: false, //process.env.NODE_ENV !== 'production'
};

export default withStore(ApplicationContainer, initialState, storeConfig);

// noinspection JSUnusedGlobalSymbols
function ApplicationContainer({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
	useRouterLogging();
	const log = useLog();
	dumpInfo(log);

	useEffect(() => {
		log.debug("Attempting service worker registration");
		if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
			log.warn("Progressive Web App support is disabled");
			return;
		}
		const wb = new Workbox("/service-workers/sw_root.js", { scope: "/" });
		wb.register().then(() => {
			log.info("Service Worker registered with browser");
		});
	}, [log]);

	log.trace("Rendering application container");
	const getLayout = Component.getLayout || ((page) => page);

	const setGisLoaded = useSetStoreValue("gisLoaded");
	return (
		<ErrorBoundary generateRawShell={true}>
			<LogProvider>
				<Script
					strategy="afterInteractive"
					src="https://accounts.google.com/gsi/client"
					onLoad={() => {
						setGisLoaded(true);
					}}
				/>
				{/*<React.Suspense*/}
				{/*	fallback={*/}
				{/*		<Shell>*/}
				{/*			<div className="flex flex-col flex-1 items-center justify-center">*/}
				{/*				<SquaresLoader />*/}
				{/*				<p className="text-center m-4">Reticulating Splines...</p>*/}
				{/*			</div>*/}
				{/*		</Shell>*/}
				{/*	}*/}
				{/*>*/}
				<FirebaseComponents>
					<Shell>{getLayout(<Component {...pageProps} />)}</Shell>
				</FirebaseComponents>
				{/*</React.Suspense>*/}
			</LogProvider>
		</ErrorBoundary>
	);
}

function dumpInfo(log: Logger) {
	log.info("Scuba Management Version 2 (%s)", packagejson.version);
	try {
		log.info("Package ID: %s", packagejson.name);
		const depsLog = log.child({ childName: "Dependencies" });
		log.trace("Dependency Info");
		for (let [key, value] of Object.entries(packagejson.dependencies)) {
			depsLog.trace("%s@%s", key, value);
		}
	} catch {
		log.warn("Error loading dependency info");
	}
	log.info("Environmental Mode: %s", process.env.NEXT_PUBLIC_ENVIRONMENT_MODE);
	log.info("Emulation Modes: %j", {
		FirestoreEmulatorEnabled: process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR ?? false,
		AuthEmulatorEnabled: process.env.NEXT_PUBLIC_AUTH_EMULATOR ?? false,
		AppCheckDebugTokenEnabled: process.env.NEXT_PUBLIC_APP_CHECK_DEBUG,
	});
	log.debug("Built-in firebase configuration: %j", fbConfig);
	try {
		log.info("Process TZ: %s", process.env.TZ);
	} catch {
		log.warn("Error finding process timezone. This could cause time related issues");
	}
	try {
		log.info("Temporal TZ: %s", Temporal.Now.timeZone().toString());
	} catch {
		log.warn("Error finding temporal timezone. This could cause time related issues");
	}
	log.trace("Panel portal set to %s, use selector %s to access it", panelPortalId, PanelPortalSelector);
}

const ConsentBanner = () => {
	const [, setEnabled] = useGdprConsent();
	const [, setSeen] = useGdprConsentBannerShown();

	return (
		<div className="flex items-center justify-between p-4 bg-primary border-t dark:bg-primary-lighter dark:border-primary-darker">
			<p>Allow data collection for performance tracking?</p>
			<div className="flex items-center justify-between">
				<button
					className="px-4 m-2 rounded text-white bg-green-500 hover:bg-green-700"
					onClick={() => {
						setEnabled(true);
						setSeen(true);
					}}
				>
					Allow
				</button>
				<button
					className="px-4 m-2 mr-3 rounded text-white bg-red-500 hover:bg-red-700"
					onClick={() => {
						setEnabled(false);
						setSeen(true);
					}}
				>
					Deny
				</button>
			</div>
		</div>
	);
};

function Shell({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary generateRawShell={true}>
			<ThemeProvider>
				<PanelProvider>
					<ThemeModeController>
						<Favicons />
						<div className="flex antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
							<Sidebar />
							<div className="flex flex-col flex-1 min-h-screen overflow-x-hidden overflow-y-auto">
								<Navbar />
								<div className="flex flex-1 flex-col h-full p-4">
									<ErrorBoundary>
										<React.Suspense
											fallback={
												<div className="flex flex-col flex-1 items-center justify-center">
													<SquaresLoader />
													<p className="text-center m-4">Reticulating Splines...</p>
												</div>
											}
										>
											{children}
										</React.Suspense>
									</ErrorBoundary>
								</div>
								<Footer />
							</div>
						</div>
						<SettingsPanel />
						<div id={panelPortalId} />
					</ThemeModeController>
				</PanelProvider>
			</ThemeProvider>
			<ToastContainer />
		</ErrorBoundary>
	);
}

export function Footer() {
	const [seen] = useGdprConsentBannerShown();

	return (
		<footer>
			{!seen && <ConsentBanner />}
			<div className="flex items-center justify-between p-4 bg-white border-t dark:bg-darker dark:border-primary-darker">
				<p>SubMan2 &copy; 2021 </p>
				<p>
					<a
						href="https://www.privacypolicygenerator.info/live.php?token=AX29NEtN2xNtE4oY18pt16bPKx6khJ2S"
						target="_blank"
						className="text-blue-500 hover:underline"
						rel="noreferrer"
					>
						Privacy
					</a>
				</p>
				<p>
					Made by&nbsp;
					<a
						href="https://github.com/Vespion"
						target="_blank"
						className="text-blue-500 hover:underline"
						rel="noreferrer"
					>
						Vespion
					</a>
				</p>
			</div>
		</footer>
	);
}

export function ThemeModeController({ children }: { children: React.ReactNode }): JSX.Element {
	const themeHelper = useContext(ThemeContext);
	return <div className={`${themeHelper?.lightMode === "dark" ? "dark" : ""}`}>{children}</div>;
}

export function Favicons(): JSX.Element {
	const themeHelper = useContext(ThemeContext);
	return (
		<Head>
			<link rel="apple-touch-icon" sizes="180x180" href={"/icons/favicon/apple-touch-icon.png?v=1"} />
			<link rel="icon" type="image/png" sizes="32x32" href={"/icons/favicon/favicon-32x32.png?v=1"} />
			<link rel="icon" type="image/png" sizes="194x194" href={"/icons/favicon/favicon-194x194.png?v=1"} />
			<link rel="icon" type="image/png" sizes="192x192" href={"/icons/favicon/android-chrome-192x192.png?v=1"} />
			<link rel="icon" type="image/png" sizes="16x16" href={"/icons/favicon/favicon-16x16.png?v=1"} />
			<link rel="manifest" href={"/icons/favicon/site.webmanifest?v=1"} />
			<link rel="mask-icon" href={"/icons/favicon/safari-pinned-tab.svg?v=1"} color="#5bbad5" />
			<link rel="shortcut icon" href={"/icons/favicon/favicon.ico?v=1"} />
			<meta name="apple-mobile-web-app-title" content="SubMan2" />
			<meta name="application-name" content="SubMan2" />
			<meta name="msapplication-TileColor" content="#2d89ef" />
			<meta name="msapplication-TileImage" content="/icons/favicon/mstile-144x144.png?v=1" />
			<meta name="msapplication-config" content="/icons/favicon/browserconfig.xml?v=1" />
			<meta name="theme-color" content={themeHelper?.iconColour ?? "#ffffff"} />
			<title>SubMan2</title>
		</Head>
	);
}
