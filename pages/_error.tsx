import { NextPageContext } from "next";
import React from "react";
import styles from "../assets/styles/error.module.css";
import { useLog } from "../components/common/LogProvider";

const statusCodes: { [code: number]: string } = {
	//HTTP Errors
	400: "The server did not understand the request from the browser",
	401: "You need to be signed in for that",
	403: "You don't have permission to see this page",
	404: "This page could not be found",
	405: "The remote server refused to honor this type of request",
	500: "An HTTP error on the remote server has occurred",
	//Client app errors
	600: "An error in the app has occurred",
	601: "An entity has failed it's type safety checks, aborting the current operation",
	602: "A required context was missing from the tree",
	//Server app errors
	700: "An application error on the remote server has occurred",
	701: "The remote database is incorrectly configured and cannot handle the request",
};

export type ErrorProps = {
	statusCode?: number;
	title?: string;
	error?: Error;
};

function errorToCode(error: Error, log: any): number {
	log.debug("Decoding error object to code");
	if (error.name === "FirebaseError") {
		log.trace("Is a firebase error");
		if (error.message === "No matching allow statements") {
			log.trace("Firebase rules are missing! Code 701");
			return 701;
		}
	}

	log.trace("Unable to decode. Returning default application error. Code 600");
	return 600;
}

/**
 * `Error` component used for handling errors.
 */
const Error = (props: Record<string, unknown> & ErrorProps): JSX.Element => {
	const { statusCode } = props;
	const log = useLog("ErrorComponent");

	let code = statusCode;
	if (!code) {
		if (props.error) {
			code = errorToCode(props.error, log);
		} else {
			code = 600;
		}
	}
	let title;

	if (code > 599) {
		if (props.error) {
			title = `${statusCodes[code]} (${props.error?.message})`;
		} else if (props.title) {
			title = `${statusCodes[code]} (${props.title})`;
		} else {
			title = statusCodes[code];
		}
	} else {
		title = statusCodes[code] || props.error?.message || "An unexpected error has occurred";
	}

	return (
		<div className="flex flex-col flex-1 items-center justify-center">
			<div className={`${styles.box}`}>
				<div className={styles.inner}>
					<span>{"Code " + code}</span>
				</div>
				<div className={styles.inner}>
					<span>{"Code " + code}</span>
				</div>
			</div>
			<p className="text-center m-4">{title}</p>
			{code > 599 && code < 700 && (
				<p className="text-center m-4">
					Cleaning your browser&apos;s cache and/or refreshing the page may help
				</p>
			)}
		</div>
	);
};

Error.getInitialProps = function ({ res, err }: NextPageContext): Promise<ErrorProps> | ErrorProps {
	const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode! : 404;
	return { statusCode };
};

/**
 * `Error` component used for handling errors.
 */
export default Error;
