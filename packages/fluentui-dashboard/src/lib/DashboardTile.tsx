import React, { useMemo, PropsWithChildren, useEffect } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Text, getTheme, mergeStyleSets, Stack } from "@fluentui/react";

import { DashboardTileCoreProps } from "./DashboardTileProps";
import { DragItem } from "./DragItem";

export function DashboardTile(props: PropsWithChildren<DashboardTileCoreProps>): JSX.Element {

	const isEditting = props?.isEditting ?? false;

	const [dragProps, dragSource, dragView] = useDrag({
		item: {
			type: "tile",
			props: props.metaProps,
		} as DragItem,
		canDrag: isEditting,
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	console.log({props});

	useEffect(() => {
		dragView(getEmptyImage(), { captureDraggingState: true });
	});

	const theme = getTheme();
	const style = useMemo(getStyle, [theme, isEditting, dragProps.isDragging]);

	return <>
		<div className={style.tile}>
			<div ref={dragSource} className={style.header}>
				<Text variant="large" as="h2">{props.metaProps?.name ?? 'Untitled'}</Text>
			</div>
			<Stack verticalFill className={style.body}>
				{props.children}
			</Stack>
		</div>
	</>;

	function getStyle() {
		return mergeStyleSets({
			tile: {
				border: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
				background: theme.semanticColors.bodyFrameBackground,
				borderRadius: theme.effects.roundedCorner2,
				boxShadow: theme.effects.elevation4,
				height: "100%",
				opacity: dragProps.isDragging ? 0.5 : 1,
			},
			header: {
				boxSizing: "border-box",
				height: 44, // also hardcoded in source of commandbar, we match it.
				padding: theme.spacing.s1,
				background: isEditting ? theme.semanticColors.bodyBackgroundHovered : undefined,
				borderBottom: `solid 1px ${theme.semanticColors.bodyFrameDivider}`
			},
			body: {
				boxSizing: "border-box",
				padding: theme.spacing.s1,
			}
		});
	}
}