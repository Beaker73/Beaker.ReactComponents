import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Stack, CommandBar, ICommandBarItemProps, Toggle, Label, getTheme } from '@fluentui/react';

import { Dashboard, DashboardTileProps } from "./lib";
import { ExampleTile } from "./ExampleTile";

import "./Style.css";

export function Example() {

	const theme = getTheme();

	const [isEditting, setIsEditting] = useState<boolean>(false);

	const farItems: ICommandBarItemProps[] = [
		{ key: "edit", name: "edit", onRender: renderEdit }
	]

	return <DndProvider backend={HTML5Backend}>
		<Stack verticalFill>
			<Stack.Item shrink={1} grow={0}>
				<CommandBar items={[]} farItems={farItems} style={{ zIndex: 10, boxShadow: theme.effects.elevation4 }} />
			</Stack.Item>
			<Stack.Item grow={1} shrink={0}>
				<Dashboard verticalFill editting={isEditting}>
					<Dashboard.Tile left={0} top={0} width={2} height={2}>
						<ExampleTile />
					</Dashboard.Tile>
				</Dashboard>
			</Stack.Item>
		</Stack>
	</DndProvider>

	function renderEdit(): JSX.Element {
		return <Stack verticalFill verticalAlign="center">
			<Stack horizontal verticalAlign="baseline" tokens={{ childrenGap: theme.spacing.m }}>
				<Label>Edit</Label>
				<Toggle onText="On" offText="Off" onChange={onToggleEdit} />
			</Stack>
		</Stack>
	}

	function onToggleEdit(e?: any, isChecked?: boolean) {
		setIsEditting(isChecked ?? false);
	}

	function renderTile(props?: DashboardTileProps): JSX.Element {
		return <h2>Banaan</h2>
	}
}
