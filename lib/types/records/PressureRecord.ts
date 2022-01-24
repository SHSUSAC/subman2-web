import { datePhases } from "../equipmentComponents";

/**
 * A record of a pressure change for a piece of equipment
 *
 * @public
 *
 * @remarks
 * Currently this is only really useful for cylinders but could be used with other items of equipment in the future
 */
export type PressureRecord = {
	/**
	 * Assigned system ID. DO NOT EDIT OR ASSIGN THIS
	 */
	id: string;

	/**
	 * The pressure change that occurred.
	 */
	newPressure: number;

	/**
	 * Any comments associated with this record
	 */
	comment?: string;

	/**
	 * What gas type was added or removed from the equipment
	 *
	 * @remarks
	 * Suggested values: Air, Nitrox, Triox
	 */
	gasType?: string;
	/**
	 * When the change described in the record occurred
	 */
	timestamp: datePhases;
	/**
	 * Where the change described in the record occurred
	 */
	location?: string;
	/**
	 * Who saw/was responsible for the change described in the record
	 */
	overseenBy: string;
};
