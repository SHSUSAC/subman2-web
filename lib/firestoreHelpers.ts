import { PressureRecord } from "./types/records/PressureRecord";
import { Logger } from "browser-bunyan";
import {
	collection,
	deleteDoc,
	doc,
	Firestore,
	getDocs,
	limit,
	orderBy,
	query,
	setDoc,
	WriteBatch,
	writeBatch,
} from "firebase/firestore";
import { toFirestore } from "./dateTimeHelpers";
import { TestRecord } from "./types/records/TestRecord.js";
import { ConditionRecord } from "./types/records/ConditionRecord.js";
import { datePhases } from "./types/equipmentComponents.js";
import { Temporal } from "@js-temporal/polyfill";
import { pressureProperties } from "./types/equipment.js";

function getDocumentRefInCollection(
	firestore: Firestore,
	topLevelCollectionId: string,
	topLevelDocumentId: string,
	subCollectionId: string,
	subCollectionDocumentId?: string
) {
	const topLevelCollection = collection(firestore, topLevelCollectionId);
	const topLevelDocument = doc(topLevelCollection, topLevelDocumentId);
	const subCollection = collection(topLevelDocument, subCollectionId);

	return subCollectionDocumentId ? doc(subCollection, subCollectionDocumentId) : doc(subCollection);
}

async function addDocumentToSubCollection(
	topLevelDocument: any,
	topLevelDocumentId: string,
	topLevelCollectionId: string,
	subCollectionId: string,
	firestore: Firestore,
	batch?: WriteBatch,
	subCollectionDocumentId?: string
) {
	const ref = getDocumentRefInCollection(
		firestore,
		topLevelCollectionId,
		topLevelDocumentId,
		subCollectionId,
		subCollectionDocumentId
	);
	console.warn(ref.path);
	if (batch) {
		batch.set(ref, topLevelDocument, { merge: true });
	} else {
		await setDoc(ref, topLevelDocument, { merge: true });
	}
}

export async function SaveConditionRecord(
	record: ConditionRecord,
	itemId: string,
	parentCollection: string,
	updateRecord: boolean,
	log: Logger,
	firestore: Firestore
) {
	log.info("Updating condition record %s in %s collection, values: %j", itemId, parentCollection, record);

	record.reportedAt = toFirestore(record.reportedAt, log);
	record.repairedAt = record.repairedAt ? toFirestore(record.repairedAt, log) : undefined;
	record.approvedAt = record.approvedAt ? toFirestore(record.approvedAt, log) : undefined;

	if (updateRecord) {
		await addDocumentToSubCollection(
			record,
			itemId,
			parentCollection,
			"conditionRecords",
			firestore,
			undefined,
			record.id
		);
	} else {
		await addDocumentToSubCollection(record, itemId, parentCollection, "conditionRecords", firestore);
	}

	log.info("Record committed to database");
}

export async function DeleteConditionRecord(
	recordId: string,
	itemId: string,
	parentCollection: string,
	log: Logger,
	firestore: Firestore
) {
	log.info("Deleting condition record from %s in %s collection, id: %s", itemId, parentCollection, recordId);

	const record = getDocumentRefInCollection(firestore, parentCollection, itemId, "conditionRecords", recordId);
	await deleteDoc(record);
	log.info("Record deletion committed to database");
}

export async function SaveTestRecord(
	record: TestRecord,
	itemId: string,
	parentCollection: string,
	updateRecord: boolean,
	log: Logger,
	firestore: Firestore
) {
	log.info("Updating test record %s in %s collection, values: %j", itemId, parentCollection, record);

	record.performedAt = toFirestore(record.performedAt, log);
	record.nextDue = toFirestore(record.nextDue, log);

	const batch = writeBatch(firestore);
	if (updateRecord) {
		await addDocumentToSubCollection(record, itemId, parentCollection, "testRecords", firestore, batch, record.id);
	} else {
		await addDocumentToSubCollection(record, itemId, parentCollection, "testRecords", firestore, batch);
	}
	const parentDocument = doc(collection(firestore, parentCollection), itemId);
	batch.update(parentDocument, { nextDue: record.nextDue });
	await batch.commit();
	log.info("Record committed to database");
}

export async function DeleteTestRecord(
	recordId: string,
	itemId: string,
	parentCollection: string,
	log: Logger,
	firestore: Firestore
) {
	log.info("Deleting test record from %s in %s collection, id: %s", itemId, parentCollection, recordId);

	const parent = doc(collection(firestore, parentCollection), itemId);

	const record = getDocumentRefInCollection(firestore, parentCollection, itemId, "testRecords", recordId);

	const recordsQuery = query(collection(parent, "testRecords"), orderBy("nextDue"), limit(2));
	let nextDue = (await getDocs(recordsQuery))?.docs[1]?.get("nextDue") as datePhases;

	if (!nextDue) {
		nextDue = Temporal.Now.zonedDateTimeISO();
		log.debug(
			"Unable to reset item nextDue field as there is no previous record. The value now, %s, will be used",
			nextDue
		);
	} else {
		log.debug("Resetting item nextDue field to previous record value, %s", nextDue);
	}

	await writeBatch(firestore)
		.delete(record)
		.update(parent, {
			nextDue: toFirestore(nextDue, log),
		})
		.commit();
	log.info("Record deletion committed to database");
}

export async function SavePressureRecord(
	record: PressureRecord,
	itemId: string,
	parentCollection: "cylinders",
	updateRecord: boolean,
	log: Logger,
	firestore: Firestore
) {
	log.info("Updating pressure record %s in %s collection, values: %j", itemId, parentCollection, record);
	record.timestamp = toFirestore(record.timestamp, log);

	const batch = writeBatch(firestore);

	if (updateRecord) {
		await addDocumentToSubCollection(
			record,
			itemId,
			parentCollection,
			"pressureRecords",
			firestore,
			batch,
			record.id
		);
	} else {
		await addDocumentToSubCollection(record, itemId, parentCollection, "pressureRecords", firestore, batch);
	}

	const parentDocument = doc(collection(firestore, parentCollection), itemId);
	batch.update(parentDocument, { pressure: record.newPressure });
	await batch.commit();
	log.info("Record committed to database");
}

export async function DeletePressureRecord(
	recordId: string,
	itemId: string,
	parentCollection: "cylinders",
	log: Logger,
	firestore: Firestore
) {
	log.info("Deleting pressure record from %s in %s collection, id: %s", itemId, parentCollection, recordId);

	const parent = doc(collection(firestore, parentCollection), itemId);

	const record = getDocumentRefInCollection(firestore, parentCollection, itemId, "pressureRecords", recordId);

	const recordsQuery = query(collection(parent, "pressureRecords"), orderBy("timestamp"), limit(2));
	let previousRecord = (await getDocs(recordsQuery)).docs[1]?.data() as PressureRecord;

	if (!previousRecord) {
		previousRecord = {
			id: doc(firestore, "_DUMMY").id,
			overseenBy: "System",
			newPressure: 0,
			comment: "This is system generated entry and should be ignored",
			timestamp: Temporal.Now.zonedDateTimeISO(),
		};
		log.debug(
			"Unable to reset item fields as there is no previous record. The default values, %j, will be used",
			previousRecord
		);
	} else {
		log.debug("Resetting item fields to previous record values, %j", previousRecord);
	}

	const batch = writeBatch(firestore);
	batch.delete(record);
	batch.update(parent, {
		pressure: previousRecord.newPressure,
	} as pressureProperties);

	await batch.commit();
	log.info("Record deletion committed to database");
}
