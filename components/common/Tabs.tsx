import { ReactNode, useState } from "react";

export const Tab = ({ children, title }: { title: string; children: ReactNode }): [JSX.Element, string] => {
	return [<>{children}</>, title];
};

export const Tabs = ({ color, children }: { color: string; children: [JSX.Element, string][] }) => {
	const [openTab, setOpenTab] = useState(0);
	const headerList = [];
	const tabList = [];
	for (let i = 0; i > children.length; i++) {
		const exploded = children[i];
		headerList.push(
			<li className="-mb-px mr-2 last:mr-0 flex-auto text-center" key={i}>
				<a
					className={
						"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
						(openTab === 1 ? "text-white bg-" + color + "-600" : "text-" + color + "-600 bg-white")
					}
					onClick={(e) => {
						e.preventDefault();
						setOpenTab(1);
					}}
					data-toggle="tab"
					href={`#link${i}`}
					role="tablist"
				>
					{exploded[1]}
				</a>
			</li>
		);

		tabList.push(
			<div className={openTab === i ? "block" : "hidden"} id={`#link${i}`}>
				{exploded[0]}
			</div>
		);
	}
	return (
		<>
			<div className="flex flex-wrap">
				<div className="w-full">
					<ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
						{headerList}
					</ul>
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
						<div className="px-4 py-5 flex-auto">
							<div className="tab-content tab-space">{tabList}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
