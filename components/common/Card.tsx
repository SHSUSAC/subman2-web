import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export function Card({
	label,
	children,
}: // icon
{
	label: string;
	children: React.ReactNode;
	// icon: IconProp
}): JSX.Element {
	return (
		<div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
			<div>
				<h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
					{label}
				</h6>
			</div>
			{children}
			{/*<div>*/}
			{/*	/!*<span>*!/*/}
			{/*	/!*	<FontAwesomeIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" icon={icon} />*!/*/}
			{/*	/!*</span>*!/*/}
			{/*	*/}
			{/*</div>*/}
		</div>
	);
}

export function StatCard({
	value,
	change,
	changeColour,
	label,
	icon,
}: {
	value: number | string;
	change?: string | number;
	changeColour?: string;
	label: string;
	icon: IconProp;
}): JSX.Element {
	return (
		<div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
			<div>
				<h6 className="text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
					{label}
				</h6>
				<span className="text-xl font-semibold">{value.toString()}</span>
				{change && (
					<span
						className={`inline-block px-2 py-px ml-2 text-xs text-${changeColour ?? "primary"}-500 bg-${
							changeColour ?? "primary"
						}-100 rounded-md`}
					>
						{change.toString()}
					</span>
				)}
			</div>
			<div>
				<span>
					<FontAwesomeIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" icon={icon} />
				</span>
			</div>
		</div>
	);
}
