export interface DashboardTileProps {
	name?: string;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	onPositionChanged?: (pos: { left: number, top: number }) => void;
}

export interface DashboardTileCoreProps {
	isEditting?: boolean;
	metaProps: DashboardTileProps,
}