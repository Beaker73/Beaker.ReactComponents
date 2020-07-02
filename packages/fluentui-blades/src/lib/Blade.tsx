import React, { useContext, useMemo } from "react";
import { FocusZone, Stack, Text, getTheme, mergeStyleSets, CommandBar, ICommandBarItemProps, ContextualMenuItemType, IContextualMenuItem } from "@fluentui/react";

import { bladeContext, bladeHostContext } from "./BladeContext";

export interface BladeProps {
	size?: number;
	title?: string;
	buttons?: ICommandBarItemProps[];
	menuItems?: IContextualMenuItem[];
}

export function Blade(props: React.PropsWithChildren<BladeProps>): JSX.Element {

	const hostContext = useContext(bladeHostContext);
	const context = useContext(bladeContext);

	const bladeId = context.bladeId!;
	const theme = getTheme();
	const style = useMemo(useStyle, [theme, bladeId]);

	const items: ICommandBarItemProps[] = [];

	if (props.title)
		items.push({ key: "title", onRender: renderTitle, itemType: ContextualMenuItemType.Header, props });

	const farItems: ICommandBarItemProps[] = props.buttons ? [...props?.buttons] : [];
	if (bladeId >= 0)
		farItems.push({ key: "close", iconOnly: true, onClick: closeBlade, iconProps: { iconName: "ChromeClose" } });
	const menuItems: ICommandBarItemProps[] = props.menuItems ? [...props?.menuItems] : [];

	return <bladeContext.Provider value={{ ...context, bladeProps: props }}>
		<FocusZone>
			<Stack className={style.bladeContainer}>
				<Stack.Item grow={0}>
					<CommandBar styles={{ root: { padding: 0 } }} items={items}
						farItems={farItems} overflowItems={menuItems} />
				</Stack.Item>
				<Stack.Item grow={1}>
					{props.children}
				</Stack.Item>
			</Stack>
		</FocusZone>
	</bladeContext.Provider>;

	function renderTitle(): JSX.Element {
		return <Stack verticalAlign="center">
			<Text variant="xLarge">{props.title ?? ""}</Text>
		</Stack>;
	}

	function closeBlade(): void {
		if (hostContext.closeBlade !== void 0 && context.bladeId !== void 0) {
			hostContext.closeBlade(context.bladeId);
		}
	}

	function useStyle() {
		return mergeStyleSets({

			bladeContainer: {
				height: "100%",
			},
			bladeTitle: {
				marginBottom: theme.spacing.l1,
			},
		})
	}
}
