///** @jsxImportSource @emotion/react **/
import { Controller, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { CommonEquipmentProperties, EquipmentConditions } from "../../lib/types/equipmentComponents";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
//import tw from "twin.macro";
import { _sizeProperties, _weightProperties, cylinder, Regulator } from "../../lib/types/equipment";
import { PressureRecord } from "../../lib/types/records/PressureRecord";
import { Temporal } from "@js-temporal/polyfill";
import { toFormDateString, toTemporal } from "../../lib/dateTimeHelpers";
import { useLog } from "../common/LogProvider";
import { TestRecord } from "../../lib/types/records/TestRecord";

export function PressureRecordFormControls({ data }: { data?: { record: PressureRecord; parentId: string } }) {
	const {
		register,
		formState: { errors },
		control,
	} = useFormContext<{ record: PressureRecord; parentId: string }>();

	const log = useLog("PressureRecordForm");

	const timestampDefault = toTemporal(data?.record?.timestamp ?? Temporal.Now.zonedDateTimeISO(), log);
	const timestampDefaultValue = `${timestampDefault.year}-${timestampDefault.month}-${timestampDefault.day}`;

	return (
		<>
			<input type="hidden" value={data?.parentId} {...register("parentId")} />
			<label className="">
				New Pressure
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="number"
					placeholder="New Pressure"
					inputMode="numeric"
					required
					defaultValue={data?.record?.newPressure}
					{...register("record.newPressure", {
						valueAsNumber: true,
						required: true,
					})}
				/>
			</label>
			<ErrorMessage errors={errors} name="record.newPressure" />
			<label className="">
				Gas Mix
				<Controller
					control={control}
					defaultValue={data?.record?.gasType ?? "Air"}
					name="record.gasType"
					render={({ field }) => (
						<CreatableSelect
							aria-invalid={!!errors?.record?.gasType?.message}
							// styles={{
							// 	option: (provided) => ({
							// 		...provided,
							// 		...tw`dark:bg-dark dark:hover:bg-gray-400`,
							// 	}),
							// 	control: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	container: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	singleValue: (provided) => ({
							// 		...provided,
							// 		...tw`text-current`,
							// 	}),
							// }}
							options={[
								{ label: "Air", value: "Air" },
								{ label: "Nitrox", value: "Nitrox" },
							]}
							defaultValue={{
								label: data?.record.gasType ?? "Air",
								value: data?.record.gasType ?? "Air",
							}}
							onChange={(val) => field.onChange(val?.value)}
						/>
					)}
				/>
			</label>
			<ErrorMessage errors={errors} name="record.gasType" />
			<label className="">
				Date
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="date"
					inputMode="numeric"
					defaultValue={timestampDefaultValue}
					required
					{...register("record.timestamp", {
						// setValueAs: (v) => {
						// 	log.debug("nextDue form value (before parsing) %s", v);
						// 	if(!v) return null;
						// 	const pd = Temporal.PlainDate.from(v);
						// 	const zdt = pd.toZonedDateTime(Temporal.Now.timeZone());
						// 	log.debug("Parsed nextDue to %s (%j)", zdt, zdt);
						// 	return zdt;
						// }
					})}
				/>
			</label>
			<ErrorMessage errors={errors} name="record.timestamp" />
			<label className="">
				Location
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="text"
					placeholder="Location"
					inputMode="text"
					defaultValue={data?.record?.location}
					{...register("record.location", {
						required: false,
					})}
				/>
			</label>
			<ErrorMessage errors={errors} name="record.location" />
			<label className="">
				Signer
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="text"
					placeholder="Signed off by"
					inputMode="text"
					required
					defaultValue={data?.record?.overseenBy}
					{...register("record.overseenBy", {
						required: true,
					})}
				/>
			</label>
			<ErrorMessage errors={errors} name="record.overseenBy" />
			<label className="">
				Comment
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="text"
					placeholder="Comment"
					inputMode="text"
					defaultValue={data?.record.comment ?? ""}
					{...register("record.comment")}
				/>
			</label>
			<ErrorMessage errors={errors} name="record.comment" />
		</>
	);
}

export function GeneralEquipmentFormControls({ data }: { data?: CommonEquipmentProperties }) {
	const {
		register,
		formState: { errors },
		control,
	} = useFormContext();

	const options = EquipmentConditions.map((x) => {
		return { value: x, label: x };
	});

	return (
		<>
			<label className="">
				Starting Condition
				<Controller
					control={control}
					name="condition"
					rules={{
						required: true,
					}}
					defaultValue={data?.condition ?? "OK"}
					render={({ field }) => (
						<Select
							aria-invalid={!!errors?.condition?.message}
							// styles={{
							// 	option: (provided) => ({
							// 		...provided,
							// 		...tw`dark:bg-dark dark:hover:bg-gray-400`,
							// 	}),
							// 	control: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	container: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	singleValue: (provided) => ({
							// 		...provided,
							// 		...tw`text-current`,
							// 	}),
							// }}
							options={options}
							defaultValue={options[0]}
							onChange={(val) => field.onChange(val?.value)}
						/>
					)}
				/>
			</label>
			<ErrorMessage errors={errors} name="condition" />
			<label className="">
				Notes
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="text"
					placeholder="Notes"
					inputMode="text"
					defaultValue={data?.notes ?? ""}
					{...register("notes")}
				/>
			</label>
			<ErrorMessage errors={errors} name="notes" />
			<label className="">
				Tag
				<input
					required
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="text"
					placeholder="Reference Tag"
					inputMode="text"
					defaultValue={data?.userTag ?? ""}
					{...register("userTag", { required: "A tag for quick reference is required" })}
				/>
			</label>
			<ErrorMessage errors={errors} name="userTag" />
		</>
	);
}

export function WeightFormControls({ data }: { data?: _weightProperties }) {
	const {
		register,
		formState: { errors },
		control,
	} = useFormContext();

	return (
		<>
			<label className="">
				Mass
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="number"
					defaultValue={data?.mass}
					placeholder="Mass in KG"
					inputMode="decimal"
					{...register("mass")}
				/>
			</label>
			<label>
				Type
				<Controller
					control={control}
					defaultValue={data?.type}
					name="type"
					render={({ field }) => (
						<CreatableSelect
							aria-invalid={!!errors?.type?.message}
							// styles={{
							// 	option: (provided) => ({
							// 		...provided,
							// 		...tw`dark:bg-dark dark:hover:bg-gray-400`,
							// 	}),
							// 	control: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	container: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	singleValue: (provided) => ({
							// 		...provided,
							// 		...tw`text-current`,
							// 	}),
							// }}
							options={[
								{ label: "Block", value: "Block" },
								{ label: "Shot", value: "Shot" },
								{ label: "Belt", value: "Belt" },
							]}
							defaultValue={{ label: data?.type, value: data?.type }}
							onChange={(val) => field.onChange(val?.value)}
						/>
					)}
				/>
			</label>
			<ErrorMessage errors={errors} name="mass" />
		</>
	);
}

export function SizedFormControl({ data }: { data?: _sizeProperties }) {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	return (
		<>
			<label className="">
				Size
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="text"
					defaultValue={data?.size}
					placeholder="Size"
					inputMode="text"
					{...register("size")}
				/>
			</label>
			<ErrorMessage errors={errors} name="size" />
		</>
	);
}

export function NextTestFormControl({ data }: { data?: cylinder | Regulator | TestRecord }) {
	const log = useLog();
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<>
			<label className="">
				Next Test
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="date"
					required
					defaultValue={toFormDateString(log, data?.nextDue)}
					inputMode="numeric"
					{...register("nextDue", {
						// setValueAs: (v) => {
						// 	log.debug("nextDue form value (before parsing) %s", v);
						// 	if(!v) return null;
						// 	const pd = Temporal.PlainDate.from(v);
						// 	const zdt = pd.toZonedDateTime(Temporal.Now.timeZone());
						// 	log.debug("Parsed nextDue to %s (%j)", zdt, zdt);
						// 	return zdt;
						// }
					})}
				/>
			</label>
			<ErrorMessage errors={errors} name="nextDue" />
		</>
	);
}

export function CylinderFormControls({ data }: { data?: cylinder }) {
	const {
		register,
		formState: { errors },
		control,
	} = useFormContext();

	return (
		<>
			<label className="">
				Clamp Type
				<select
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					required
					defaultValue={data?.clampType}
					{...register("clampType", {
						required: "The type of clamp must be set.",
					})}
				>
					<option value="A">A-Clamp</option>
					<option value="DIN">DIN</option>
					<option value="Other">Other</option>
				</select>
			</label>
			<ErrorMessage errors={errors} name="clampType" />

			<label className="">
				Working Pressure
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="number"
					inputMode="numeric"
					required
					defaultValue={data?.workingPressure ?? 200}
					{...register("workingPressure", {
						valueAsNumber: true,
						required: "The working pressure is required.",
					})}
				/>
			</label>
			<ErrorMessage errors={errors} name="workingPressure" />

			<label className="">
				Current Pressure
				<input
					className="w-full mb-2 px-4 py-2 border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker"
					type="number"
					inputMode="numeric"
					required
					defaultValue={data?.pressure ?? 0}
					{...register("pressure", { valueAsNumber: true })}
				/>
			</label>
			<ErrorMessage errors={errors} name="pressure" />

			<label className="">
				Current Gas Mix
				<Controller
					control={control}
					defaultValue={data?.gasType ?? "Air"}
					name="gasType"
					render={({ field }) => (
						<CreatableSelect
							aria-invalid={!!errors?.gasType?.message}
							// styles={{
							// 	option: (provided) => ({
							// 		...provided,
							// 		...tw`dark:bg-dark dark:hover:bg-gray-400`,
							// 	}),
							// 	control: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	container: (provided) => ({
							// 		...provided,
							// 		...tw`border rounded-md dark:bg-darker dark:border-gray-700 focus:outline-none focus:ring focus:ring-primary-100 dark:focus:ring-primary-darker`,
							// 	}),
							// 	singleValue: (provided) => ({
							// 		...provided,
							// 		...tw`text-current`,
							// 	}),
							// }}
							options={[
								{ label: "Air", value: "Air" },
								{ label: "Nitrox", value: "Nitrox" },
							]}
							defaultValue={{ label: data?.gasType ?? "Air", value: data?.gasType ?? "Air" }}
							onChange={(val) => field.onChange(val?.value)}
						/>
					)}
				/>
			</label>
			<ErrorMessage errors={errors} name="gasType" />
		</>
	);
}
