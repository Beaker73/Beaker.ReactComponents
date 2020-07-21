import { DashboardTileProps } from "./DashboardTileProps";
import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";

export interface DashboardProps {

    /**
     * Size of a tile. Default card is 2x2 of these tiles
     * @defaultvalue 120
     */
	tileSize?: number;

    /**
     * if the dashboard is in editting mode
     * @defaultvalue false
     */
	editting?: boolean;

    /**
     * Defines whether the Dashboard should take up 100% of the height of its parent.
     * @defaultvalue true
     */
    verticalFill?: boolean;
    
    /**
     * Class name for styling
     */
    className?: string;

    /**
     * On new tile dropped
     */
    onNewTileDropped?(tileInfo: NewTileDropped): void;
}

/** Tile drop information */
export interface NewTileDropped {
    /** The defintion of the dropped tile */
    definition: DashboardTileDefinitionProps;
    /** The left drop position */
    left: number;
    /** The top drop position */
    top: number;
}