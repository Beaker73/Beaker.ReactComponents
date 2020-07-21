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

	const farItems: ICommandBarItemProps[] = [];

	if (props.isEditting) {
		if (props.metaProps.editMenuItems && props.metaProps.editMenuItems.length > 0)
			farItems.push({
				key: "menu", iconOnly: true,
				subMenuProps: props.metaProps.editMenuItems ? {
					items: props.metaProps.editMenuItems,
				} : void 0,
			});
		farItems.push({
			key: "close", iconOnly: true, iconProps: { iconName: "ChromeClose" },
			onClick: () => { if (props.metaProps && props.metaProps.onTileRemoved) props.metaProps.onTileRemoved(); }
		});
	}
	const titleItem: ICommandBarItemProps[] = [
		{ key: "title", onRender: renderTitle }
	]

	return <Stack className={style.tile}>
		<Stack.Item grow={0} shrink={0}>
			<div ref={dragSource} className={style.header}>
				<CommandBar items={titleItem} farItems={farItems} styles={{ root: { padding: 0, background: isEditting ? "transparent" : void 0 } }} />
			</div>
		</Stack.Item>
		<Stack.Item grow={1}>
			<Stack verticalFill className={style.body}>
				{props.children}
			</Stack>
		</Stack.Item>
	</Stack>;

	function renderTitle() {
		return <Stack verticalFill verticalAlign="center" className={style.headerText}>
			<Text variant="large">{props.metaProps?.name ?? props.metaProps?.definition?.title ?? 'Untitled'}</Text>
		</Stack>
	}

	function getStyle() {
		return mergeStyleSets({
			tile: {
				border: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
				background: theme.semanticColors.bodyFrameBackground,
				borderRadius: theme.effects.roundedCorner4,
				boxShadow: theme.effects.elevation4,
				height: "100%",
				opacity: dragProps.isDragging ? 0.5 : 1,
				overflow: "hidden",
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
				overflow: "hidden",
			},
			headerText: {
				marginLeft: theme.spacing.m,
			},
			body: {
				boxSizing: "border-box",
				padding: theme.spacing.m,
			}
		});
	}
}