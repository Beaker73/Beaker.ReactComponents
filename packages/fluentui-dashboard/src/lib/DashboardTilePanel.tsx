import React from "react";
import { Panel, IPanelProps, Stack, getTheme } from "@fluentui/react";

import { DashboardTilePanelProps } from "./DashboardTilePanelProps";
import { DashboardTileDefinition } from "./DashboardTileDefinition";

export function DashboardTilePanel(props: DashboardTilePanelProps): JSX.Element {

	let panelProps: IPanelProps = {
		isOpen: props.isOpen ?? false,
		onDismiss: props.onDismiss,
		isBlocking: false,
		headerText: "Dashboard Tiles",
	};

	if (props.panelProps)
		Object.assign(panelProps, props.panelProps);

	const theme = getTheme();

	const tiles = (props.tiles ?? []).map(def => {
		return  <Stack.Item shrink={0} grow={0}>
			<DashboardTileDefinition {...def} />
		</Stack.Item>
	});

	return <Panel {...panelProps}>
		<Stack horizontal verticalFill wrap tokens={{  childrenGap: theme.spacing.m }}>
			{tiles}
		</Stack>
	</Panel>;
}

