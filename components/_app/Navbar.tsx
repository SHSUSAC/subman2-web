import React, { useContext, useState } from "react";
import { ProfileButton } from "./ProfileButton";
import { NavList } from "./NavList";
import { Transition } from "@headlessui/react";
import ClickAwayListener from "react-click-away-listener";
import Link from "next/link";
import { SettingsPanelContext } from "../../lib/contexts/panels";
import { ThemeContext } from "../../lib/contexts/theme";

export function Navbar(): JSX.Element {
	const [mobileMainMenuOpen, setMobileMainMenuOpen] = useState(false);
	const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(false);
	const settingsPanel = useContext(SettingsPanelContext);
	const themeHelpers = useContext(ThemeContext);

	function ThemeSwitch() {
		// logger.debug("Rendering ThemeSwitch");
		return (
			<button
				aria-hidden="true"
				className="relative focus:outline-none"
				onClick={() => themeHelpers?.setLightMode(themeHelpers?.lightMode === "dark" ? "light" : "dark")}
			>
				<div className="w-12 h-6 transition rounded-full outline-none bg-primary-100 dark:bg-primary-lighter" />
				<div
					className={`absolute top-0 left-0 inline-flex items-center justify-center w-6 h-6 transition-all duration-150 transform scale-110 rounded-full shadow-sm ${
						themeHelpers?.lightMode === "dark"
							? "translate-x-0 -translate-y-px  bg-white text-primary-dark"
							: "translate-x-6 text-primary-100 bg-primary-darker"
					}`}
				>
					<svg
						className={`w-4 h-4 ${themeHelpers?.lightMode !== "dark" ? "" : "hidden"}`}
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
					<svg
						className={`w-4 h-4 ${themeHelpers?.lightMode === "dark" ? "" : "hidden"}`}
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
				</div>
			</button>
		);
	}

	// logger.debug("Rendering Navbar");
	return (
		<>
			<header className="relative flex-shrink-0 bg-white dark:bg-darker fixed top-0">
				<div className="flex items-center justify-between p-2 border-b dark:border-primary-darker">
					<>
						<button
							onClick={() => setMobileMainMenuOpen(!mobileMainMenuOpen)}
							className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark md:hidden focus:outline-none focus:ring"
						>
							<span className="sr-only">Open main menu</span>
							<span aria-hidden="true">
								<svg
									className="w-8 h-8"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</span>
						</button>
					</>
					<Link href="/dashboard">
						<a className="inline-block text-2xl font-bold tracking-wider uppercase text-primary-dark dark:text-light">
							SubMan2
						</a>
					</Link>

					<button
						onClick={() => setMobileSubMenuOpen(!mobileSubMenuOpen)}
						className="p-1 transition-colors duration-200 rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark md:hidden focus:outline-none focus:ring"
					>
						<span className="sr-only">Open sub menu</span>
						<span aria-hidden="true">
							<svg
								className="w-8 h-8"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</span>
					</button>

					<nav aria-label="Secondary" className="hidden space-x-2 md:flex md:items-center">
						<ThemeSwitch />

						<button
							onClick={() => {
								settingsPanel?.toggle();
								setMobileSubMenuOpen(false);
							}}
							className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
						>
							<span className="sr-only">Open settings panel</span>
							<svg
								className="w-7 h-7"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</button>
						<ProfileButton />
					</nav>
				</div>
			</header>

			<Transition
				as="nav"
				className={
					"absolute flex items-center p-4 bg-white rounded-md shadow-lg dark:bg-darker top-16 inset-x-4 md:hidden space-x-2"
				}
				aria-label="Secondary"
				enter="transition duration-200 ease-in-out transform sm:duration-500"
				enterFrom="-translate-y-full opacity-0"
				enterTo="translate-y-0 opacity-100"
				leave="transition duration-300 ease-in-out transform sm:duration-500"
				leaveFrom="translate-y-0 opacity-100"
				leaveTo="-translate-y-full opacity-0"
				show={mobileSubMenuOpen}
			>
				{/*<ClickAwayListener onClickAway={() => setMobileSubMenuOpen(false)}>*/}
				<>
					<ThemeSwitch />

					<button
						onClick={() => {
							settingsPanel?.toggle();
							setMobileSubMenuOpen(false);
							setMobileMainMenuOpen(false);
						}}
						className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						<span className="sr-only">Open settings panel</span>
						<svg
							className="w-7 h-7"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</button>
					<ProfileButton />
				</>
				{/*</ClickAwayListener>*/}
			</Transition>

			<>
				<Transition
					as="nav"
					className={
						"absolute flex items-center p-4 rounded-md shadow-lg dark:bg-darker top-16 inset-x-4 md:hidden border-b md:hidden dark:border-primary-darker"
					}
					aria-label="Secondary"
					enter="transition duration-200 ease-in-out transform sm:duration-500"
					enterFrom="-translate-y-full opacity-0"
					enterTo="translate-y-0 opacity-100"
					leave="transition duration-300 ease-in-out transform sm:duration-500"
					leaveFrom="translate-y-0 opacity-100"
					leaveTo="-translate-y-full opacity-0"
					show={mobileMainMenuOpen}
				>
					<ClickAwayListener onClickAway={() => setMobileMainMenuOpen(false)}>
						<NavList />
					</ClickAwayListener>
				</Transition>
			</>
		</>
	);
}
