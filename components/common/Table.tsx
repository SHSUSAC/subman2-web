import { Column, useTable } from "react-table";
import React from "react";

export function Table<T extends object>({
	columns,
	data,
	skeleton,
}: {
	columns: Column<T>[];
	data: T[];
	skeleton?: boolean;
}): JSX.Element {
	const tableBorders = "border dark:border-primary-darker";
	let tableAlternator = false;

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>({ columns, data });

	return (
		<table {...getTableProps()} className={`${tableBorders} m-2 w-full bg-white dark:bg-darker`}>
			<thead>
				{headerGroups.map((group) => (
					// Provided by {...group.getHeaderGroupProps()}
					// eslint-disable-next-line react/jsx-key
					<tr {...group.getHeaderGroupProps()}>
						{group.headers.map((column) => (
							// Provided by {...column.getHeaderProps()}
							// eslint-disable-next-line react/jsx-key
							<th {...column.getHeaderProps()} className={`${tableBorders}`}>
								{column.render("Header")}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((group) => {
					prepareRow(group);
					tableAlternator = !tableAlternator;
					return (
						// Provided by {...group.getRowProps()}
						// eslint-disable-next-line react/jsx-key
						<tr
							className={`${tableBorders} ${tableAlternator ? "bg-primary-50 dark:bg-dark" : ""}`}
							{...group.getRowProps()}
						>
							{group.cells.map((column) => (
								// Provided by {...column.getCellProps()}
								// eslint-disable-next-line react/jsx-key
								<td className={`${tableBorders}`} {...column.getCellProps()}>
									{/*{(skeleton && !data) ? <div className="w-24 bg-gray-300 h-6 rounded-md "/> : column.render("Cell") }*/}
									{column.render("Cell")}
								</td>
							))}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
