import RecordTabs from "../../../components/equipment/RecordTabs";
import Error from "../../_error";
import { useRouter } from "next/router";

export default function Records() {
	const router = useRouter();
	const qs = new URLSearchParams(router.asPath.split(/\?/)[1]);
	const itemId = qs.get("id");
	if (!itemId) {
		return <Error statusCode={404} />;
	}
	return <RecordTabs enablePressure={true} enableTest={true} itemCollection={"cylinders"} itemId={itemId} />;
}
