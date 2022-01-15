import { FormProvider, UseFormReturn } from "react-hook-form";
import { PanelDialog } from "../../components/common/PanelDialog";
import React from "react";
import { ConditionRecord } from "../../lib/types/records/ConditionRecord";

export default function ConditionRecordPanel({
											panelOpen,
											setPanelOpen,
											recordForm,
											saveRecord
										}: {
	setPanelOpen: (open: boolean) => void;
	panelOpen: boolean;
	saveRecord: (record: ConditionRecord) => void;
	recordForm: UseFormReturn<ConditionRecord>
}) {
	return <PanelDialog open={panelOpen} title="Updating condition records">
		<FormProvider {...recordForm}>
			<form
					onSubmit={recordForm.handleSubmit(data => saveRecord(data as ConditionRecord))}
					className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain"
			>
				<div className="flex-grow flex flex-col space-y-2">
					//TODO Form controls
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
	</PanelDialog>;
}