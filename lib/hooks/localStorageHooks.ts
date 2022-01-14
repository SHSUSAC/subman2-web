import { createLocalStorageStateHook } from "use-local-storage-state";
import { ThemeContextType } from "../contexts/theme";
// import { useLog } from "../../components/common/LogProvider";

export const useGdprConsent = createLocalStorageStateHook("GDPR_CONSENT", false);
export const useGdprConsentBannerShown = createLocalStorageStateHook("GDPR_CONSENT", false);
export const useLogLevel = createLocalStorageStateHook("log", "warn");

export const useThemeConfigPersistence = createLocalStorageStateHook("theming", () => {
	// const logger = useLog();
	return {
		lightMode: "dark",
		setColour: () => {
			// logger.warn("setColor called from default implementation. Check context usage!");
		},
		colour: "cyan",
		setLightMode: () => {
			// logger.warn("setLightMode called from default implementation. Check context usage!");
		},
		iconColour: "teal",
	} as ThemeContextType;
});
