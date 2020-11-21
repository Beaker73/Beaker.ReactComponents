import React from "react";
import { CommandBar, useTheme, mergeStyleSets } from "@fluentui/react";

export interface AppCommandBarProps {
	isCollapsed?: boolean;
}

export function AppCommandBar(props: AppCommandBarProps): JSX.Element {

	const theme = useTheme();
	const style = getStyle();

	return <CommandBar className={style.command} items={[]} />

	function getStyle() {
		return mergeStyleSets({
			command: {
				borderBottom: `solid 1px ${theme.semanticColors.bodyFrameDivider}`
			}
		});
	}
}