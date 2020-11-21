import React from "react";
import { mergeStyleSets } from "@fluentui/react";
import { useRoutes } from "hookrouter";

import { useViewSize } from "../Hooks";

import { AppCommandBar } from "./AppCommandBar";
import { AppNavBar } from "./AppNavBar";

import { routes } from "../AppRoutes";

export function Shell(): JSX.Element {

	const [width] = useViewSize();
	const isCollapsed = width < 600;

	const style = getStyle();
	const page = useRoutes(routes);

	return <>
		<main className={style.pag}>
			{page}
		</main>
		<div className={style.cmd}>
			<AppCommandBar isCollapsed={isCollapsed} />
		</div>
		<div className={style.nav}>
			<AppNavBar isCollapsed={isCollapsed} />
		</div>
	</>;

	function getStyle() {

		const navWidth = isCollapsed ? 0 : 200;

		return mergeStyleSets({
			cmd: {
				position: "fixed",
				left: isCollapsed ? 44 : 200,
				top: 0,
				width: "100vw",
				height: 44,
			},
			nav: {
				position: "fixed",
				left: 0,
				top: 0,
				width: isCollapsed ? "100%" : 200,
				height: "100%",
			},
			pag: {
				position: "fixed",
				left: navWidth,
				top: 44,
				width: `calc(100vw - ${navWidth}px)`,
				height: "calc(100vh - 44px)",
				overflow: "auto",
			}
		})
	}
}