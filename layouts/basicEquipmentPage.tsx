import { faPlusSquare, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faEdit, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cell, Column } from "react-table";
import { CommonEquipmentProperties } from "../lib/types/equipmentComponents";
import LogProvider, { useLog } from "../components/common/LogProvider";
import { Table } from "../components/common/Table";
import { AppError } from "../lib/types/errors";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NewEquipmentModal } from "../components/equipment/NewEquipmentModal";
import { GeneralEquipmentFormControls } from "../components/equipment/equipmentFormControls";
import { PanelDialog } from "../components/common/PanelDialog";
import SquaresLoader from "../components/common/SquaresLoader";
import { query, collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import Error from "../pages/_error";
import React from "react";
import FirestoreWrapper from "../components/_app/FirestoreWrapper";

function TableWrapper({
	columns,
	itemCollection,
}: {
	columns: Column<CommonEquipmentProperties>[];
	itemCollection: string;
}) {
	const { data } = useCollection(true, itemCollection);

	const mappedData = data?.map((x) => {
		const map: CommonEquipmentProperties = {
			id: x.id,
			notes: x.notes,
			userTag: x.userTag,
			condition: x.condition,
		};

		return map;
	});

	return <Table data={mappedData} columns={columns} />;
}

const useCollection = (suspense = true, itemCollection: string) =>
	useFirestoreCollectionData(query(collection(useFirestore(), itemCollection)), {
		idField: "id",
		suspense: suspense,
	});

export default function Wrapper({ itemCollection }: { itemCollection: string }): JSX.Element {
	return (
		<FirestoreWrapper>
			<BasicEquipmentPage itemCollection={itemCollection} />
		</FirestoreWrapper>
	);
}

function BasicEquipmentPage({ itemCollection }: { itemCollection: string }): JSX.Element | null {
	const firestore = useFirestore();
	const [newPanelOpen, setNewPanelOpen] = useState(false);
	const [deleteItem, setDeleteItem] = useState<CommonEquipmentProperties | null>(null);
	const [editItem, setEditItem] = useState<CommonEquipmentProperties | null>(null);
	const log = useLog();

	const [appError, setAppError] = useState<AppError>();

	const editEquipmentForm = useForm<CommonEquipmentProperties>();

	const columns = useMemo<Column<CommonEquipmentProperties>[]>(
		() => [
			{
				Header: "Tag",
				accessor: "userTag",
			},
			{
				Header: "Condition",
				accessor: "condition",
			},
			{
				Header: "Notes",
				accessor: "notes",
			},
			{
				Header: "Actions",
				Cell: function ActionCell(props: Cell<CommonEquipmentProperties>) {
					return (
						<div className="flex items-center p-4 space-x-2">
							{/*className="p-2 transition-colors duration-200 rounded-50 text-white bg-secondary-50 hover:text-secondary hover:bg-secondary-100 dark:hover:text-light dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker"*/}
							<button
								onClick={() => {
									setEditItem(props.row.original);
									editEquipmentForm.setValue("userTag", props.row.original.userTag);
									editEquipmentForm.setValue("notes", props.row.original.notes);
									editEquipmentForm.setValue("condition", props.row.original.condition);
								}}
								title="Edit equipment"
								className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
							>
								<div>
									<span className="sr-only">Edit equipment</span>
									<FontAwesomeIcon icon={faEdit} />
								</div>
							</button>
							<button
								onClick={() => {
									setDeleteItem(props.row.original);
								}}
								title="Delete equipment"
								className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
							>
								<div>
									<span className="sr-only">Delete equipment</span>
									<FontAwesomeIcon icon={faTrashAlt} />
								</div>
							</button>
							<Link
								href={`/equipment/${itemCollection.substring(
									0,
									itemCollection.length - 1
								)}/records?id=${encodeURIComponent(props.row.original.id)}`}
							>
								<a
									title="Equipment records"
									className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
								>
									<span className="sr-only">Records</span>
									<FontAwesomeIcon icon={faFileInvoice} />
								</a>
							</Link>
						</div>
					);
				},
			},
		],
		[editEquipmentForm, itemCollection]
	);

	const saveNewEquipment = (newItem: CommonEquipmentProperties) => {
		log.info("Adding new item, values: %j", newItem);
		try {
			addDoc(collection(firestore, itemCollection), newItem);
		} catch (e) {
			const err = e as AppError;
			err.code = 600;
			log.error(err, "Error adding new item to firestore collection");
			setAppError(err);
		} finally {
			setNewPanelOpen(false);
		}
	};

	const cancelNewEquipment = () => {
		setNewPanelOpen(false);
	};

	const writeEquipmentEdit = (d: CommonEquipmentProperties) => {
		try {
			updateDoc(doc(firestore, itemCollection, editItem?.id ?? ""), d);
		} finally {
			setEditItem(null);
		}
	};

	if (appError) {
		return <Error statusCode={appError.code} title={appError.message} />;
	}

	// @ts-ignore
	return (
		<>
			<PanelDialog open={deleteItem !== null} title="Are you sure you want to delete this?">
				<div className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain">
					<div className="flex-grow flex flex-col space-y-2">
						<label className="">
							Tag
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								readOnly
								placeholder="No Tag"
								value={deleteItem?.userTag}
							/>
						</label>
						<label className="">
							Notes
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								readOnly
								placeholder="No Notes"
								value={deleteItem?.notes}
							/>
						</label>
						<label className="">
							Condition
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								readOnly
								value={deleteItem?.condition}
							/>
						</label>
					</div>

					<div className="block md:flex mb-4 gap-8">
						<button
							type="button"
							className="w-full mb-2 md:mb-0 space-y-3 px-4 py-2 font-medium border border-primary-darker text-primary-darker text-center hover:text-white dark:text-white transition-colors duration-200 rounded-md hover:bg-primary-dark dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
							onClick={() => setDeleteItem(null)}
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => {
								try {
									deleteDoc(doc(firestore, itemCollection, deleteItem?.id ?? ""));
								} finally {
									setDeleteItem(null);
								}
							}}
							className="w-full space-y-3 px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
						>
							Delete
						</button>
					</div>
				</div>
			</PanelDialog>
			<PanelDialog
				open={editItem !== null}
				title={`Editing ${itemCollection.substring(0, itemCollection.length - 1)}`}
			>
				<FormProvider {...editEquipmentForm}>
					<form
						onSubmit={editEquipmentForm.handleSubmit(writeEquipmentEdit)}
						className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain"
					>
						<div className="flex-grow flex flex-col space-y-2">
							<GeneralEquipmentFormControls />
						</div>

						<div className="block md:flex mb-4 gap-8">
							<button
								type="button"
								className="w-full mb-2 md:mb-0 space-y-3 px-4 py-2 font-medium border border-primary-darker text-primary-darker text-center hover:text-white dark:text-white transition-colors duration-200 rounded-md hover:bg-primary-dark dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
								onClick={() => setEditItem(null)}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="w-full space-y-3 px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
							>
								Save changes
							</button>
						</div>
					</form>
				</FormProvider>
			</PanelDialog>
			<main>
				<header className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
					<h1 className="text-2xl font-semibold text-capitalise">{itemCollection}</h1>
					<div>
						<button
							onClick={() => {
								setNewPanelOpen(true);
							}}
							title={`Add new ${itemCollection.substring(0, itemCollection.length - 1)}`}
							className="p-2 w-12 h-12 transition-colors duration-200 rounded text-secondary-lighter dark:text-white bg-secondary-50 hover:bg-secondary-100 dark:hover:bg-secondary-dark dark:bg-secondary-darker focus:bg-secondary-100 dark:focus:bg-secondary-dark focus:ring-secondary-darker focus:outline-none"
						>
							<>
								<span className="sr-only">
									Add {itemCollection.substring(0, itemCollection.length - 1)}
								</span>
								<FontAwesomeIcon icon={faPlusSquare} className="" />
							</>
						</button>
					</div>
				</header>

				<div className="mt-2 w-full px-4 overflow-y-auto">
					<React.Suspense
						fallback={
							<div className="flex flex-col flex-1 items-center justify-center">
								<SquaresLoader />
								<p className="text-center m-4">Loading data...</p>
							</div>
						}
					>
						<TableWrapper columns={columns} itemCollection={itemCollection} />
					</React.Suspense>
				</div>
			</main>
			<div className="h-full" />
			<LogProvider name="NewDialog">
				{
					//@ts-ignore
					<NewEquipmentModal
						open={newPanelOpen}
						save={(c) => saveNewEquipment(c as CommonEquipmentProperties)}
						cancel={cancelNewEquipment}
						type="normal"
						title={`New ${itemCollection.substring(0, itemCollection.length - 1)}`}
					/>
				}
			</LogProvider>
		</>
	);
}
