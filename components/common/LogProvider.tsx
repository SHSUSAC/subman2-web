import React, { createContext, useContext } from "react";
import { ConsoleFormattedStream, createLogger, stdSerializers, TRACE } from "browser-bunyan";
import { Logger } from "../../lib/types/logging";

const rootLogName = "SubMan2-WebInterface";

export function _createRootLogger(): Logger {
	return createLogger({
		name: rootLogName,
		serializers: stdSerializers,
		streams: [
			{
				level: TRACE,
				stream: new ConsoleFormattedStream({
					logByLevel: true,
				}),
			},
		],
		src: true,
	});
}

export const useGlobalLog = _createRootLogger;

export const LogContext = createContext<Logger>(_createRootLogger());

export function ConstructLog(logger: Logger, name?: string) {
	let selectedLogger = logger;
	if (name) {
		let parentName;
		//unsafe
		try {
			// @ts-ignore
			parentName = logger.fields["childName"];
			if (!parentName) {
				parentName = "";
			} else {
				parentName = parentName + "/";
			}
		} catch (e) {}
		// @ts-ignore
		selectedLogger = selectedLogger.child({ childName: `${parentName}${name}` });
	}

	return selectedLogger;
}

export function useLog(name?: string) {
	const logger = useContext(LogContext);
	return ConstructLog(logger, name);
}

export default function LogProvider({ name, children }: { name?: string; children: React.ReactNode }) {
	let logger = useContext(LogContext);
	let parentName = "";

	//unsafe
	try {
		// @ts-ignore
		parentName = logger.fields["childName"];
		if (!parentName) {
			parentName = "";
		} else {
			parentName = parentName + "/";
		}
	} catch (e) {}

	let options = {};

	if (name) {
		options = { ...options, childName: `${parentName}${name}` };
	}

	if (Object.keys(options).length > 0) {
		logger.trace({ childProperties: options }, "Log provider is building a child with properties");
		// @ts-ignore
		// Bad type def in library. Override
		logger = logger.child(options, true);
	}

	return <LogContext.Provider value={logger}>{children}</LogContext.Provider>;
}
