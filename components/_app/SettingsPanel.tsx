import React, { useContext } from "react";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogProvider, { useLog } from "../common/LogProvider";
import { ThemeContext } from "../../lib/contexts/theme";
import { SettingsPanelContext } from "../../lib/contexts/panels";
import { PanelDialog } from "../common/PanelDialog";
import Error from "../../pages/_error";
import { useFirebaseApp, usePerformance } from "reactfire";
import { useGdprConsent, useLogLevel } from "../../lib/hooks/localStorageHooks";

function GdprToggle() {
	const [gdprConsented, setGdprConsented] = useGdprConsent();

	const app = useFirebaseApp();
	const perf = usePerformance();

	return (
		<button
			aria-hidden="true"
			className="relative focus:outline-none"
			onClick={() => {
				app.automaticDataCollectionEnabled = !gdprConsented;
				perf.dataCollectionEnabled = !gdprConsented;
				perf.instrumentationEnabled = !gdprConsented;
				setGdprConsented(!gdprConsented);
			}}
		>
			<div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-lighter" />
			<div
				className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-150 transform scale-110 rounded-full shadow-sm ${
					!gdprConsented
						? "translate-x-0 -translate-y-px  bg-white text-primary-dark"
						: "translate-x-6 text-primary-100 bg-primary-darker"
				}`}
			/>
		</button>
	);
}

function LogLevelSelector() {
	const log = useLog();
	const [loggingSetting, setLoggingSetting] = useLogLevel();
	return (
		<select
			className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
			value={loggingSetting}
			onChange={(s) => {
				log.info(`Setting logging level to ${s.currentTarget.value}`);
				localStorage.setItem("log", s.currentTarget.value);
				setLoggingSetting(s.currentTarget.value);
			}}
		>
			<option>trace</option>
			<option>debug</option>
			<option>info</option>
			<option>warn</option>
			<option>error</option>
		</select>
	);
}

function ThemeColourSelector() {
	const log = useLog();
	const theme = useContext(ThemeContext);

	return (
		<div>
			<button
				onClick={() => {
					log.debug("Changing colour to cyan");
					theme?.setColour("cyan");
				}}
				className="w-10 h-10 rounded-full"
				style={{
					backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-cyan"),
				}}
			/>
			<button
				onClick={() => {
					log.debug("Changing colour to teal");
					theme?.setColour("teal");
				}}
				className="w-10 h-10 rounded-full"
				style={{
					backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-teal"),
				}}
			/>
			<button
				onClick={() => {
					log.debug("Changing colour to green");
					theme?.setColour("green");
				}}
				className="w-10 h-10 rounded-full"
				style={{
					backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-green"),
				}}
			/>
			<button
				onClick={() => {
					log.debug("Changing colour to fuchsia");
					theme?.setColour("fuchsia");
				}}
				className="w-10 h-10 rounded-full"
				style={{
					backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-fuchsia"),
				}}
			/>
			<button
				onClick={() => {
					log.debug("Changing colour to blue");
					theme?.setColour("blue");
				}}
				className="w-10 h-10 rounded-full"
				style={{
					backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-blue"),
				}}
			/>
			<button
				onClick={() => {
					log.debug("Changing colour to violet");
					theme?.setColour("violet");
				}}
				className="w-10 h-10 rounded-full"
				style={{
					backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--color-violet"),
				}}
			/>
		</div>
	);
}

function ThemeSelector() {
	const log = useLog();
	const theme = useContext(ThemeContext);
	return (
		<div className="flex items-center space-x-8">
			<button
				onClick={() => {
					log.debug("Changing light mode to light");
					theme?.setLightMode("light");
				}}
				className={`${
					theme?.lightMode === "light"
						? "border-gray-900 text-gray-900 dark:border-primary-light dark:text-primary-100"
						: "text-gray-500 dark:text-primary-light"
				} flex items-center justify-center px-4 py-2 space-x-4 transition-colors border rounded-md hover:text-gray-900 hover:border-gray-900 dark:border-primary dark:hover:text-primary-100 dark:hover:border-primary-light focus:outline-none focus:ring focus:ring-primary-lighter focus:ring-offset-2 dark:focus:ring-offset-dark dark:focus:ring-primary-dark`}
			>
				<span>
					<svg
						className="w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
						/>
					</svg>
				</span>
				<span>Light</span>
			</button>
			<button
				onClick={() => {
					log.debug("Changing light mode to dark");
					theme?.setLightMode("dark");
				}}
				className={`${
					theme?.lightMode === "dark"
						? "border-gray-900 text-gray-900 dark:border-primary-light dark:text-primary-100"
						: "text-gray-500 dark:text-primary-light"
				} flex items-center justify-center px-4 py-2 space-x-4 transition-colors border rounded-md hover:text-gray-900 hover:border-gray-900 dark:border-primary dark:hover:text-primary-100 dark:hover:border-primary-light focus:outline-none focus:ring focus:ring-primary-lighter focus:ring-offset-2 dark:focus:ring-offset-dark dark:focus:ring-primary-dark`}
			>
				<span>
					<svg
						className="w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				</span>
				<span>Dark</span>
			</button>
		</div>
	);
}

export function SettingsPanel(): JSX.Element {
	const panel = useContext(SettingsPanelContext);

	if (!panel) {
		return <Error statusCode={602} />;
	}

	return (
		<LogProvider name="SettingsPanel">
			<PanelDialog right={true} open={panel.open} closeTriggered={panel.toggle} closeButton={true}>
				<div className="flex flex-col h-full">
					<div className="flex flex-col items-center justify-center flex-shrink-0 px-4 py-8 space-y-4 border-b dark:border-primary-dark">
						<span aria-hidden="true" className="text-gray-500 dark:text-primary">
							<FontAwesomeIcon icon={faSlidersH} className="w-8 h-8" />
						</span>
						<h2 id="settingsPanelLabel" className="text-xl font-medium text-gray-500 dark:text-light">
							Settings
						</h2>
					</div>
					<div className="flex-1 overflow-y-auto overscroll-y-contain">
						<div className="p-4 space-y-4 md:p-8">
							<h6 className="text-lg font-medium text-gray-400 dark:text-light">Mode</h6>
							<ThemeSelector />
						</div>

						<div className="p-4 space-y-4 md:p-8">
							<h6 className="text-lg font-medium text-gray-400 dark:text-light">Colors</h6>
							<ThemeColourSelector />
						</div>

						<div className="p-4 space-y-4 md:p-8">
							<h6 className="text-lg font-medium text-gray-400 dark:text-light">Logging</h6>
							<LogLevelSelector />
						</div>

						<div className="p-4 space-y-4 md:p-8">
							<h6 className="text-lg font-medium text-gray-400 dark:text-light">GDPR Consent</h6>
							<GdprToggle />
						</div>
					</div>
				</div>
			</PanelDialog>
		</LogProvider>
	);
}
