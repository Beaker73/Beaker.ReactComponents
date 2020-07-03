import React, { useMemo } from "react";
import { mergeStyleSets, getTheme } from "@fluentui/react";

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
}

export function Dashboard(props: DashboardProps): JSX.Element {

	const theme = getTheme();
	const tint = theme.semanticColors.bodyDivider;
	const size = props.tileSize ?? 142;
	const style = useMemo(getStyle, [theme, props.editting, tint, size, props.verticalFill]);

	return <div className={style.dashboard}>ToDo</div>

	function getStyle() {
		return mergeStyleSets({
			dashboard: {
				height: props.verticalFill ? '100%' : undefined,
				backgroundImage: props.editting ? `
					repeating-linear-gradient(${tint} 0 1px, transparent 1px 100%), 
					repeating-linear-gradient(90deg, ${tint} 0 1px, transparent 1px 100%)
				` : "transparent",
				backgroundSize: `${size}px ${size}px`,
			}
		})
	}
}

