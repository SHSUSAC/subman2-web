import { Temporal } from "@js-temporal/polyfill";

/**
 * Possible outcomes of a repair
 *
 * @public
 */
export type RepairOutcomes = "Internally Repaired" | "Externally Repaired" | "Unrecoverable";

export type ConditionRecord = {
	/**
	 * Assigned system ID. DO NOT EDIT OR ASSIGN THIS
	 */
	id: string;
	/**
	 * When the fault was discovered
	 */
	reportedAt: Temporal.ZonedDateTime;
	/**
	 * Who discovered the fault
	 */
	reportedBy: string;
	/**
	 * When the fault was repaired
	 */
	repairedAt?: Temporal.ZonedDateTime;
	/**
	 * Who performed the repair
	 */
	repairedBy?: string;
	/**
	 * When the repair was approved as complete
	 */
	approvedAt?: Temporal.ZonedDateTime;
	/**
	 * Who approved the repair work
	 *
	 * @remarks
	 * It is not currently enforced that this must be different to repairedBy
	 *
	 * @see repairedBy
	 */
	approvedBy?: string;
	/**
	 * A description of the fault/damage
	 */
	faultDescription: string;
	/**
	 * A description of the repair performed
	 */
	repairDescription?: string;
	/**
	 * The outcome of the repair
	 */
	outcome?: RepairOutcomes;
};
