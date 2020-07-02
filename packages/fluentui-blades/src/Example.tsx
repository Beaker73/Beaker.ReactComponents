import React from 'react';
import { Fabric, Stack, CommandBar, ICommandBarItemProps } from '@fluentui/react';

import "./style.css";

import { BladeList, useBlade } from './lib';
import { RootBlade } from "./RootBlade";
import { ToolbarBlade } from "./ToolbarBlade";

export function Example() {

	const { openBlade } = useBlade();

	const items: ICommandBarItemProps[] = [
		{ key: "blade", name: "Open Blade", iconProps: { iconName: "Blade" }, onClick: openBladeFromToolbar }
	];

	return <Fabric>
		<Stack className="fullPage" verticalFill>
			<Stack.Item grow={0}>
				<CommandBar items={items} />
			</Stack.Item>
			<Stack.Item grow={1} shrink={0}>
				<BladeList>
					<RootBlade />
				</BladeList>
			</Stack.Item>
		</Stack>
	</Fabric>;

	function openBladeFromToolbar() {
		openBlade(ToolbarBlade);
	}
}
