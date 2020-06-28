import React from "react";

import { Button } from "@fluentui/react";
import { Blade, useBlade } from "./lib";

export interface CounterBladeProps {
	count: number,
}

export function CounterBlade(props: CounterBladeProps): JSX.Element {

	const { openBlade } = useBlade();

	return <Blade title={`Count: ${props.count}`}>
		<Button onClick={openCounterBlade}>Open Next Counter Blade</Button>
	</Blade>

	function openCounterBlade() {
		openBlade(CounterBlade, { count: props.count + 1 });
	}
}