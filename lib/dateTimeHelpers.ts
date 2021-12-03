// export function toString(data: datePhases, log: Logger): string {
// 	let parsed = data;
// 	if (typeof parsed != "string") {
// 		parsed = toTemporal(data, log);
// 		parsed.to
// 	}
//
// 	return parsed;
// }

import { Timestamp } from "firebase/firestore";
import { datePhases } from "./types/equipmentComponents";
import { Logger } from "./types/logging";
import { Temporal } from "@js-temporal/polyfill";

export function toFirestore(data: datePhases, log: Logger): Timestamp {
	let parsed: datePhases = data;
	if (typeof parsed == "string") {
		parsed = stringToZdt(parsed, log);
	}

	if (!(parsed instanceof Timestamp)) {
		log?.debug("Converting nextDue to timestamp via millis");
		parsed = Timestamp.fromMillis(parsed.epochMilliseconds);
	}

	return parsed;
}

function stringToZdt(data: string, log: Logger) {
	log?.debug("nextDue form value (before parsing) %s", data);
	const pd = Temporal.PlainDate.from(data);
	const zdt = pd.toZonedDateTime(Temporal.Now.timeZone());
	log?.debug("Parsed nextDue to %s (%j)", zdt, zdt);
	return zdt;
}

export function toTemporal(data: datePhases, log: Logger): Temporal.ZonedDateTime {
	let parsed = data;
	if (typeof parsed == "string") {
		parsed = stringToZdt(parsed, log);
	}

	if (parsed instanceof Timestamp) {
		parsed = Temporal.Instant.fromEpochSeconds(parsed.seconds).toZonedDateTimeISO(Temporal.Now.timeZone());
	}

	return parsed;
}

export function toFormDateString(log: Logger, data?: datePhases): string | undefined {
	if (!data) return undefined;
	const parsed = toTemporal(data, log);
	return `${parsed.year}-${parsed.month}-${parsed.day}`;
}
