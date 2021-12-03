import React, { useContext } from "react";

import { NavList } from "./NavList";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SettingsPanelContext } from "../../lib/contexts/panels";

export function Sidebar(): JSX.Element {
	const panel = useContext(SettingsPanelContext);
	return (
		<aside className="flex-shrink-0 hidden w-64 bg-white border-r dark:border-primary-darker dark:bg-darker md:block ">
			<div className="flex flex-col top-0 fixed overflow-y-hidden hover:overflow-y-auto h-full w-64">
				<nav aria-label="Main" className="px-2 py-4 space-y-2">
					<NavList />
				</nav>

				<footer className="px-2 py-4 space-y-2">
					<button
						onClick={panel?.toggle}
						type="button"
						className="flex items-center justify-center w-full px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary-dark focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
					>
						<span aria-hidden="true">
							<FontAwesomeIcon icon={faSlidersH} color={"white"} className="w-5 h-5 mr-2" />
						</span>
						<span>Customize</span>
					</button>
				</footer>
			</div>
		</aside>
	);
}
