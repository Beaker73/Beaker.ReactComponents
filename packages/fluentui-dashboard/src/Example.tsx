import React, { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as uuid from "uuid";
import { Stack, CommandBar, ICommandBarItemProps, Toggle, Label, getTheme, Nav, mergeStyleSets, IContextualMenuItemProps, IContextualMenuItem } from '@fluentui/react';

import { Dashboard, DashboardTileProps, DashboardTilePanel, DashboardTileDefinitionProps, NewTileDropped } from "./lib";
import { InvertableTileProps, InvertableTile } from "./InvertableTile";

import "./Style.css";
import { ExampleTile } from './ExampleTile';

export function Example() {

	const theme = getTheme();
	const style = useMemo(getStyle, [theme]);

	const [isEditting, setIsEditting] = useState<boolean>(false);

	const farItems: ICommandBarItemProps[] = [
		{ key: "edit", name: "edit", onRender: renderEdit }
	]

	const tileDefinitions: DashboardTileDefinitionProps[] = [
		{
			name: "small", title: "Small One", width: 1, height: 1,
			renderPreviewContent: () => { return <span className={style.small}>S</span> },
			renderContent: () => <ExampleTile />,
		},
		{ name: "default", title: "Default Size" },
		{ name: "big", title: "Lorem Ipsum", width: 3, height: 3,
			renderContent: (p: InvertableTileProps) => {
				return <InvertableTile {...p} />;
			}
		},
		{ name: "wide", title: "Wide One", width: 4, height: 1 },
	];

	const [tileStates, setTileStates] = useState<DashboardTileProps[]>(() => [
		// init example tile
		{
			id: uuid.v4(),
			definition: tileDefinitions.find(d => d.name === "default")!,
			name: "Auto Default",
		}
	]);

	const tiles = tileStates.map(tileState => {

		const editMenuItems: IContextualMenuItem[] = [];

		if (tileState.definition.name === "big") {
			editMenuItems.push(
				{ key: "invert", text: "Invert", onClick: () => onInvert() }
			);
		}

		return <Dashboard.Tile {...tileState}
			onPositionChanged={pos => onPositionChanged(tileState, pos)}
			onTileRemoved={() => onTileRemoved(tileState)}
			editMenuItems={editMenuItems}
		/>

		function onInvert() {
			setTileStates(oldState => {
				// find index of item that changed
				const ix = oldState.findIndex(i => i.id === tileState.id);
				if (ix === -1)
					return oldState;
				// create clone and replace the item with a new
				const tile: DashboardTileProps<InvertableTileProps> = oldState[ix];
				const clone = [...oldState];
				clone.splice(ix, 1, { ...tile, props: { ...tile.props, isInverted: !(tile.props?.isInverted ?? false) } });
				return clone;
			})
		}
	})

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
						<Dashboard verticalFill editting={isEditting} className={style.dashboard}
							onNewTileDropped={onNewTileDropped}
						>
							{tiles}
						</Dashboard>
					</Stack.Item>
				</Stack>
			</Stack.Item>
		</Stack>
		<DashboardTilePanel tiles={tileDefinitions} isOpen={isEditting} onDismiss={() => setIsEditting(false)} />
	</DndProvider >

	function onPositionChanged(tile: DashboardTileProps, pos: { left: number, top: number }) {
		setTileStates(oldState => {
			// find index of item that changed
			const ix = oldState.findIndex(i => i.id === tile.id);
			if (ix === -1)
				return oldState;
			// create clone and replace the item with a new
			const clone = [...oldState];
			clone.splice(ix, 1, { ...tile, ...pos });
			return clone;
		});
	}

	function onTileRemoved(tile: DashboardTileProps) {
		setTileStates(oldState => {
			// find index of item that changed
			const ix = oldState.findIndex(i => i.id === tile.id);
			if (ix === -1)
				return oldState;
			// create clone and remove tile from it
			const clone = [...oldState];
			clone.splice(ix, 1);
			return clone;
		});
	}

	function onNewTileDropped(tileDrop: NewTileDropped): void {
		setTileStates(state => {
			return [...state, {
				...tileDrop,
				id: uuid.v4(),
			}]
		});
	}

	function renderEdit(): JSX.Element {
		return <Stack verticalFill verticalAlign="center">
			<Stack horizontal verticalAlign="baseline" tokens={{ childrenGap: theme.spacing.m }}>
				<Label>Edit</Label>
				<Toggle onText="On" offText="Off" checked={isEditting} onChange={onToggleEdit} />
			</Stack>
		</Stack>
	}

	function onToggleEdit(e?: any, isChecked?: boolean) {
		setIsEditting(isChecked ?? false);
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
			},
			dashboard: {
				background: theme.semanticColors.bodyStandoutBackground,
				//zIndex: -1,
			},
			small: {
				...theme.fonts.xSmall
			}
		});
	}
}
