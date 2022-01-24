import { FormProvider, UseFormReturn } from "react-hook-form";
import { PanelDialog } from "../../components/common/PanelDialog";
import React from "react";
import { ConditionRecord } from "../../lib/types/records/ConditionRecord";
import { toFormDateString } from "../../lib/dateTimeHelpers";
import { ErrorMessage } from "@hookform/error-message";
import { useLog } from "../../components/common/LogProvider";

export default function ConditionRecordPanel({
	data,
	panelOpen,
	setPanelOpen,
	recordForm,
	saveRecord,
}: {
	data?: ConditionRecord;
	setPanelOpen: (open: boolean) => void;
	panelOpen: boolean;
	saveRecord: (record: ConditionRecord) => Promise<void>;
	recordForm: UseFormReturn<ConditionRecord>;
}) {
	const log = useLog();
	const {
		register,
		formState: { errors, isSubmitting },
	} = recordForm;

	return (
		<PanelDialog open={panelOpen} title="Updating condition records">
			<FormProvider {...recordForm}>
				<form
					onSubmit={recordForm.handleSubmit(async (data) => await saveRecord(data as ConditionRecord))}
					className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain"
				>
					<div className="flex-grow flex flex-col space-y-2">
						{
							//Reporting Section
						}
						<label className="">
							Reported
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="date"
								required
								defaultValue={toFormDateString(log, data?.reportedAt)}
								inputMode="numeric"
								{...register("reportedAt", {
									required: "The date a fault was reported must be logged",
								})}
							/>
						</label>
						<ErrorMessage errors={errors} name="reportedAt" />
						<label className="">
							Reported By
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="text"
								placeholder="Reporter"
								required
								inputMode="text"
								defaultValue={data?.reportedBy ?? ""}
								{...register("reportedBy", {
									required: "The name of the person who first found the fault is required",
								})}
							/>
						</label>
						<ErrorMessage errors={errors} name="reportedBy" />
						<label className="">
							Fault Description
							<textarea
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								inputMode="text"
								required
								defaultValue={data?.faultDescription ?? ""}
								{...register("faultDescription", {
									required: "A description of the fault is required",
								})}
							/>
						</label>
						<ErrorMessage errors={errors} name="faultDescription" />
						{
							//Repair Section
						}
						<label className="">
							Repaired
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="date"
								defaultValue={toFormDateString(log, data?.repairedAt)}
								inputMode="numeric"
								{...register("repairedAt")}
							/>
						</label>
						<ErrorMessage errors={errors} name="repairedAt" />
						<label className="">
							Repaired By
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="text"
								inputMode="text"
								defaultValue={data?.repairedBy ?? ""}
								{...register("repairedBy")}
							/>
						</label>
						<ErrorMessage errors={errors} name="repairedBy" />
						<label className="">
							Repair Description
							<textarea
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								inputMode="text"
								defaultValue={data?.repairDescription ?? ""}
								{...register("repairDescription")}
							/>
						</label>
						<ErrorMessage errors={errors} name="repairDescription" />
						{
							//Approval Section
						}
						<label className="">
							Approved
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="date"
								defaultValue={toFormDateString(log, data?.approvedAt)}
								inputMode="numeric"
								{...register("approvedAt")}
							/>
						</label>
						<ErrorMessage errors={errors} name="approvedAt" />
						<label className="">
							Approved By
							<input
								className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
								type="text"
								inputMode="text"
								defaultValue={data?.approvedBy ?? ""}
								{...register("approvedBy")}
							/>
						</label>
						<ErrorMessage errors={errors} name="approvedBy" />
					</div>

					<div className="block md:flex mb-4 gap-8">
						<button
							disabled={isSubmitting}
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
							disabled={isSubmitting}
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
