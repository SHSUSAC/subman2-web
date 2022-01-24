import process from "process";
import { connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, initializeFirestore } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import FullPageLoaderComponent from "./FullPageLoaderComponent";
import { useLog } from "../common/LogProvider";
import { FirestoreProvider, useInitFirestore } from "reactfire";
import { ReactNode } from "react";
import { toast } from "react-toastify";

export default function FirestoreWrapper({ children }: { children: ReactNode }) {
	const log = useLog("Firebase");
	const firestore = useInitFirestore(async (firebaseApp) => {
		const db = initializeFirestore(firebaseApp, {
			ignoreUndefinedProperties: true,
		});

		if (process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR) {
			const hostname = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR;
			const hostnameSplit = hostname.split(":");
			let port;
			try {
				port = Number(hostnameSplit[1]);
			} catch (e) {
				const error = e as Error;
				log.error(
					"Failed to parse port from emulator env var. %s %s %s",
					error.name,
					error.message,
					error.stack
				);
			}
			if (!port) {
				return db;
			}

			try {
				connectFirestoreEmulator(db, hostnameSplit[0], port);
			} catch (e) {
				if (e instanceof FirebaseError) {
					if (e.message.startsWith("Firestore has already been started")) {
						log.info(
							"Caught duplicate firestore emulator connection. code: %s; msg: %s",
							e.code,
							e.message
						);
					} else {
						log.warn("%s error during firestore emulator connection. %s", e.code, e.message);
					}
				} else {
					const err = e as Error;
					log.warn("%s during firestore emulator connection. %s", err.name, err.message);
				}
			}
		}

		try {
			await enableMultiTabIndexedDbPersistence(db);
		} catch (e) {
			let disableToast = false;
			if (e instanceof FirebaseError) {
				if (e.message.startsWith("Firestore has already been started")) {
					disableToast = !process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR;
					log[process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR ? "info" : "warn"](
						"Caught duplicate firestore persistence initialisation. code: %s; msg: %s",
						e.code,
						e.message
					);
				} else {
					log.warn("%s error during firestore persistence initialisation. %s", e.code, e.message);
				}
			} else {
				const err = e as Error;
				log.warn("%s during firestore persistence initialisation. %s", err.name, err.message);
			}

			if (!disableToast) {
				toast.warn("Unable to start offline database. This will prevent syncing and offline usage", {
					position: "top-right",
					autoClose: false,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					toastId: "FirestoreWrapper/MultiPersistFailed/WarningDialog",
				});
			}
		}

		return db;
	});

	if (!firestore.data) {
		return <FullPageLoaderComponent message="Rolling SDK dice..." />;
	}

	return <FirestoreProvider sdk={firestore?.data}>{children}</FirestoreProvider>;
}
