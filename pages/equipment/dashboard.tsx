import React from "react";
import { faBatteryEmpty, faSuitcase, faTools } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { StatCard } from "../../components/common/Card";
import { useAuthErrorPages } from "../../lib/hooks/useAuthErrorPages";
import { useFirestoreCollectionData, useFirestore } from "reactfire";
import { query, collection, where } from "firebase/firestore";
import { EquipmentConditions } from "../../lib/types/equipmentComponents";
import FirestoreWrapper from "../../components/_app/FirestoreWrapper";

function BasicCards({
	name,
}: {
	name: "fins" | "masks" | "snorkels" | "weights" | "bcds" | "cylinders" | "regulators";
}) {
	const value: EquipmentConditions = "Pending Repair";

	const pendingRepair = useFirestoreCollectionData(
		query(collection(useFirestore(), name), where("condition", "==", value)),
		{
			suspense: true,
		}
	).data.length;

	return (
		<>
			{/*<StatCard value={onLoan} label="Loaned" icon={faSuitcase}/>*/}
			<StatCard value={pendingRepair} label="Require maintenance" icon={faTools} />
		</>
	);
}

function BasicStats({
	name,
}: {
	name: "fins" | "masks" | "snorkels" | "weights" | "bcds" | "cylinders" | "regulators";
}) {
	return (
		<>
			<div className="flex items-center justify-between px-4 py-1 lg:py-6 dark:border-primary-darker">
				<h2 className="text-xl font-semibold text-capitalise">{name == "bcds" ? "BCDs" : name}</h2>
			</div>

			<div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
				<BasicCards name={name} />
			</div>
		</>
	);
}

function TestableCard({ name }: { name: "regulators" | "cylinders" }) {
	const value: EquipmentConditions = "Pending Test";

	const pendingTest = useFirestoreCollectionData(
		query(collection(useFirestore(), name), where("condition", "==", value)),
		{
			suspense: true,
		}
	).data.length;

	return (
		<>
			<StatCard value={pendingTest} label="Due for test" icon={faNewspaper} />
			<BasicCards name={name} />
		</>
	);
}

function TestableStats({ name }: { name: "regulators" | "cylinders" }) {
	return (
		<>
			<div className="flex items-center justify-between px-4 py-1 lg:py-6 dark:border-primary-darker">
				<h2 className="text-xl font-semibold text-capitalise">{name}</h2>
			</div>

			<div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
				<TestableCard name={name} />
			</div>
		</>
	);
}

function PressureSats({ name }: { name: "cylinders" }) {
	const pendingRefill = useFirestoreCollectionData(
		query(collection(useFirestore(), name), where("pressure", "<=", 80)),
		{
			suspense: true,
		}
	).data.length;

	return (
		<>
			<div className="flex items-center justify-between px-4 py-1 lg:py-6 dark:border-primary-darker">
				<h2 className="text-xl font-semibold text-capitalise">{name}</h2>
			</div>

			<div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
				<StatCard value={pendingRefill} label="Require refill" icon={faBatteryEmpty} />
				<TestableCard name={name} />
				<BasicCards name={name} />
			</div>
		</>
	);
}

// noinspection JSUnusedGlobalSymbols
export default function Dashboard(): JSX.Element {
	const hasPagePermission = useAuthErrorPages("EquipmentRole", "Reader");
	if (hasPagePermission) {
		return hasPagePermission;
	}

	return (
		<FirestoreWrapper>
			<main>
				<header className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
					<h1 className="text-2xl font-semibold">Dashboard</h1>
				</header>

				<div className="mt-2">
					<PressureSats name={"cylinders"} />
					<TestableStats name={"regulators"} />
					<BasicStats name={"bcds"} />
					<BasicStats name={"fins"} />
					<BasicStats name={"masks"} />
					<BasicStats name={"snorkels"} />
					<BasicStats name={"weights"} />
				</div>
			</main>
			<div className="h-full" />
		</FirestoreWrapper>
	);
}
