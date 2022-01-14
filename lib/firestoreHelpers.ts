import { PressureRecord } from "./types/records/PressureRecord";
import { Logger } from "./types/logging";
import { addDoc, collection, doc, Firestore, setDoc, writeBatch, WriteBatch } from "firebase/firestore";
import { toFirestore } from "./dateTimeHelpers";

function getDocRef(firestore: Firestore, itemId: string, collection: string) {
	return doc(firestore, collection, itemId);
}

function addDocumentToSubCollection(
	item: any,
	itemId: string,
	parentCollection: string,
	subCollection: string,
	firestore: Firestore,
	batch?: WriteBatch
) {
	const ref = doc(collection(getDocRef(firestore, itemId, parentCollection), subCollection));
	if (batch) {
		batch.set(ref, item);
	} else {
		setDoc(ref, item);
	}
}

export function SavePressureRecord(
	record: PressureRecord,
	itemId: string,
	parentCollection: "cylinders",
	log: Logger,
	firestore: Firestore
) {
	log.info("Adding new pressure record to %s in %s collection, values: %j", itemId, parentCollection, record);
	record.timestamp = toFirestore(record.timestamp, log);

	const batch = writeBatch(firestore);
	addDocumentToSubCollection(record, itemId, parentCollection, "pressureRecords", firestore);
	const parentDocument = getDocRef(firestore, itemId, parentCollection);
	batch.update(parentDocument, { pressure: record.newPressure });
	batch.commit();
}
