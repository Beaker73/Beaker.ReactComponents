import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";
import { Rectangle } from "@fluentui/react";

export interface DashboardTileProps {
	/** key of dashboard tile, unique per tile */
	key: string;
	/** The defintion of the tile */
	definition: DashboardTileDefinitionProps;
	/** name on the tile */
	name?: string;
	/** Optional props for this tile specificly, past to the render call */
	props?: unknown;
	/** current left edge */
	left?: number;
	/** current top edge */
	top?: number;
	/** width of the tile */
	width?: number;
	/** height of the tile */
	height?: number;
	/** position of tile changed */
	onPositionChanged?: (pos: { left: number, top: number }) => void;
}

export interface DashboardTileCoreProps {
	isEditting?: boolean;
	metaProps: DashboardTileProps,
}


export function getTileSizeFromProps(props: DashboardTileProps): Rectangle {
	let left = 0, top = 0;
	let width = 0, height = 0;

	if (props?.left)
		left = props.left;
	if (props?.top)
		top = props.top;
	if (props?.width)
		width = props.width;
	if (props?.height)
		height = props.height;

	if (!width && props.definition?.width)
		width = props.definition.width;
	if (!height && props.definition?.height)
		height = props.definition.height;

	if (!left)
		left = 0;
	if (!top)
		top = 0;
	if (!width)
		width = 2;
	if (!height)
		height = 2;

	return new Rectangle(left, left + width, top, top + height);
}