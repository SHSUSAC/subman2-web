import { FormProvider, UseFormReturn } from "react-hook-form";
import { PressureRecord } from "../../lib/types/records/PressureRecord";
import { PressureRecordFormControls } from "../../components/equipment/equipmentFormControls";
import { PanelDialog } from "../../components/common/PanelDialog";
import React from "react";
import { toast } from "react-toastify";

export default function PressureRecordPanel({
	panelOpen,
	setPanelOpen,
	pressureRecordForm,
	savePressureRecord,
	data,
}: {
	data?: { record: PressureRecord; parentId: string };
	setPanelOpen: (open: boolean) => void;
	panelOpen: boolean;
	savePressureRecord: (record: { record: PressureRecord; parentId: string }) => Promise<void>;
	pressureRecordForm: UseFormReturn<{ record: PressureRecord; parentId: string }, object>;
}) {
	const {
		formState: { isSubmitting },
	} = pressureRecordForm;
	return (
		<PanelDialog open={panelOpen} title="Changing pressure records">
			<FormProvider {...pressureRecordForm}>
				<form
					onSubmit={pressureRecordForm.handleSubmit(async (data) => {
						await toast.promise(savePressureRecord(data as { record: PressureRecord; parentId: string }), {
							pending: "Saving record...",
							success: "Saved successfully",
							error: "Error saving",
						});
					})}
					className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain"
				>
					<div className="flex-grow flex flex-col space-y-2">
						<PressureRecordFormControls data={data} />
					</div>

					<div className="block md:flex mb-4 gap-8">
						<button
							type="button"
							className="w-full mb-2 md:mb-0 space-y-3 px-4 py-2 font-medium border border-primary-darker text-primary-darker text-center hover:text-white dark:text-white transition-colors duration-200 rounded-md hover:bg-primary-dark dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
							onClick={() => {
								pressureRecordForm.reset();
								setPanelOpen(false);
							}}
							disabled={isSubmitting}
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
