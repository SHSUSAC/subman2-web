import React, { useCallback, useEffect, useState } from "react";
import { useLog } from "../../components/common/LogProvider";
import { useThemeConfigPersistence } from "../hooks/localStorageHooks";

export type lightModes = "dark" | "light";
export type availableColours = "green" | "blue" | "cyan" | "teal" | "fuchsia" | "violet";

export type ThemeContextType = {
	lightMode: lightModes;
	setLightMode: (lightMode: lightModes) => void;
	colour: availableColours;
	setColour: (colour: availableColours) => void;
	iconColour: string;
};

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const logger = useLog();
	const [themeUpdating, setThemeUpdating] = useState(false);
	const [theme, setTheme] = useThemeConfigPersistence();

	const modifyCssColours = useCallback(
		(colour: availableColours) => {
			try {
				const root = document.documentElement;
				root.style.setProperty("--color-primary", `var(--color-${colour})`);
				root.style.setProperty("--color-primary-50", `var(--color-${colour}-50)`);
				root.style.setProperty("--color-primary-100", `var(--color-${colour}-100)`);
				root.style.setProperty("--color-primary-light", `var(--color-${colour}-light)`);
				root.style.setProperty("--color-primary-lighter", `var(--color-${colour}-lighter)`);
				root.style.setProperty("--color-primary-dark", `var(--color-${colour}-dark)`);
				root.style.setProperty("--color-primary-darker", `var(--color-${colour}-darker)`);
			} catch (error) {
				logger.error("Error while modifying CSS colour variables.", error);
			}
		},
		[logger]
	);

	useEffect(() => {
		setThemeUpdating(true);
		modifyCssColours(theme.colour);
	}, [modifyCssColours, theme.colour]);

	useEffect(() => {
		if (!themeUpdating) return;
		logger.debug("Loading theme provider from effect");
		setTheme({
			...theme,
			setColour: (colour: availableColours) => {
				logger.info(`Changing colour to: '${colour}' from '${theme.colour}'`);
				logger.debug("Modifying colour variables. Entering escape hatch javascript");
				modifyCssColours(colour);
				const newIconColour = getComputedStyle(document.documentElement).getPropertyValue(
					"--color-primary-lighter"
				);
				logger.debug("Exiting escape hatch");
				setTheme({ ...theme, colour: colour, iconColour: newIconColour });
				setThemeUpdating(true);
			},
			setLightMode: (lightMode: lightModes) => {
				logger.info(`Changing light mode to: '${lightMode}' from '${theme.lightMode}'`);
				setTheme({ ...theme, lightMode: lightMode });
				setThemeUpdating(true);
			},
		});
		setThemeUpdating(false);
	}, [logger, modifyCssColours, setTheme, theme, themeUpdating]);

	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
