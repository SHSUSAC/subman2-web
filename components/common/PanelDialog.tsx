import { PanelPortalSelector } from "../../pages/_app";
import { ClientOnlyPortal } from "./ClientOnlyPortal";
import { Transition } from "@headlessui/react";
import { ReactNode } from "react";

export function PanelDialog({
	children,
	open,
	title,
	right,
	closeButton,
	closeTriggered,
}: {
	closeButton?: boolean;
	children: ReactNode;
	open: boolean;
	title?: string;
	right?: boolean;
	closeTriggered?: () => void;
}) {
	const Content = () => (
		<div className="flex flex-col h-full">
			{title && (
				<div className="flex-shrink-0">
					<div className="flex items-center justify-between px-4 pt-4 border-b dark:border-primary-darker">
						<h2 className="pb-4 font-semibold">{title}</h2>
					</div>
				</div>
			)}
			{children}
		</div>
	);

	const CloseButton = () => (
		<div className="absolute left-0 p-2 transform -translate-x-full">
			<button
				className="p-2 text-white rounded-md focus:outline-none focus:ring"
				onClick={() => {
					if (closeTriggered) closeTriggered();
				}}
			>
				<svg
					className="w-5 h-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	);

	return (
		<ClientOnlyPortal selector={PanelPortalSelector}>
			<Transition
				enter="transition duration-300 ease-in-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition duration-300 ease-in-out"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				show={open}
				className="fixed inset-0 z-20 bg-primary-darker"
				style={{ opacity: 0.5 }}
				aria-hidden="true"
			></Transition>

			{right ? (
				<Transition
					enter="transition duration-300 ease-in-out transform sm:duration-500"
					enterFrom="translate-x-full"
					enterTo="translate-x-0"
					leave="transition duration-300 ease-in-out transform sm:duration-500"
					leaveFrom="translate-x-0"
					leaveTo="translate-x-full"
					show={open}
					as="section"
					tabIndex={-1}
					className="fixed inset-y-0 right-0 z-20 w-full max-w-xs bg-white shadow-xl dark:bg-darker dark:text-light sm:max-w-md focus:outline-none"
					aria-labelledby="settingsPanelLabel"
				>
					{closeButton && <CloseButton />}
					<Content />
				</Transition>
			) : (
				<Transition
					enter="transition duration-300 ease-in-out transform sm:duration-500"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition duration-300 ease-in-out transform sm:duration-500"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
					show={open}
					as="section"
					tabIndex={-1}
					className="fixed inset-y-0 z-30 w-full max-w-s bg-white dark:bg-darker dark:text-light sm:max-w-lg focus:outline-none"
					aria-labelledby="newEquipmentPanelLabel"
				>
					{closeButton && <CloseButton />}
					<Content />
				</Transition>
			)}
		</ClientOnlyPortal>
	);
}
