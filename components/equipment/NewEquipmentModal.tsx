import React from "react";
import { PanelDialog } from "../common/PanelDialog";
import { BCD, cylinder, Fins, Regulator, Weight } from "../../lib/types/equipment";
import { SubmitErrorHandler, SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { CommonEquipmentProperties } from "../../lib/types/equipmentComponents";
import {
	CylinderFormControls,
	GeneralEquipmentFormControls,
	NextTestFormControl,
	SizedFormControl,
	WeightFormControls,
} from "./equipmentFormControls";
import { useLog } from "../common/LogProvider";

type formTypes = CommonEquipmentProperties | cylinder | BCD | Regulator | Weight | Fins;

export function NewEquipmentModal({
	open,
	save,
	cancel,
	title,
	type,
}: {
	type: "cylinder" | "weight" | "sized" | "reg" | "normal";
	title: string;
	open: boolean;
	save: (c: CommonEquipmentProperties | cylinder | BCD | Regulator | Weight | Fins) => void;
	cancel: () => void;
}): JSX.Element {
	const form = useForm<formTypes>();
	const {
		handleSubmit,
		formState: { errors },
	} = form;
	const log = useLog();

	const onSubmit: SubmitHandler<formTypes> = (data) => {
		log.info("Form validation successful! Sending data to parent");
		save(data as formTypes);
		form.reset();
	};
	const onError: SubmitErrorHandler<formTypes> = (errors, e) => {
		log.info("Form validation failed!");
		console.log(e);
		if (e) {
			log.error(e, "Error during form validation. Errors %j", {
				tag: errors.userTag?.types,
			});
		}
	};

	return (
		<PanelDialog open={open} title={title}>
			<FormProvider {...form}>
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className="w-full flex flex-col px-4 py-6 space-y-6 bg-white rounded-md dark:bg-darker flex-grow overflow-y-auto overscroll-y-contain"
				>
					<div className="flex-grow flex flex-col space-y-2">
						<GeneralEquipmentFormControls />
						{type === "cylinder" && <CylinderFormControls />}
						{(type === "cylinder" || type === "reg") && <NextTestFormControl />}
						{type === "sized" && <SizedFormControl />}
						{type === "weight" && <WeightFormControls />}
					</div>

					<div className="block md:flex mb-4 gap-8">
						<button
							type="button"
							className="w-full mb-2 md:mb-0 space-y-3 px-4 py-2 font-medium border border-primary-darker text-primary-darker text-center hover:text-white dark:text-white transition-colors duration-200 rounded-md hover:bg-primary-dark dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
							onClick={cancel}
						>
							Close without saving
						</button>
						<button className="w-full space-y-3 px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker">
							Save and close
						</button>
					</div>
				</form>
			</FormProvider>
		</PanelDialog>
	);
}
