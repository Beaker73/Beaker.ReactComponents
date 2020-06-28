import React from "react";

import { DefaultButton, Stack, getTheme } from "@fluentui/react";
import { Blade, useBlade } from "./lib";

import { CounterBlade } from "./CounterBlade";
import { OtherBlade } from "./OtherBlade";

export function RootBlade(): JSX.Element {

	const { openBlade } = useBlade();
	const theme = getTheme();

	return <Blade title="Root">
		<Stack tokens={{ childrenGap: theme.spacing.m }}>
			<DefaultButton onClick={openCounterBlade}>Open Counter Blade</DefaultButton>
			<DefaultButton onClick={openOtherBlade}>Open Other Blade</DefaultButton>
		</Stack>
	</Blade>

	function openCounterBlade() {
		openBlade(CounterBlade, { count: 1 });
	}
	function openOtherBlade() {
		openBlade(OtherBlade);
	}
}