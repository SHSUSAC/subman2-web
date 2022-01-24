// noinspection JSUnusedLocalSymbols

import React, { useEffect, useMemo, useState } from "react";
import { Cell, Column } from "react-table";
import { Table } from "../common/Table";
import { PressureRecord } from "../../lib/types/records/PressureRecord";
import { useAnalytics, useFirestore, useFirestoreCollectionData } from "reactfire";
import { query, collection, doc, Timestamp, orderBy } from "firebase/firestore";
import { useLog } from "../common/LogProvider";
import { toTemporal } from "../../lib/dateTimeHelpers";
import { ConditionRecord } from "../../lib/types/records/ConditionRecord";
import { datePhases } from "../../lib/types/equipmentComponents";
import { TestRecord } from "../../lib/types/records/TestRecord";
import Link from "next/link";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logEvent } from "firebase/analytics";
import FirestoreWrapper from "../_app/FirestoreWrapper";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import PressureRecordPanel from "../../fragments/panels/pressureRecordPanel";
import { useForm } from "react-hook-form";
import {
	DeleteConditionRecord,
	DeletePressureRecord,
	DeleteTestRecord,
	SaveConditionRecord,
	SavePressureRecord,
	SaveTestRecord,
} from "../../lib/firestoreHelpers";
import { AppError } from "../../lib/types/errors";
import TestRecordPanel from "../../fragments/panels/TestRecordPanel";
import ConditionRecordPanel from "../../fragments/panels/ConditionRecordPanel";

const TimestampCell = ({ zdt }: { zdt: datePhases }) => {
	const log = useLog();
	const date = toTemporal(zdt, log);
	log.trace("Rendering timestamp (%s) in cell", date.toString());
	return (
		<>
			<p>
				{date?.day}/{date?.month}/{date?.year}
			</p>
		</>
	);
};

const ConditionTable = ({
	itemId,
	itemCollection,
	editRecordTrigger,
	deleteRecordTrigger,
}: {
	itemId: string;
	itemCollection: string;
	editRecordTrigger: (record: ConditionRecord) => void;
	deleteRecordTrigger: (record: ConditionRecord) => void;
}) => {
	const useCollection = (suspense = true) =>
		useFirestoreCollectionData(
			query(
				collection(doc(collection(useFirestore(), itemCollection), itemId), "conditionRecords"),
				orderBy("reportedAt")
			),
			{
				idField: "id",
				suspense: suspense,
			}
		);

	const columns = useMemo<Column<ConditionRecord>[]>(() => {
		return [
			{
				accessor: "reportedAt",
				Header: "Reported At",
				Cell: function (props: Cell<ConditionRecord>) {
					return <TimestampCell zdt={props.row.original.reportedAt} />;
				},
			},
			{
				accessor: "reportedBy",
				Header: "Reporter",
			},
			{
				accessor: "faultDescription",
				Header: "Fault",
			},
			{
				accessor: "repairedAt",
				Header: "Repaired At",
				Cell: function (props: Cell<ConditionRecord>) {
					if (!props.row.original.repairedAt) {
						return null;
					}
					return <TimestampCell zdt={props.row.original.repairedAt} />;
				},
			},
			{
				accessor: "repairedBy",
				Header: "Repaired By",
			},
			{
				accessor: "repairDescription",
				Header: "Header",
			},
			{
				accessor: "outcome",
				Header: "Outcome",
			},
			{
				accessor: "approvedAt",
				Header: "Approved At",
				Cell: function (props: Cell<ConditionRecord>) {
					if (!props.row.original.approvedAt) {
						return null;
					}
					return <TimestampCell zdt={props.row.original.approvedAt} />;
				},
			},
			{
				accessor: "approvedBy",
				Header: "Approved By",
			},
			// {
			// 	Header: "Actions",
			// 	Cell: function ActionCell(props: Cell<ConditionRecord>) {
			// 		return (
			// 			<div className="flex items-center p-4 space-x-2">
			// 				{/*className="p-2 transition-colors duration-200 rounded-50 text-white bg-secondary-50 hover:text-secondary hover:bg-secondary-100 dark:hover:text-light dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker"*/}
			// 				<button
			// 					onClick={async () => {
			// 						await editRecordTrigger(props.row.original);
			// 					}}
			// 					title="Edit record"
			// 					className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
			// 				>
			// 					<div>
			// 						<FontAwesomeIcon icon={faEdit} />
			// 					</div>
			// 				</button>
			// 				<button
			// 					onClick={async () => {
			// 						await deleteRecordTrigger(props.row.original);
			// 					}}
			// 					title="Delete record"
			// 					className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
			// 				>
			// 					<div>
			// 						<FontAwesomeIcon icon={faTrashAlt} />
			// 					</div>
			// 				</button>
			// 			</div>
			// 		);
			// 	},
			// },
		];
	}, []);

	function TableWrapper({ columns }: { columns: Column<ConditionRecord>[] }) {
		const log = useLog();
		const { data } = useCollection();

		const mappedData = data?.map((x) => {
			const map: ConditionRecord = {
				id: x.id,
				reportedAt: toTemporal(x.reportedAt as Timestamp, log),
				reportedBy: x.reportedBy,
				repairedAt: toTemporal(x.repairedAt as Timestamp, log),
				repairedBy: x.repairedBy,
				approvedAt: toTemporal(x.approvedAt as Timestamp, log),
				approvedBy: x.approvedBy,
				faultDescription: x.faultDescription,
				repairDescription: x.repairDescription,
				outcome: x.outcome,
			};

			return map;
		});

		return <Table data={mappedData} columns={columns} />;
	}

	return <TableWrapper columns={columns} />;
};

const PressureTable = ({
	itemId,
	itemCollection,
	editRecordTrigger,
	deleteRecordTrigger,
}: {
	itemId: string;
	itemCollection: string;
	editRecordTrigger: (record: PressureRecord) => void;
	deleteRecordTrigger: (record: PressureRecord) => void;
}) => {
	const useCollection = (suspense = true) =>
		useFirestoreCollectionData(
			query(
				collection(doc(collection(useFirestore(), itemCollection), itemId), "pressureRecords"),
				orderBy("timestamp")
			),
			{
				idField: "id",
				suspense: suspense,
			}
		);

	const columns = useMemo<Column<PressureRecord>[]>(() => {
		return [
			{
				accessor: "timestamp",
				Header: "Timestamp",
				Cell: function (props: Cell<PressureRecord>) {
					return <TimestampCell zdt={props.row.original.timestamp} />;
				},
			},
			{
				Header: "Pressure",
				accessor: "newPressure",
			},
			{
				Header: "Gas Mix",
				accessor: "gasType",
			},
			{
				Header: "Fill Location",
				accessor: "location",
			},
			{
				Header: "Overseen By",
				accessor: "overseenBy",
			},
			{
				Header: "Comment",
				accessor: "comment",
			},
			// {
			// 	Header: "Actions",
			// 	Cell: function ActionCell(props: Cell<PressureRecord>) {
			// 		return (
			// 			<div className="flex items-center p-4 space-x-2">
			// 				{/*className="p-2 transition-colors duration-200 rounded-50 text-white bg-secondary-50 hover:text-secondary hover:bg-secondary-100 dark:hover:text-light dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker"*/}
			// 				<button
			// 					onClick={async () => {
			// 						await editRecordTrigger(props.row.original);
			// 					}}
			// 					title="Edit record"
			// 					className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
			// 				>
			// 					<div>
			// 						<FontAwesomeIcon icon={faEdit} />
			// 					</div>
			// 				</button>
			// 				<button
			// 					onClick={async () => {
			// 						await deleteRecordTrigger(props.row.original);
			// 					}}
			// 					title="Delete record"
			// 					className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
			// 				>
			// 					<div>
			// 						<FontAwesomeIcon icon={faTrashAlt} />
			// 					</div>
			// 				</button>
			// 			</div>
			// 		);
			// 	},
			// },
		];
	}, []);

	function TableWrapper({ columns }: { columns: Column<PressureRecord>[] }) {
		const log = useLog();
		const { data } = useCollection();

		const mappedData = data?.map((x) => {
			const map: PressureRecord = {
				id: x.id,
				newPressure: x.newPressure,
				gasType: x.gasType,
				comment: x.notes,
				timestamp: toTemporal(x.timestamp as Timestamp, log),
				overseenBy: x.overseenBy,
				location: x.location,
			};

			return map;
		});

		return <Table data={mappedData} columns={columns} />;
	}

	return <TableWrapper columns={columns} />;
};

const TestTable = ({
	itemId,
	itemCollection,
	editRecordTrigger,
	deleteRecordTrigger,
}: {
	itemId: string;
	itemCollection: string;
	editRecordTrigger: (record: TestRecord) => void;
	deleteRecordTrigger: (record: TestRecord) => void;
}) => {
	const useCollection = (suspense = true) =>
		useFirestoreCollectionData(
			query(
				collection(doc(collection(useFirestore(), itemCollection), itemId), "testRecords"),
				orderBy("nextDue")
			),
			{
				idField: "id",
				suspense: suspense,
			}
		);

	const columns = useMemo<Column<TestRecord>[]>(() => {
		return [
			{
				accessor: "performedAt",
				Header: "Performed At",
				Cell: function (props: Cell<TestRecord>) {
					return <TimestampCell zdt={props.row.original.performedAt} />;
				},
			},
			{
				accessor: "nextDue",
				Header: "Next Due",
				Cell: function (props: Cell<TestRecord>) {
					return <TimestampCell zdt={props.row.original.nextDue} />;
				},
			},
			{
				Header: "Pass/Fail",
				accessor: "pass",
			},
			{
				Header: "Tested By",
				accessor: "tester",
			},
			{
				Header: "Test Location",
				accessor: "testLocation",
			},
			// {
			// 	Header: "Actions",
			// 	Cell: function ActionCell(props: Cell<TestRecord>) {
			// 		return (
			// 			<div className="flex items-center p-4 space-x-2">
			// 				{/*className="p-2 transition-colors duration-200 rounded-50 text-white bg-secondary-50 hover:text-secondary hover:bg-secondary-100 dark:hover:text-light dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker"*/}
			// 				<button
			// 					onClick={async () => {
			// 						await editRecordTrigger(props.row.original);
			// 					}}
			// 					title="Edit record"
			// 					className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
			// 				>
			// 					<div>
			// 						<FontAwesomeIcon icon={faEdit} />
			// 					</div>
			// 				</button>
			// 				<button
			// 					onClick={async () => {
			// 						await deleteRecordTrigger(props.row.original);
			// 					}}
			// 					title="Delete record"
			// 					className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
			// 				>
			// 					<div>
			// 						<FontAwesomeIcon icon={faTrashAlt} />
			// 					</div>
			// 				</button>
			// 			</div>
			// 		);
			// 	},
			// },
		];
	}, []);

	function TableWrapper({ columns }: { columns: Column<TestRecord>[] }) {
		const log = useLog();
		const { data } = useCollection();

		const mappedData = data?.map((x) => {
			const map: TestRecord = {
				id: x.id,
				performedAt: toTemporal(x.performedAt as Timestamp, log),
				nextDue: toTemporal(x.nextDue as Timestamp, log),
				pass: x.overseenBy,
				tester: x.tester,
				testLocation: x.testLocation,
			};

			return map;
		});

		return <Table data={mappedData} columns={columns} />;
	}

	return <TableWrapper columns={columns} />;
};

const Tabs = ({
	enablePressure,
	enableTest,
	itemCollection,
	itemId,
}: {
	enablePressure: boolean;
	enableTest: boolean;
	itemCollection: string;
	itemId: string;
}) => {
	const log = useLog();

	const [openTab, setOpenTab] = useState<1 | 2 | 3>(1);
	const openRecordPanelForTab = () => {
		log.debug("Opening record panel");
		switch (openTab) {
			case 1:
				setNewPressureRecordPanelOpen(false);
				setConditionRecordPanelOpen(true);
				setTestRecordPanelOpen(false);
				break;
			case 2:
				setNewPressureRecordPanelOpen(true);
				setConditionRecordPanelOpen(false);
				setTestRecordPanelOpen(false);
				break;
			case 3:
				setNewPressureRecordPanelOpen(false);
				setConditionRecordPanelOpen(false);
				setTestRecordPanelOpen(true);
				break;
			default:
				throw new AppError(601, "Invalid tab code for records");
		}
	};

	const firestore = useFirestore();

	const analytics = useAnalytics();

	useEffect(() => {
		logEvent(analytics, "select_item", {
			item_list_id: `${itemCollection}_list`,
			item_list_name: `${itemCollection[0].toUpperCase() + itemCollection.substring(1)} List`,
			items: [
				{
					item_id: itemId,
				},
			],
		});
	}, [analytics, itemCollection, itemId]);

	useEffect(() => {
		let data = {};

		if (openTab === 1) {
			data = {
				firebase_screen: "condition_record_table",
			};
		} else if (openTab === 2) {
			data = {
				firebase_screen: "pressure_record_table",
			};
		} else if (openTab === 3) {
			data = {
				firebase_screen: "condition_test_table",
			};
		}

		// @ts-ignore
		logEvent(analytics, "screen_view", data);
	}, [openTab, analytics]);

	const [saveEditedRecord, setSaveEditedRecord] = useState(false);

	const newPressureRecordForm = useForm<{ record: PressureRecord; parentId: string }>();
	newPressureRecordForm.setValue("parentId", itemId);
	const [newPressureRecordPanelOpen, setNewPressureRecordPanelOpen] = useState(false);
	const savePressureRecord = async (record: { record: PressureRecord; parentId: string }) => {
		if (itemCollection !== "cylinders") {
			log.error(
				"Tried to update a pressure record for a type (%s) that does not support pressure!",
				itemCollection
			);
			throw new AppError(601, "Attempted to add pressure record to unsupported type");
		}
		try {
			await SavePressureRecord(record.record, record.parentId, "cylinders", saveEditedRecord, log, firestore);
			setNewPressureRecordPanelOpen(false);
			setSaveEditedRecord(false);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error adding new pressure record to firestore collection. Values: %j", record);
		}
	};
	const [editTargetPressureRecord, setEditTargetPressureRecord] = useState<
		{ record: PressureRecord; parentId: string } | undefined
	>();
	const triggerPressureEdit = (record: PressureRecord) => {
		setEditTargetPressureRecord({ record: record, parentId: itemId });
		setNewPressureRecordPanelOpen(true);
		setSaveEditedRecord(true);
	};
	const triggerPressureDelete = async (record: PressureRecord) => {
		try {
			await DeletePressureRecord(record.id, itemId, "cylinders", log, firestore);
			setNewPressureRecordPanelOpen(false);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error deleting pressure record from firestore collection. Values: %j", record);
		}
	};

	const testRecordForm = useForm<TestRecord>();
	const [testRecordPanelOpen, setTestRecordPanelOpen] = useState(false);
	const saveTestRecord = async (record: TestRecord) => {
		try {
			await SaveTestRecord(record, itemId, itemCollection, saveEditedRecord, log, firestore);
			setTestRecordPanelOpen(false);
			setSaveEditedRecord(false);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error adding new test record to firestore collection. Values: %j", record);
		}
	};
	const [editTargetTestRecord, setEditTargetTestRecord] = useState<TestRecord | undefined>();
	const triggerTestEdit = (record: TestRecord) => {
		setEditTargetTestRecord(record);
		setTestRecordPanelOpen(true);
		setSaveEditedRecord(true);
	};
	const triggerTestDelete = async (record: TestRecord) => {
		try {
			await DeleteTestRecord(record.id, itemId, itemCollection, log, firestore);
			setTestRecordPanelOpen(false);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error deleting test record from firestore collection. Values: %j", record);
		}
	};

	const conditionRecordForm = useForm<ConditionRecord>();
	const [conditionRecordPanelOpen, setConditionRecordPanelOpen] = useState(false);
	const saveConditionRecord = async (record: ConditionRecord) => {
		try {
			await SaveConditionRecord(record, itemId, itemCollection, saveEditedRecord, log, firestore);
			setConditionRecordPanelOpen(false);
			setSaveEditedRecord(false);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error adding new condition record to firestore collection. Values: %j", record);
		}
	};
	const [editTargetConditionRecord, setEditTargetConditionRecord] = useState<ConditionRecord | undefined>();
	const triggerConditionEdit = (record: ConditionRecord) => {
		setEditTargetConditionRecord(record);
		setConditionRecordPanelOpen(true);
		setSaveEditedRecord(true);
	};
	const triggerConditionDelete = async (record: ConditionRecord) => {
		try {
			await DeleteConditionRecord(record.id, itemId, itemCollection, log, firestore);
			setConditionRecordPanelOpen(false);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error deleting condition record from firestore collection. Values: %j", record);
		}
	};

	// noinspection HtmlUnknownAnchorTarget
	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-full">
					<div className="flex flex-wrap flex-row justify-between content-start items-stretch">
						<Link href={`/equipment/${itemCollection.substring(0, itemCollection.length - 1)}`}>
							<a className="align-start text-center inline-flex">
								<FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6" />
								<span className="ml-2 mr-5 underline">Back to {itemCollection}</span>
							</a>
						</Link>
						<p className="align-end text-center">
							Id: <span>{itemId}</span>
						</p>
					</div>
				</div>
				<div className="w-full">
					<ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
						<li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
							<a
								className={
									"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
									(openTab === 1
										? "text-white bg-secondary-darker"
										: "text-secondary border border-secondary")
								}
								onClick={(e) => {
									e.preventDefault();
									setOpenTab(1);
								}}
								data-toggle="tab"
								href="#link1"
								role="tablist"
							>
								Condition
							</a>
						</li>
						<li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
							<a
								className={
									"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
									(openTab === 2
										? "text-white bg-secondary-darker"
										: "text-secondary border border-secondary")
								}
								onClick={(e) => {
									e.preventDefault();
									if (enablePressure) {
										setOpenTab(2);
									}
								}}
								data-toggle="tab"
								href="#link2"
								role="tablist"
							>
								Pressure
							</a>
						</li>
						<li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
							<a
								className={
									"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
									(openTab === 3
										? "text-white bg-secondary-darker"
										: "text-secondary border border-secondary")
								}
								onClick={(e) => {
									e.preventDefault();
									if (enableTest) {
										setOpenTab(3);
									}
								}}
								data-toggle="tab"
								href="#link3"
								role="tablist"
							>
								Test
							</a>
						</li>
					</ul>
					<div className="flex flex-row">
						<button
							onClick={openRecordPanelForTab}
							title={`Add new ${
								openTab === 1 ? "condition" : openTab === 2 ? "pressure" : "test"
							} record`}
							className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
						>
							<>
								<FontAwesomeIcon icon={faPlusSquare} className="" />
							</>
						</button>
						<p className="ml-2 self-center">
							Add new {openTab === 1 ? "condition" : openTab === 2 ? "pressure" : "test"} record
						</p>
					</div>
					<div className="relative flex flex-col break-words ">
						<div className="py-2 flex-auto">
							<div className="tab-content tab-space">
								<div className={openTab === 1 ? "block" : "hidden"} id="link1">
									<ConditionTable
										itemId={itemId}
										itemCollection={itemCollection}
										editRecordTrigger={triggerConditionEdit}
										deleteRecordTrigger={triggerConditionDelete}
									/>
								</div>
								<div className={openTab === 2 ? "block" : "hidden"} id="link2">
									<PressureTable
										itemId={itemId}
										itemCollection={itemCollection}
										editRecordTrigger={triggerPressureEdit}
										deleteRecordTrigger={triggerPressureDelete}
									/>
								</div>
								<div className={openTab === 3 ? "block" : "hidden"} id="link3">
									<TestTable
										itemId={itemId}
										itemCollection={itemCollection}
										editRecordTrigger={triggerTestEdit}
										deleteRecordTrigger={triggerTestDelete}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<PressureRecordPanel
				data={editTargetPressureRecord}
				panelOpen={newPressureRecordPanelOpen}
				pressureRecordForm={newPressureRecordForm}
				savePressureRecord={savePressureRecord}
				setPanelOpen={setNewPressureRecordPanelOpen}
			/>
			<TestRecordPanel
				data={editTargetTestRecord}
				panelOpen={testRecordPanelOpen}
				recordForm={testRecordForm}
				saveRecord={saveTestRecord}
				setPanelOpen={setTestRecordPanelOpen}
			/>
			<ConditionRecordPanel
				data={editTargetConditionRecord}
				panelOpen={conditionRecordPanelOpen}
				recordForm={conditionRecordForm}
				saveRecord={saveConditionRecord}
				setPanelOpen={setConditionRecordPanelOpen}
			/>
		</>
	);
};

export default function WrappedTabs({
	enablePressure,
	enableTest,
	itemCollection,
	itemId,
}: {
	enablePressure: boolean;
	enableTest: boolean;
	itemCollection: string;
	itemId: string;
}) {
	return (
		<FirestoreWrapper>
			<Tabs
				enablePressure={enablePressure}
				enableTest={enableTest}
				itemCollection={itemCollection}
				itemId={itemId}
			/>
		</FirestoreWrapper>
	);
}
