import { DashboardTileProps } from "./DashboardTileProps";
import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";

export interface DragItem {
	type: "tile";
	definition: DashboardTileDefinitionProps; // always set
	props?: DashboardTileProps; // only set for existing tiles
}