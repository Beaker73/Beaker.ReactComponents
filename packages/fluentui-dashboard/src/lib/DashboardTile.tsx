import React, { useMemo, PropsWithChildren, useEffect } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Text, getTheme, mergeStyleSets, Stack, CommandBar, ICommandBarProps, ICommandBarItemProps } from "@fluentui/react";

import { DashboardTileCoreProps } from "./DashboardTileProps";
import { DragItem, dragItemTypeTile } from "./DragItem";

export function DashboardTile(props: PropsWithChildren<DashboardTileCoreProps>): JSX.Element {

	const isEditting = props?.isEditting ?? false;

	const [dragProps, dragSource, dragView] = useDrag({
		item: {
			type: dragItemTypeTile,
			definition: props.metaProps.definition,
			props: props.metaProps,
		} as DragItem,
		canDrag: isEditting,
		collect: monitor => {
			return {
				isDragging: monitor.isDragging(),
			};
		},
	});

	// hide default drag item
	// ur drag layer will draw it
	useEffect(() => {
		dragView(getEmptyImage(), { captureDraggingState: true });
	});

	const theme = getTheme();
	const style = useMemo(getStyle, [theme, isEditting, dragProps.isDragging]);

	const farItems: ICommandBarItemProps[] = [
		{ key: "menu", iconOnly: true, iconProps: { iconName: "MoreVertical" } },
		{ key: "close", iconOnly: true, iconProps: { iconName: "ChromeClose" }, 
			onClick: () => { if (props.metaProps && props.metaProps.onTileRemoved) props.metaProps.onTileRemoved(); } }
	]
	const titleItem: ICommandBarItemProps[] = [
		{ key: "title", onRender: renderTitle }
	]

	return <>
		<div className={style.tile}>
			<div ref={dragSource} className={style.header}>
				<CommandBar items={titleItem} farItems={isEditting ? farItems : []} styles={{ root: { padding: 0, background: isEditting ? "transparent" : void 0 } }} />
			</div>
			<Stack verticalFill className={style.body}>
				{props.children}
			</Stack>
		</div>
	</>;

	function renderTitle() {
		return <Stack verticalFill verticalAlign="center" className={style.headerText}>
			<Text variant="large">{props.metaProps?.name ?? 'Untitled'}</Text>
		</Stack>
	}

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
				height: 45, // also hardcoded in source of commandbar, we match it.
				// background: isEditting ? theme.semanticColors.bodyBackgroundHovered : undefined,
				borderBottom: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,

				backgroundImage: `repeating-linear-gradient(${theme.semanticColors.bodyDivider} 0 1px, transparent 1px 100%)`,
				backgroundSize: `5px 3px`,
				backgroundPosition: `center center`,
				backgroundRepeat: "space",
			},
			headerText: {
				marginLeft: theme.spacing.m,
			},
			body: {
				boxSizing: "border-box",
				padding: theme.spacing.s1,
			}
		});
	}
}