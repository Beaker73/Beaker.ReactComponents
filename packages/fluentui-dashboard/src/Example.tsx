import React, { useState } from 'react';
import { Stack, CommandBar, ICommandBarItemProps, Toggle, Label, getTheme } from '@fluentui/react';

import { Dashboard } from "./lib";

import "./Style.css";

export function Example() {

	const theme = getTheme();

	const [isEditting, setIsEditting] = useState<boolean>(false);

	const farItems: ICommandBarItemProps[] = [
		{ key: "edit", name: "edit", onRender: renderEdit }
	]

	return <Stack verticalFill>
		<Stack.Item shrink={1} grow={0}>
			<CommandBar items={[]} farItems={farItems} />
		</Stack.Item>
		<Stack.Item grow={1} shrink={0}>
			<Dashboard verticalFill editting={isEditting} />
		</Stack.Item>
	</Stack>

	function renderEdit(): JSX.Element {
		return <Stack verticalFill verticalAlign="center">
			<Stack horizontal verticalAlign="baseline" tokens={{childrenGap: theme.spacing.m}}>
				<Label>Edit</Label>
				<Toggle onText="On" offText="Off" onChange={onToggleEdit} />
			</Stack>
		</Stack>
	}

	function onToggleEdit(e?: any, isChecked?: boolean) {
		setIsEditting(isChecked ?? false);
	}
}
