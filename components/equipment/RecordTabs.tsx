import React, { useEffect, useMemo, useState } from "react";
import { Cell, Column } from "react-table";
import { Table } from "../common/Table";
import { PressureRecord } from "../../lib/types/records/PressureRecord";
import { useAnalytics, useFirestore, useFirestoreCollectionData } from "reactfire";
import { query, collection, doc, Timestamp } from "firebase/firestore";
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

const ConditionTable = ({ itemId, itemCollection }: { itemId: string; itemCollection: string }) => {
	const useCollection = (suspense = true) =>
		useFirestoreCollectionData(
			query(collection(doc(collection(useFirestore(), itemCollection), itemId), "conditionRecords")),
			{
				idField: "id",
				suspense: suspense,
			}
		);

	const TimestampCell = ({ zdt }: { zdt: datePhases }) => {
		const log = useLog();
		log.trace("Rendering");
		const date = toTemporal(zdt, log);
		return (
			<>
				<p>
					{date?.day}/{date?.month}/{date?.year}
				</p>
			</>
		);
	};

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

const PressureTable = ({ itemId, itemCollection }: { itemId: string; itemCollection: string }) => {
	const useCollection = (suspense = true) =>
		useFirestoreCollectionData(
			query(collection(doc(collection(useFirestore(), itemCollection), itemId), "pressureRecords")),
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
					const log = useLog();
					log.trace("Rendering");
					const date = toTemporal(props.row.original.timestamp, log);
					return (
						<>
							<p>
								{date?.day}/{date?.month}/{date?.year}
							</p>
						</>
					);
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

const TestTable = ({ itemId, itemCollection }: { itemId: string; itemCollection: string }) => {
	const useCollection = (suspense = true) =>
		useFirestoreCollectionData(
			query(collection(doc(collection(useFirestore(), itemCollection), itemId), "testRecords")),
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
					const log = useLog();
					log.trace("Rendering");
					const date = toTemporal(props.row.original.performedAt, log);
					return (
						<>
							<p>
								{date?.day}/{date?.month}/{date?.year}
							</p>
						</>
					);
				},
			},
			{
				accessor: "nextDue",
				Header: "Next Due",
				Cell: function (props: Cell<TestRecord>) {
					const log = useLog();
					log.trace("Rendering");
					const date = toTemporal(props.row.original.nextDue, log);
					return (
						<>
							<p>
								{date?.day}/{date?.month}/{date?.year}
							</p>
						</>
					);
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
	const [openTab, setOpenTab] = useState(1);

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

	// noinspection HtmlUnknownAnchorTarget
	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-full">
					<div className="flex flex-wrap flex-row justify-between content-start items-stretch">
						<Link href={`/equipment/${itemCollection.substring(0, itemCollection.length - 1)}`}>
							<a className="align-start text-center inline-flex">
								<FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6" />
								<span className="mr-5 underline">Back to {itemCollection}</span>
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
					<div className="relative flex flex-col break-words ">
						<div className="py-2 flex-auto">
							<div className="tab-content tab-space">
								<div className={openTab === 1 ? "block" : "hidden"} id="link1">
									<ConditionTable itemId={itemId} itemCollection={itemCollection} />
								</div>
								<div className={openTab === 2 ? "block" : "hidden"} id="link2">
									<PressureTable itemId={itemId} itemCollection={itemCollection} />
								</div>
								<div className={openTab === 3 ? "block" : "hidden"} id="link3">
									<TestTable itemId={itemId} itemCollection={itemCollection} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
