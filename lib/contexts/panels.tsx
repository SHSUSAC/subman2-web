import { createContext, ReactNode, useState } from "react";

export type BasePanelTypes = {
	open: boolean;
	toggle: () => void;
};

export const SettingsPanelContext = createContext<BasePanelTypes | undefined>(undefined);

export default function PanelProvider({ children }: { children: ReactNode }): JSX.Element {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<SettingsPanelContext.Provider value={{ open: settingsOpen, toggle: () => setSettingsOpen(!settingsOpen) }}>
			{children}
		</SettingsPanelContext.Provider>
	);
}
