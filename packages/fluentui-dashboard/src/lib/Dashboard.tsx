import React, { useMemo, PropsWithChildren, CSSProperties } from "react";
import { mergeStyleSets, getTheme } from "@fluentui/react";

import { DashboardDragLayer } from "./DashboardDragLayer";
import { DashboardProps } from "./DashboardProps";
import { DashboardTile } from "./DashboardTile";
import { DashboardTileCoreProps, DashboardTileProps } from "./DashboardTileProps";

export function Dashboard(props: PropsWithChildren<DashboardProps>): JSX.Element {

	const theme = getTheme();
	const tint = theme.semanticColors.bodyDivider;
	const size = props.tileSize ?? 142;
	const style = useMemo(getStyle, [theme, props.editting, tint, size, props.verticalFill]);
	const isEditting = props?.editting ?? false;

	return <div className={style.dashboard}>
		<DashboardDragLayer gridSize={size} />
		{React.Children.map(props.children, renderChild)}
	</div>

	function renderChild(child: React.ReactNode, index: number): JSX.Element {

		const left = 0, top = 0, width = 2, height = 2;

		const s = parseInt(theme.spacing.m) / 2;
		const positionStyle: CSSProperties = {
			position: "absolute",
			left: left * size + s,
			top: top * size + s,
			width: size * width - s * 2,
			height: size * height - s * 2,
		};

		return <div style={positionStyle}>
			{wrap({ isEditting })}
		</div>

		function wrap(props: DashboardTileCoreProps): JSX.Element {
			if (isReactElement(child) && child.type === DashboardTileMetadata) {
				const metaProps: DashboardTileProps = child.props;
				// extract metadata
			}

			return <DashboardTile {...props}>
				{child}
			</DashboardTile>
		}
	}

	function getStyle() {
		return mergeStyleSets({
			dashboard: {
				height: props.verticalFill ? '100%' : undefined,
				backgroundImage: props.editting ? `
					repeating-linear-gradient(${tint} 0 1px, transparent 1px 100%), 
					repeating-linear-gradient(90deg, ${tint} 0 1px, transparent 1px 100%)
				` : "transparent",
				backgroundSize: `${size}px ${size}px`,
				position: "relative"
			}
		})
	}
}

Dashboard.Tile = DashboardTileMetadata;

function isReactElement(child: React.ReactNode): child is React.ReactElement {
	return !!child && typeof child === "object" && "props" in child && "type" in child;
}

function DashboardTileMetadata(props: PropsWithChildren<DashboardTileProps>): JSX.Element {
	return <>{props.children}</>;
}