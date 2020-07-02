import React from "react";

import { BladeProps } from "./Blade";
import { DefineBladeProps } from "./BladeHost";
import { DialogProps } from "./Dialog";



export interface BladeHostContext {
	blades: DefineBladeProps[];
	openBlade?(afterBladeId: number, blade: DefineBladeProps): void;
	closeBlade?(bladeId: number): void;
	showDialog?(props: DialogProps): void;
}

export const bladeHostContext = React.createContext<BladeHostContext>({ blades: [] });

export type UseBladeResult = {
	openBlade<P extends {} = {}>(bladeType: React.FunctionComponent<P>, props?: P): void;
	replaceBlade<P extends {} = {}>(bladeType: React.FunctionComponent<P>, props?: P): void;
	closeBlade(): void;
	showDialog(props: DialogProps): void;
}



export interface BladeContext {
	bladeId: number;
	bladeProps: BladeProps;
}

export const bladeContext = React.createContext<BladeContext>({ bladeId: -1, bladeProps: {} });

export function useBlade(): UseBladeResult {

	const hostContext = React.useContext(bladeHostContext);
	const context = React.useContext(bladeContext);

	return {
		openBlade: (bladeType: React.FunctionComponent<{}>, bladeProps) => {
			if (hostContext.openBlade !== void 0 && context.bladeId !== void 0) {
				hostContext.openBlade(context.bladeId, { bladeType, bladeProps: bladeProps ?? {} });
			}
		},
		replaceBlade: (bladeType: React.FunctionComponent<{}>, bladeProps) => {
			if (hostContext.openBlade !== void 0 && context.bladeId !== void 0) {
				hostContext.openBlade(context.bladeId - 1, { bladeType, bladeProps: bladeProps ?? {} });
			}
		},
		closeBlade: () => {
			if (hostContext.closeBlade !== void 0 && context.bladeId !== void 0) {
				hostContext.closeBlade(context.bladeId);
			}
		},
		showDialog: (props: DialogProps) => {
			if (hostContext.showDialog !== void 0) {
				hostContext.showDialog(props)
			}
		}
	};
}
