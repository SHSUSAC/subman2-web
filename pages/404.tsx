import React from "react";
import Error from "./_error";
import { useGlobalLog } from "../components/common/LogProvider";

export default function _404(): JSX.Element {
	const log = useGlobalLog();
	log.warn("Non-existent URL was requested");
	return <Error statusCode={404} />;
}
