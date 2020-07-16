
export interface DashboardTileDefinitionProps {
	/** The unique key of the tile definition */
	key: string;
	/** Title above the tile, if not set, uses the key */
	title?: string;
	/** Width of the tile */
	width?: number;
	/** Height of the tile */
	height?: number;
}
