import { IContextualMenuItemProps, IContextualMenuItem } from "@fluentui/react";

export interface DashboardTileDefinitionProps {
	/** The unique type name of the tile definition */
	name: string;
	/** Title above the tile, if not set, uses the key */
	title?: string;
	/** Width of the tile */
	width?: number;
	/** Height of the tile */
	height?: number;
	/** Set to render your own content */
	renderContent?: (props?: any) => JSX.Element;
	/** Set to render your own content */
	renderPreviewContent?: () => JSX.Element;
}
