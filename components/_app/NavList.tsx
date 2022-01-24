// noinspection HtmlUnknownTarget

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePermission } from "../../lib/hooks/useAuthErrorPages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

function SignInComponent({ show }: { show: boolean }) {
	return (
		<p className={(show ? "visible" : "hidden") + " bg-primary-50 dark:bg-dark block p-2 text-sm rounded-md"}>
			You need to sign in to use this module
		</p>
	);
}

function NoPermissionComponent({ show }: { show: boolean }) {
	return (
		<p className={(show ? "visible" : "hidden") + " bg-primary-50 dark:bg-dark block p-2 text-sm rounded-md"}>
			You don&apos;t have permission to use this module
		</p>
	);
}

function Section({
	children,
	sectionName,
	signedIn,
	hasPermission,
}: {
	children: Iterable<ReactNode>;
	sectionName: string;
	hasPermission?: boolean;
	signedIn?: boolean;
}) {
	const SelectDisplayedElement = () => {
		if (!signedIn) {
			return <SignInComponent show={true} />;
		}
		if (!hasPermission) {
			return <NoPermissionComponent show={true} />;
		}
		return <div className={`flex flex-col space-y-4 bg-primary-50 dark:bg-dark`}>{children}</div>;
	};

	return (
		<section>
			<p className="block p-2 text-sm rounded-md text-primary-lighter">{sectionName}</p>

			<div role="menu" className="mt-2 space-y-2 px-7" aria-label="Equipment Links">
				{SelectDisplayedElement()}
			</div>
		</section>
	);
}

export function NavList(): JSX.Element {
	const chatPerms = usePermission("ChatRole", "Reader");
	const calPerms = usePermission("CalenderRole", "Reader");
	const storePerms = usePermission("StorageRole", "Reader");
	const equipPerms = usePermission("EquipmentRole", "Reader");
	const sysPerms = usePermission("SystemRole", "Reader");

	return (
		<div className="space-y-2">
			<header>
				<h1 className="text-2xl">Navigation</h1>
			</header>
			<Link href="/">
				<a className="ml-2 flex text-sm block rounded-md text-primary-lighter bg-primary-50 hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark dark:bg-dark focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker">
					<FontAwesomeIcon className="w-6 h-6" icon={faHome} />
					<span className="self-center ml-4">Home</span>
				</a>
			</Link>

			<Section
				sectionName="Chat"
				signedIn={chatPerms?.data?.signedIn}
				hasPermission={chatPerms?.data?.hasRequiredClaims}
			>
				<p role="menuitem" className="ml-2 text-sm block rounded-md text-primary-lighter">
					This module is disabled
				</p>
				<></>
			</Section>

			<Section
				sectionName="Calender"
				signedIn={calPerms?.data?.signedIn}
				hasPermission={calPerms?.data?.hasRequiredClaims}
			>
				<p role="menuitem" className="ml-2 text-sm block rounded-md text-primary-lighter">
					This module is disabled
				</p>
				<></>
			</Section>

			<Section
				sectionName="Storage"
				signedIn={storePerms?.data?.signedIn}
				hasPermission={storePerms?.data?.hasRequiredClaims}
			>
				<p role="menuitem" className="ml-2 text-sm block rounded-md text-primary-lighter">
					This module is disabled
				</p>
				<></>
			</Section>

			<Section
				sectionName="Equipment"
				signedIn={equipPerms?.data?.signedIn}
				hasPermission={equipPerms?.data?.hasRequiredClaims}
			>
				<Link href="/equipment/dashboard">
					<a className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker">
						Dashboard
					</a>
				</Link>
				<Link href="/equipment/cylinder">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						Cylinders
					</a>
				</Link>
				<Link href="/equipment/mask">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						Masks
					</a>
				</Link>
				<Link href="/equipment/snorkel">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						Snorkels
					</a>
				</Link>
				<Link href="/equipment/bcd">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						BCDs
					</a>
				</Link>
				<Link href="/equipment/fin">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						Fins
					</a>
				</Link>
				<Link href="/equipment/regulator">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						Regulators
					</a>
				</Link>
				<Link href="/equipment/weight">
					<a
						role="menuitem"
						className="ml-2 text-sm block rounded-md text-primary-lighter  hover:text-primary hover:bg-primary-100 dark:hover:text-light dark:hover:bg-primary-dark  focus:bg-primary-100 dark:focus:bg-primary-dark focus:ring-primary-darker"
					>
						Weights
					</a>
				</Link>
			</Section>

			<Section
				sectionName="System"
				signedIn={sysPerms?.data?.signedIn}
				hasPermission={sysPerms?.data?.hasRequiredClaims}
			>
				<p role="menuitem" className="ml-2 text-sm block rounded-md text-primary-lighter">
					This module is disabled
				</p>
				<></>
			</Section>
		</div>
	);
}
