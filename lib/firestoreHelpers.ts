import { PressureRecord } from "./types/records/PressureRecord";
import { Logger } from "./types/logging";
import { addDoc, collection, doc, Firestore, setDoc, writeBatch, WriteBatch } from "firebase/firestore";
import { toFirestore } from "./dateTimeHelpers";
import {TestRecord} from "./types/records/TestRecord.js";
import {ConditionRecord} from "./types/records/ConditionRecord.js";

function getDocRef(firestore: Firestore, itemId: string, collection: string) {
	return doc(firestore, collection, itemId);
}

async function addDocumentToSubCollection(
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
		await setDoc(ref, item);
	}
}

export async function SaveConditionRecord(
	record: ConditionRecord,
	itemId: string,
	parentCollection: string,
	log: Logger,
	firestore: Firestore
) {
	log.info("Adding new condition record to %s in %s collection, values: %j", itemId, parentCollection, record);

	record.reportedAt = toFirestore(record.reportedAt, log);
	record.repairedAt = record.repairedAt ? toFirestore(record.repairedAt, log) : undefined;
	record.approvedAt = record.approvedAt ? toFirestore(record.approvedAt, log) : undefined;

	await addDocumentToSubCollection(record, itemId, parentCollection, "conditionRecords", firestore);
}

export async function SaveTestRecord(
	record: TestRecord,
	itemId: string,
	parentCollection: string,
	log: Logger,
	firestore: Firestore
) {
	log.info("Adding new test record to %s in %s collection, values: %j", itemId, parentCollection, record);

	record.performedAt = toFirestore(record.performedAt, log);
	record.nextDue = toFirestore(record.nextDue, log);

	const batch = writeBatch(firestore);
	await addDocumentToSubCollection(record, itemId, parentCollection, "testRecords", firestore, batch);
	const parentDocument = getDocRef(firestore, itemId, parentCollection);
	batch.update(parentDocument, { nextDue: record.nextDue });
	await batch.commit();
}

export async function SavePressureRecord(
	record: PressureRecord,
	itemId: string,
	parentCollection: "cylinders",
	log: Logger,
	firestore: Firestore
) {
	log.info("Adding new pressure record to %s in %s collection, values: %j", itemId, parentCollection, record);
	record.timestamp = toFirestore(record.timestamp, log);

	const batch = writeBatch(firestore);
	await addDocumentToSubCollection(record, itemId, parentCollection, "pressureRecords", firestore, batch);
	const parentDocument = getDocRef(firestore, itemId, parentCollection);
	batch.update(parentDocument, { pressure: record.newPressure });
	await batch.commit();
}
