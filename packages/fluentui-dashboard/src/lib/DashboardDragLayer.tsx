import React, { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { getTheme, mergeStyles, mergeStyleSets } from "@fluentui/react";

import { DragItem, dragItemTypeTile, getTileSize } from "./DragItem";
import { DashboardTile } from "./DashboardTile";

export interface CustomDragLayerProps {
	gridSize: number,
	clientOffset: XYCoord,
}

export function DashboardDragLayer(props: CustomDragLayerProps): JSX.Element | null {

	const { itemType, isDragging, item, initialOffset, currentOffset, canDrop } = useDragLayer(monitor => ({
		item: monitor.getItem() as DragItem,
		itemType: monitor.getItemType(),
		initialOffset: sub(monitor.getInitialSourceClientOffset(), props.clientOffset),
		currentOffset: sub(monitor.getSourceClientOffset(), props.clientOffset),
		isDragging: monitor.isDragging(),
		canDrop: (() => {
			const targetIds = monitor.isDragging() ? (monitor as any).getTargetIds() : [];
			for (let i = targetIds.length - 1; i >= 0; i--) {
				if ((monitor as any).isOverTarget(targetIds[i])) {
					return (monitor as any).canDropOnTarget(targetIds[i])
				}
			}

			return false;
		})(),
	}));

	if (!isDragging)
		return null;

	const [tileWidth, tileHeight] = getTileSize(item);
	const theme = getTheme();
	const style = getStyle(initialOffset, currentOffset);

	return <div style={style}>
	</div>

	function getStyle(initialOffset: XYCoord, currentOffset: XYCoord) {
		let { x, y } = currentOffset;

		initialOffset = initialOffset;

		x -= initialOffset.x;
		y -= initialOffset.y;
		[x, y] = snapToGrid(x, y)
		x += initialOffset.x;
		y += initialOffset.y;

		const s = parseInt(theme.spacing.m) / 2;
		return {
			position: "absolute",
			left: x,
			top: y,
			width: props.gridSize * tileWidth - s * 2,
			height: props.gridSize * tileHeight - s * 2,
			boxShadow: theme.effects.elevation64,
			border: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
			background: canDrop ? theme.semanticColors.bodyFrameBackground : theme.palette.red,
			borderRadius: theme.effects.roundedCorner2,
			boxSizing: "border-box",
			pointerEvents: "none",
			opacity: canDrop ? 1 : 0.25,
			zIndex: 250,
		} as CSSProperties;
	}

	function snapToGrid(x: number, y: number): [number, number] {
		const snappedX = Math.round(x / props.gridSize) * props.gridSize;
		const snappedY = Math.round(y / props.gridSize) * props.gridSize;
		return [snappedX, snappedY]
	}

}

function sub(a: XYCoord | null, b: XYCoord): XYCoord {

	return {
		x: (a?.x ?? 0) - b.x,
		y: (a?.y ?? 0) - b.y,
	}
}