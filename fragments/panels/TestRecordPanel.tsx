import { FormProvider, UseFormReturn } from "react-hook-form";
import { PanelDialog } from "../../components/common/PanelDialog";
import { NextTestFormControl } from "../../components/equipment/equipmentFormControls";
import React from "react";
import { TestRecord } from "../../lib/types/records/TestRecord";
import { toFormDateString } from "../../lib/dateTimeHelpers";
import { ErrorMessage } from "@hookform/error-message";
import { useLog } from "../../components/common/LogProvider";

export default function TestRecordPanel({
	data,
	panelOpen,
	setPanelOpen,
	recordForm,
	saveRecord,
}: {
	data?: TestRecord;
	setPanelOpen: (open: boolean) => void;
	panelOpen: boolean;
	saveRecord: (record: TestRecord) => void;
	recordForm: UseFormReturn<TestRecord>;
}) {
	const log = useLog();
	const {
		register,
		formState: { errors },
	} = recordForm;

	return (
		<PanelDialog open={panelOpen} title="Updating test records">
			<FormProvider {...recordForm}>
				<form
					onSubmit={recordForm.handleSubmit((data) => saveRecord(data as TestRecord))}
					className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain"
				>
					<div className="flex-grow flex flex-col space-y-2">
						<label className="">
							Performed
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="date"
								required
								defaultValue={toFormDateString(log, data?.performedAt)}
								inputMode="numeric"
								{...register("performedAt")}
							/>
						</label>
						<ErrorMessage errors={errors} name="performedAt" />
						<label className="">
							Tester
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="text"
								placeholder="Notes"
								inputMode="text"
								defaultValue={data?.tester ?? ""}
								{...register("tester")}
							/>
						</label>
						<ErrorMessage errors={errors} name="tester" />
						<label className="">
							Test Location
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="text"
								placeholder="Location"
								inputMode="text"
								defaultValue={data?.testLocation ?? ""}
								{...register("testLocation")}
							/>
						</label>
						<ErrorMessage errors={errors} name="testLocation" />
						<NextTestFormControl />
						<label className="inline-flex items-center">
							<input
								className="w-8 h-8 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="checkbox"
								defaultValue={String(data?.pass ?? false)}
								{...register("pass")}
							/>
							<span className="ml-2">Check this if the test passed</span>
						</label>
						<ErrorMessage errors={errors} name="pass" />
					</div>

					<div className="block md:flex mb-4 gap-8">
						<button
							type="button"
							className="w-full mb-2 md:mb-0 space-y-3 px-4 py-2 font-medium border border-primary-darker text-primary-darker text-center hover:text-white dark:text-white transition-colors duration-200 rounded-md hover:bg-primary-dark dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
							onClick={() => {
								recordForm.reset();
								setPanelOpen(false);
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="w-full space-y-3 px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
						>
							Save changes
						</button>
					</div>
				</form>
			</FormProvider>
		</PanelDialog>
	);
}
