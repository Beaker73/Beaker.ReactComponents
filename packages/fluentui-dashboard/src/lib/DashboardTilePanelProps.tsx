import { IPanelProps } from "@fluentui/react";
import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";

export interface DashboardTilePanelProps {
	/** The available tiles */
	tiles?: DashboardTileDefinitionProps[],
	/** If the tile panel is open */
	isOpen?: boolean;
	/** Called when user dismisses the tile panel */
	onDismiss?: () => void;
	/** Custom props for the underlying panel */
	panelProps?: IPanelProps;
}
