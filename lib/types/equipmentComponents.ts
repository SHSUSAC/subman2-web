import { Temporal } from "@js-temporal/polyfill";
import { Timestamp } from "firebase/firestore";
import { useLog } from "../../components/common/LogProvider";

export const EquipmentConditions = [
	"OK",
	/**
	 * The equipment MUST NOT be used
	 */
	"Do Not Use",
	/**
	 * The equipment is currently on loan to a club member
	 */
	"Loaned",
	/**
	 * The equipment is okay to use but is restricted to pool use
	 */
	"Pool Only",
	/**
	 * The equipment is waiting for repair.
	 *
	 * @remarks
	 * It is possible for the equipment to be used in this state but it is not recommended
	 */
	"Pending Repair",
	/**
	 * The equipment is currently being repaired and SHOULD NOT be used
	 */
	"Repair In Progress",
	/**
	 * The equipment is waiting for tests to be performed and MUST NOT be used
	 */
	"Pending Test",
	/**
	 * The equipment is being tested and MUST NOT be used
	 */
	"Testing in Progress",
] as const;

export type EquipmentConditions = typeof EquipmentConditions[number];

export type CommonEquipmentProperties = {
	/**
	 * Assigned system ID. DO NOT EDIT OR ASSIGN THIS
	 */
	id: string;

	/**
	 * An easily referenced custom tag.
	 */
	userTag: string;
	/**
	 * The current condition of the equipment
	 *
	 * @see EquipmentCondition
	 */
	condition: EquipmentConditions;
	/**
	 * Freeform notes
	 */
	notes: string;
};

export type datePhases = Temporal.ZonedDateTime | Timestamp | string;
