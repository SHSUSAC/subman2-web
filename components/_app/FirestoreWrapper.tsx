import process from "process";
import { connectFirestoreEmulator, enableMultiTabIndexedDbPersistence, initializeFirestore } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import FullPageLoaderComponent from "./FullPageLoaderComponent";
import { useLog } from "../common/LogProvider";
import { FirestoreProvider, useInitFirestore } from "reactfire";
import { ReactNode } from "react";

export default function FirestoreWrapper({ children }: { children: ReactNode }) {
	const log = useLog("Firebase");
	const firestore = useInitFirestore(async (firebaseApp) => {
		const db = initializeFirestore(firebaseApp, {});

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
			}
			catch (e) {
				if (e instanceof FirebaseError) {
					log.info(
							"Caught duplicate firestore init. code: %s; name: %s; msg: %s",
							e.code,
							e.message,
							e.name
					);
				}
				const err = e as Error;
				log.warn("%s during firestore connection. %s", err.name, err.message);
			}
		}

		try {
			await enableMultiTabIndexedDbPersistence(db);
		} catch (e) {
			if (e instanceof FirebaseError) {
				log.info(
					"Error enabling indexeddb persistence. code: %s; name: %s; msg: %s",
					e.code,
					e.message,
					e.name
				);
			}
		}

		return db;
	});

	if (!firestore.data) {
		return <FullPageLoaderComponent message="Rolling SDK dice..." />;
	}

	return <FirestoreProvider sdk={firestore?.data}>{children}</FirestoreProvider>;
}
