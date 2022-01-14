import { Temporal } from "@js-temporal/polyfill";

export type TestRecord = {
	/**
	 * Assigned system ID. DO NOT EDIT OR ASSIGN THIS
	 */
	id: string;
	/**
	 * When the test was performed
	 */
	performedAt: Temporal.ZonedDateTime;
	/**
	 * When another test is next due
	 */
	nextDue: Temporal.ZonedDateTime;
	/**
	 * The result of the test
	 */
	pass: boolean;
	/**
	 * The name of the tester/organisation that performed the test
	 */
	tester: string;
	/**
	 * The location the test was performed at
	 */
	testLocation: string;
};
