import { FirebaseError, FirebaseOptions, initializeApp, onLog } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { connectAuthEmulator, initializeAuth, indexedDBLocalPersistence } from "firebase/auth"; // Firebase v9+
import { connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, initializeFirestore } from "firebase/firestore"; // Firebase v9+
import { LogCallback } from "@firebase/logger";
import {
	FirebaseAppProvider,
	AuthProvider,
	AppCheckProvider,
	FirestoreProvider,
	useInitFirestore,
	useInitPerformance,
	useInitAnalytics,
	useInitAuth,
	AnalyticsProvider,
	PerformanceProvider,
} from "reactfire";
import firebaseConfig, { APP_CHECK_TOKEN } from "../../lib/constants/firebaseConfig";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useLog } from "../common/LogProvider";
import process from "process";
import { useGdprConsent } from "../../lib/hooks/localStorageHooks";
import { initializeAnalytics } from "firebase/analytics";
import { initializePerformance } from "firebase/performance";
import SquaresLoader from "../common/SquaresLoader";
import { Favicons, Footer, ThemeModeController } from "../../pages/_app";
import ThemeProvider from "../../lib/contexts/theme";
import { Navbar } from "./Navbar";
import { ProfileButton } from "./ProfileButton";
import { NavList } from "./NavList";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import FullPageLoaderComponent from "./FullPageLoaderComponent";

function FirebaseSDKProviderHOC({ children }: { children: ReactNode }) {
	const log = useLog("Firebase");
	const [gdprConsent] = useGdprConsent();

	const auth = useInitAuth(async (firebaseApp) => {
		const auth = initializeAuth(firebaseApp, {
			persistence: indexedDBLocalPersistence,
		});
		if (process.env.NEXT_PUBLIC_AUTH_EMULATOR) {
			connectAuthEmulator(auth, process.env.NEXT_PUBLIC_AUTH_EMULATOR, {
				disableWarnings: process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === "development",
			});
		}

		return auth;
	});

	const anal = useInitAnalytics(async (firebaseApp) => {
		const initialisedAnal = initializeAnalytics(firebaseApp, {});
		try {
			// @ts-ignore
			gtag('config', firebaseApp.options.measurementId, { 'anonymize_ip': true });
		}
		catch (e) {
			log.debug("Error configuring gtag. %o", e);
		}
		return initialisedAnal;
	});

	const perf = useInitPerformance(async (firebaseApp) => {
		return initializePerformance(firebaseApp, {
			instrumentationEnabled: process.env.NEXT_PUBLIC_DATA_COLLECTION == "true" && gdprConsent,
			dataCollectionEnabled: process.env.NEXT_PUBLIC_DATA_COLLECTION == "true" && gdprConsent,
		});
	});

	if (!auth.data || !perf.data || !anal.data) {
		return <FullPageLoaderComponent message="Rolling SDK dice..." />;
	}

	return (
		<AuthProvider sdk={auth?.data}>
			<AnalyticsProvider sdk={anal?.data}>
				<PerformanceProvider sdk={perf?.data}>
					{children}
				</PerformanceProvider>
			</AnalyticsProvider>
		</AuthProvider>
	);
}

function AppProviderHOC({ children, fetchedConfig }: { children: ReactNode; fetchedConfig?: FirebaseOptions }) {
	const fbLog = useLog("Firebase");

	const [gdprConsent] = useGdprConsent();

	useEffect(() => {
		const id = fetchedConfig?.measurementId;
		if(id){
			// @ts-ignore
			window[`ga-disable-${id}`] = process.env.NEXT_PUBLIC_DATA_COLLECTION != "true" || !gdprConsent;
		}
	}, [fetchedConfig, gdprConsent])

	const app = useMemo(() => {
		const logHandler: LogCallback = (logParams) => {
			switch (logParams.level) {
				case "verbose":
				case "silent":
					fbLog.trace({ firebaseLogType: logParams.type }, logParams.message, logParams.args);
					break;
				default:
					fbLog[logParams.level]({ firebaseLogType: logParams.type }, logParams.message, logParams.args);
					break;
			}
		};

		const app = initializeApp(fetchedConfig ?? firebaseConfig);
		app.automaticDataCollectionEnabled = process.env.NEXT_PUBLIC_DATA_COLLECTION == "true" && gdprConsent;
		onLog(logHandler, {
			level: "silent",
		});
		return app;
	}, [fbLog, fetchedConfig, gdprConsent]);

	const appCheck = initializeAppCheck(app, {
		provider: new ReCaptchaV3Provider(APP_CHECK_TOKEN),
		isTokenAutoRefreshEnabled: true,
	});

	// if (app === "loading") {
	// 	return <FullPageLoaderComponent message="Building SDK character sheet..." />;
	// }

	return (
		<FirebaseAppProvider firebaseApp={app}>
			<AppCheckProvider sdk={appCheck}>
				<FirebaseSDKProviderHOC>{children}</FirebaseSDKProviderHOC>
			</AppCheckProvider>
		</FirebaseAppProvider>
	);
}

export default function FirebaseComponents({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<undefined | FirebaseOptions>();
	const [fetchRunning, setFetchRunning] = useState(false);
	const log = useLog();

	// useCallback(() => {
	// 	try {
	// 		fetch("/__/firebase/init.json", { method: "HEAD" }).then((preflight) => {
	// 			if (preflight.ok) {
	// 				fetch("/__/firebase/init.json").then(async (response) => {
	// 					try {
	// 						setConfig(await response.json());
	// 					} catch (e) {
	// 						log.error(
	// 							"Error parsing firebase config from reserved URL. Falling back to embedded config"
	// 						);
	// 					} finally {
	// 						setFetchRunning(false);
	// 					}
	// 				});
	// 			} else {
	// 				log.error(
	// 					"Preflight to fetch firebase config from reserved URL failed. Falling back to embedded config"
	// 				);
	// 				setFetchRunning(false);
	// 			}
	// 		});
	// 	} catch (e) {
	// 		log.error("Error fetching firebase config from reserved URL. Falling back to embedded config");
	// 		setFetchRunning(false);
	// 	}
	// }, [log])();

	if (fetchRunning) {
		return <FullPageLoaderComponent message="Downloading more RAM..." />;
	}

	return <AppProviderHOC fetchedConfig={config}>{children}</AppProviderHOC>;
}
