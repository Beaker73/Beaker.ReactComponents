export interface DashboardTileProps {
	name?: string;
	left?: number;
	top?: number;
	width?: number;
	height?: number;
}

export interface DashboardTileCoreProps extends DashboardTileProps {
	isEditting?: boolean;
}