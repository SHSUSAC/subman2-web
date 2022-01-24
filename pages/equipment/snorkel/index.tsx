import BasicEquipmentPage from "../../../layouts/basicEquipmentPage";
import LogProvider from "../../../components/common/LogProvider";

export default function Index() {
	return (
		<LogProvider name="SnorkelIndex">
			<BasicEquipmentPage itemCollection="snorkels" />
		</LogProvider>
	);
}
