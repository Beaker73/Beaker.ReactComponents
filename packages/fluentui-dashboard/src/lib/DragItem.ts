import { DashboardTileProps, getTileSizeFromProps } from "./DashboardTileProps";
import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";

export const dragItemTypeTile: symbol = Symbol("DragItem:Type:Tile");

export interface DragItem {
	type: typeof dragItemTypeTile;
	definition: DashboardTileDefinitionProps; // always set
	props?: DashboardTileProps; // only set for existing tiles
}

export function getTileSize(item: DragItem): [number, number] {
	let width = 0, height = 0;

	if (item.props) {
		const r = getTileSizeFromProps(item.props);
		width = r.width;
		height = r.height;
	}

	if (item.definition) {
		if (!width && item.definition.width)
			width = item.definition.width;
		if (!height && item.definition.height)
			height = item.definition.height;
	}

	if (!width)
		width = 2;
	if (!height)
		height = 2;

	return [width, height]
}
