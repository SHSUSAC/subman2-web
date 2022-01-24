import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { Transition } from "@headlessui/react";
import { useAnalytics, useAuth, useUser } from "reactfire";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useLog } from "../common/LogProvider";
import { logEvent, setUserId } from "firebase/analytics";
import { useStore } from "react-context-hook";
import { toast } from "react-toastify";

type GisResponse = {
	credential: string;
	select_by: string;
};

export function ProfileButton(): JSX.Element | null {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { status, data: user } = useUser();

	const anal = useAnalytics();

	const auth = useAuth();

	const gisLog = useLog("GoogleIdentityService");
	const [allowPrompt, setAllowPrompt] = useState(true);
	const [gisLoaded] = useStore("gisLoaded");
	const [gisReady, setGisReady] = useStore("gisReady");

	//Loads the script into the page
	useEffect(() => {
		if (gisReady) {
			return;
		}

		if (!gisLoaded) {
			return;
		}

		//@ts-ignore
		google.accounts.id.initialize({
			client_id: "738603738437-hhc2dhkm98nb6hr7kf7cfo19eunp0438.apps.googleusercontent.com",
			callback: function (response: GisResponse) {
				gisLog?.debug("Response handler triggered");
				const credential = GoogleAuthProvider.credential(response.credential);
				const signInResult = signInWithCredential(auth, credential);
				signInResult.then((uc) => {
					gisLog.trace("Authenticated with firebase via sign in credential. Got result %j", uc.user.toJSON());
					setUserId(anal, uc.user.uid);
					logEvent(anal, "login", {
						method: response.select_by,
					});
				});
			},
		});

		setGisReady(true);
	}, [anal, auth, gisLoaded, gisLog, gisReady, setGisReady]);

	//Prompts the user if they are not signed in and it is allowed
	useEffect(() => {
		gisLog.trace("Starting prompt effect");
		if (status !== "loading") {
			gisLog.trace("Firebase user finished loading");
			if (!user) {
				gisLog.trace("Firebase user null");
				if (gisReady) {
					gisLog.trace("GIS Ready");
					const container = document?.getElementById("authButtonsContainer");
					if ((container?.children?.length || 0) > 1) {
						gisLog.info("Un-hiding sign in button");
						const signInClassNames = container?.children[0]?.classList;
						signInClassNames?.remove("hidden");
					} else {
						gisLog.info("Rendering sign in button");
						// @ts-ignore
						google.accounts.id.renderButton(document.getElementById("signInGButt"), {
							theme: "filled_blue",
							size: "large",
							shape: "pill",
							type: "standard",
						});
					}
					if (allowPrompt) {
						gisLog.trace("Prompt allowed");
						gisLog.info("Prompting user to sign in via one tap");
						// @ts-ignore
						google.accounts.id.prompt((notification) => {
							if (notification.isNotDisplayed()) {
								gisLog.info(
									"One Tap prompt not displayed. Code %s",
									notification.getNotDisplayedReason()
								);
							} else if (notification.isSkippedMoment()) {
								gisLog.info("One Tap prompt skipped. Code %s", notification.getSkippedReason());
							} else if (notification.isDismissedMoment()) {
								gisLog.info("One Tap prompt dismissed. Code %s", notification.getDismissedReason());
							}
						});
					}
				}
			} else {
				setUserId(anal, user.uid);
				logEvent(anal, "login", {
					method: "auto",
				});
				//clean up old button
				const container = document?.getElementById("authButtonsContainer");
				if (container) {
					if (container?.children?.length > 1) {
						gisLog.info("Manually hiding sign in button");
						const signInClassNames = container.children[0].classList;
						signInClassNames.add("hidden");
						// //This breaks during teardown
						// const authChild = document.getElementById("appProfileButton");
						// if(authChild) {
						// 	container.replaceChildren(authChild);
						// }
						// else {
						// 	container.replaceChildren();
						// }
					}
				}
			}
		}
	}, [allowPrompt, status, user, gisReady, gisLog, anal]);

	if (status === "loading") {
		return (
			<div className="p-2 transition-colors duration-200 rounded-full text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:outline-none focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker">
				<span className="sr-only">Loading user information</span>
				<svg
					className="w-7 h-7 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<circle className="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path
						className="opacity-100"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			</div>
		);
	}

	if (!user) {
		return <div id="signInGButt" />;
	}

	return (
		<div className="flex" id="authButtonsContainer">
			<button
				id="appProfileButton"
				onClick={() => setDropdownOpen(!dropdownOpen)}
				type="button"
				aria-haspopup="true"
				aria-expanded={dropdownOpen}
				className="transition-opacity duration-200 rounded-full dark:opacity-75 dark:hover:opacity-100 focus:outline-none focus:ring dark:focus:opacity-100"
			>
				<span className="sr-only">User menu</span>
				<img className="w-10 h-10 rounded-full" src={user?.photoURL || ""} alt={user?.displayName ?? ""} />
			</button>

			<Transition
				show={dropdownOpen}
				className={
					"absolute grid right-0 w-48 py-1 bg-white rounded-md shadow-lg top-12 ring-1 ring-black ring-opacity-5 dark:bg-dark focus:outline-none"
				}
				tabIndex={-1}
				role="menu"
				aria-orientation="vertical"
				aria-label="User menu"
			>
				<ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
					<>
						<button
							onClick={async () => {
								try {
									await auth.signOut();
									setUserId(anal, "");
									// @ts-ignore
									google.accounts.id.disableAutoSelect();
									setAllowPrompt(false);
									toast.success("Signed out successfully");
								} catch (e) {
									gisLog.error(e as Error, "Error during sign-out");
									toast.error("Sign out error. Your session may not have shutdown correctly!");
								}
							}}
							role="menuitem"
							className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-light dark:hover:bg-primary"
						>
							Logout
						</button>
					</>
				</ClickAwayListener>
			</Transition>
		</div>
	);
}
