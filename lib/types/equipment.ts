import { CommonEquipmentProperties, datePhases } from "./equipmentComponents";

type testProperties = {
	nextDue: datePhases;
};

export type pressureProperties = {
	pressure: number;
};

export type _sizeProperties = {
	size: string;
};

export type _weightProperties = {
	mass: number;
	type: string; //"block" | "shot" | "belt";
};

type clampTypes = "A" | "DIN" | "Other";

export type Regulator = CommonEquipmentProperties & testProperties;

export type cylinder = CommonEquipmentProperties &
	testProperties &
	pressureProperties & {
		workingPressure: number;
		clampType: clampTypes;
		gasType: string;
	};

export type Weight = CommonEquipmentProperties & _weightProperties;

export type BCD = CommonEquipmentProperties & _sizeProperties;

export type Fins = CommonEquipmentProperties & _sizeProperties;
