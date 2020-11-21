import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, useTheme, mergeStyleSets, Nav, ITheme, Panel, PanelType, LayerHost, Stack, CommandBar, ICommandBarItemProps, INavLinkGroup, INavLink } from "@fluentui/react";
import { getSoftVariant } from "@uifabric/variants"
import { navigate } from "hookrouter";

import { AppTitle } from "./AppTitle";

export interface AppNavBarProps {
	isCollapsed?: boolean;
}

export function AppNavBar(props: AppNavBarProps): JSX.Element {

	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		// when nav collapses, start with menu closed
		if (props.isCollapsed == true)
			setIsOpen(false);
	}, [props.isCollapsed])

	const theme = useTheme();
	const [softTheme, style] = useMemo(() => {
		const softTheme = getSoftVariant(theme);
		const style = getStyle();
		return [softTheme, style]
	}, [theme]);

	const barItems: ICommandBarItemProps[] = [];
	if (props?.isCollapsed)
		barItems.push({
			key: "openToggle", iconOnly: true, iconProps: { iconName: "CollapseMenu" },
			buttonStyles: { root: { minWidth: 44 } }, onClick: () => setIsOpen(o => !o),
		})
	barItems.push({
		key: "logo", onRender: () => <AppTitle />
	})

	const navGroups: INavLinkGroup[] = [
		{
			links: [
				{ key: "lorem", url: "/", name: "Lorem Ipsum", iconProps: { iconName: "TextDocument" } }
			]
		}
	];

	return <Stack verticalFill>
		<Stack.Item grow={0}>
			<CommandBar items={barItems} className={style.bar} styles={{ root: { margin: 0, padding: 0 } }} />
		</Stack.Item>
		<Stack.Item grow={1}>
			<LayerHost id="navHost" className={style.host}>
				{props.isCollapsed == true ? renderPanelNav() : renderNav()}
			</LayerHost>
		</Stack.Item>
	</Stack>

	function renderNav(): JSX.Element {
		return <ThemeProvider theme={softTheme} className={style.nav}>
			<Nav groups={navGroups} onLinkClick={followLink} />
		</ThemeProvider>

		function followLink(e?: React.MouseEvent<HTMLElement>, link?: INavLink) {
			if (e && link) {
				e.preventDefault();
				navigate(link.url);
			}
		}
	}

	function renderPanelNav() {
		return <Panel type={PanelType.customNear} customWidth="200px"
			layerProps={{ hostId: "navHost" }} styles={{ commands: { margin: 0 }, content: { padding: 0 } }}
			isLightDismiss onLightDismissClick={() => setIsOpen(false)}
			hasCloseButton={false} isOpen={isOpen}>
			{renderNav()}
		</Panel>
	}

	function getStyle() {
		return mergeStyleSets({
			bar: {
				borderBottom: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
			},
			host: {
				height: "100%",
				position: "relative",
				overflow: "hidden",
			},
			nav: {
				height: "100%",
				background: theme.semanticColors.bodyBackground,
				borderRight: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
			}
		});
	}
}