import React, { useMemo, CSSProperties } from "react";
import { DashboardTileDefinitionProps } from "./DashboardTileDefinitionProps";
import { useDrag } from "react-dnd";
import { DragItem, dragItemTypeTile } from "./DragItem";
import { getTheme, mergeStyleSets } from "@fluentui/react";

export function DashboardTileDefinition(props: DashboardTileDefinitionProps): JSX.Element {

	const [dragProps, dragSource, dragView] = useDrag({
		item: {
			type: dragItemTypeTile,
			definition: props,
		} as DragItem,
		canDrag: true,
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const theme = getTheme();
	const style = useMemo(getStyle, [theme]);
	const styles: CSSProperties = {
		width: 32 * (props.width ?? 2),
		height: 32 * (props.height ?? 2),
	};

	return <div ref={dragSource} className={style.tile} style={styles}>
		{(props.renderPreviewContent ? props.renderPreviewContent() : null) ?? props.title ?? props.name}
	</div>;

	function getStyle() {
		return mergeStyleSets({
			tile: {
				display: "inline-box",
				boxSizing: "border-box",
				border: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
				background: theme.semanticColors.bodyFrameBackground,
				borderRadius: theme.effects.roundedCorner2,
				boxShadow: theme.effects.elevation4,
				opacity: dragProps.isDragging ? 0.5 : 1,
				padding: theme.spacing.s1,
				overflow: "hidden",
				backgroundImage: `
					repeating-linear-gradient(${theme.semanticColors.bodyFrameDivider} 0 1px, transparent 1px 100%), 
					repeating-linear-gradient(90deg, ${theme.semanticColors.bodyFrameDivider} 0 1px, transparent 1px 100%)
				`,
				backgroundSize: `32px 32px`,
				backgroundPosition: `-1px -1px`
			},
		});
	}
}
