import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";

export interface DashboardTileProps {
	/** key of dashboard tile, unique per tile */
	key: string;
	definition: DashboardTileDefinitionProps;
	/** name on the tile */
	name?: string;
	/** current left edge */
	left?: number;
	/** current top edge */
	top?: number;
	/** width of the tile */
	width?: number;
	/** height of the tile */
	height?: number;
	onPositionChanged?: (pos: { left: number, top: number }) => void;
}

export interface DashboardTileCoreProps {
	isEditting?: boolean;
	metaProps: DashboardTileProps,
}