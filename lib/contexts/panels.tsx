import React, { useState } from "react";
import { toast, ToastContent, ToastOptions, TypeOptions } from "react-toastify";

export type BasePanelTypes = {
	open: boolean;
	toggle: () => void;
};

export const SettingsPanelContext = React.createContext<BasePanelTypes | undefined>(undefined);

export default function PanelProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<SettingsPanelContext.Provider value={{ open: settingsOpen, toggle: () => setSettingsOpen(!settingsOpen) }}>
			{children}
		</SettingsPanelContext.Provider>
	);
}
