import React, { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { getTheme, mergeStyles, mergeStyleSets } from "@fluentui/react";

import { DragItem } from "./DragItem";
import { DashboardTile } from "./DashboardTile";

export interface CustomDragLayerProps {
	gridSize: number,
}

export function DashboardDragLayer(props: CustomDragLayerProps): JSX.Element | null {

	const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
		item: monitor.getItem() as DragItem,
		itemType: monitor.getItemType(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging()
	}));

	const tileWidth = itemType === "tile" && item && item.props ? item.props.width ?? 2 : 2;
	const tileHeight = itemType === "tile" && item && item.props ? item.props.height ?? 2 : 2;

	if (!isDragging)
		return null;

	const theme = getTheme();
	const style = getStyle(initialOffset, currentOffset);

	return renderItem();

	function renderItem() {
		switch (itemType) {
			case "tile":
				return <div style={style}>
				</div>
			default:
				return null;
		}
	}

	function getStyle(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
		let { x, y } = currentOffset ?? { x: 0, y: 0 };
		const correction = 44; // for some reason initialOffset is below the drag source

		initialOffset = initialOffset ?? { x: 0, y: correction };

		x -= initialOffset.x;
		y -= initialOffset.y - correction;
		[x, y] = snapToGrid(x, y)
		x += initialOffset.x;
		y += initialOffset.y - correction;

		const s = parseInt(theme.spacing.m) / 2;
		return {
			position: "absolute",
			left: x,
			top: y,
			width: props.gridSize * tileWidth - s * 2,
			height: props.gridSize * tileHeight - s * 2,
			boxShadow: theme.effects.elevation64,
			border: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
			background: theme.semanticColors.bodyFrameBackground,
			borderRadius: theme.effects.roundedCorner2,
		} as CSSProperties;
	}

	function snapToGrid(x: number, y: number): [number, number] {
		const snappedX = Math.round(x / props.gridSize) * props.gridSize;
		const snappedY = Math.round(y / props.gridSize) * props.gridSize;
		return [snappedX, snappedY]
	}

}  