import RecordTabs from "../../../components/equipment/RecordTabs";
import Error from "../../_error";
import queryString from "querystring";
import { useRouter } from "next/router";

export default function Records() {
	const router = useRouter();
	const qs = queryString.parse(router.asPath.split(/\?/)[1]);
	const itemId = qs.id;
	if (typeof itemId !== "string") {
		return <Error statusCode={601} />;
	}
	return <RecordTabs enablePressure={false} enableTest={false} itemCollection={"masks"} itemId={itemId} />;
}
