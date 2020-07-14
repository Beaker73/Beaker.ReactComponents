import React, { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Stack, CommandBar, ICommandBarItemProps, Toggle, Label, getTheme, Nav, mergeStyleSets } from '@fluentui/react';

import { Dashboard, DashboardTileProps } from "./lib";
import { ExampleTile } from "./ExampleTile";

import "./Style.css";

export function Example() {

	const theme = getTheme();
	const style = useMemo(getStyle, [theme]);

	const [isEditting, setIsEditting] = useState<boolean>(false);

	const farItems: ICommandBarItemProps[] = [
		{ key: "edit", name: "edit", onRender: renderEdit }
	]

	const [normal, setNormal] = useState<DashboardTileProps>({ left: 0, top: 0, name: "Default Size" });
	const [big, setBig] = useState<DashboardTileProps>({ left: 0, top: 2, width: 3, height: 3, name: "Big One" });
	const [small, setSmall] = useState<DashboardTileProps>({ left: 2, top: 0, width: 1, height: 1, name: "Small One" });

	return <DndProvider backend={HTML5Backend}>
		<Stack verticalFill>
			<Stack.Item shrink={1} grow={0}>
				<CommandBar items={[]} farItems={farItems} className={style.bar} />
			</Stack.Item>
			<Stack.Item grow={1} shrink={0}>
				<Stack horizontal verticalFill>
					<Stack.Item grow={0} shrink={0} className={style.nav}>
						<Nav groups={[]}></Nav>
					</Stack.Item>
					<Stack.Item grow={1} shrink={0}>
						<Dashboard verticalFill editting={isEditting}>
							<Dashboard.Tile {...normal} onPositionChanged={pos => setNormal(n => ({ ...n, ...pos }))}>
								<ExampleTile />
							</Dashboard.Tile>
							<Dashboard.Tile {...big} onPositionChanged={pos => setBig(n => ({ ...n, ...pos }))}>
								<ExampleTile />
							</Dashboard.Tile>
							<Dashboard.Tile {...small} onPositionChanged={pos => setSmall(n => ({ ...n, ...pos }))}>
								Foobar
							</Dashboard.Tile>
						</Dashboard>
					</Stack.Item>
				</Stack>
			</Stack.Item>
		</Stack>
	</DndProvider >

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

	function getStyle() {
		return mergeStyleSets({
			bar: {
				zIndex: 10, 
				boxShadow: theme.effects.elevation4,
			},
			nav: {
				width: 200,
				boxShadow: theme.effects.elevation4,
				height: '100%',
				zIndex: 9,
			}
		});
	}
}
