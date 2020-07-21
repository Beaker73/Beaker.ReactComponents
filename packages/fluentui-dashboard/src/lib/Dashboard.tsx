import React, { useMemo, PropsWithChildren, CSSProperties, LegacyRef, useRef, Ref, MutableRefObject, useEffect, useState } from "react";
import { mergeStyleSets, getTheme, Rectangle } from "@fluentui/react";

import { DashboardDragLayer } from "./DashboardDragLayer";
import { DashboardProps } from "./DashboardProps";
import { DashboardTile } from "./DashboardTile";
import { DashboardTileCoreProps, DashboardTileProps, getTileSizeFromProps } from "./DashboardTileProps";
import { useDrop, XYCoord } from "react-dnd";
import { DragItem, dragItemTypeTile, getTileSize } from "./DragItem";

export function Dashboard(props: PropsWithChildren<DashboardProps>): JSX.Element {

	const theme = getTheme();
	const tint = theme.semanticColors.bodyDivider;
	const size = props.tileSize ?? 142;
	const style = useMemo(getStyle, [theme, props.editting, tint, size, props.verticalFill]);
	const isEditting = props?.editting ?? false;

	// client offset of dashboard, needed for correct rendering by drag layer
	const dashRef = useRef<HTMLDivElement>(null);
	const rect = dashRef?.current?.getBoundingClientRect();
	const clientOffset = { x: rect?.left ?? 0, y: rect?.top ?? 0 };

	const [dropProps, dropRef] = useDrop({
		accept: dragItemTypeTile,
		canDrop: (item: DragItem, monitor) => {

			// compute current target
			const delta = monitor.getDifferenceFromInitialOffset()!;
			const source = monitor.getInitialSourceClientOffset()!;

			let left = Math.round(source.x + delta.x - clientOffset.x);
			let top = Math.round(source.y + delta.y - clientOffset.y);
			[left, top] = snapToGrid(left, top);

			// walk over all tiles to find any occupied
			// if so, no drop allowed
			const [w, h] = getTileSize(item);
			const dragRect = new Rectangle(left, left + w, top, top + h);
			var intersections = React.Children.map(props.children, child => {
				const metaProps = getProps(child);
				if (!metaProps || metaProps === item.props)
					return false;
				const targetRect = getTileSizeFromProps(metaProps);
				return intersects(dragRect, targetRect);
			});

			// all intersections must be false to be able to drop
			return intersections?.every(i => i === false) ?? true;
		},
		drop: (item: DragItem, monitor) => {
			const delta = monitor.getDifferenceFromInitialOffset()!;
			const source = monitor.getInitialSourceClientOffset()!;

			let left = Math.round(source.x + delta.x - clientOffset.x);
			let top = Math.round(source.y + delta.y - clientOffset.y);
			[left, top] = snapToGrid(left, top);

			if (item.props) {
				if (item.props.onPositionChanged)
					item.props.onPositionChanged({ left, top });
			} else {
				if (props.onNewTileDropped)
					props.onNewTileDropped({
						definition: item.definition,
						left, top,
					});
			}

		},
	});

	return <div ref={mergeRefs<HTMLDivElement>(dashRef, dropRef)} className={`${props.className} ${style.dashboard}`}>
		<DashboardDragLayer gridSize={size} clientOffset={clientOffset} />
		{React.Children.map(props.children, renderChild)}
	</div>

	function snapToGrid(x: number, y: number): [number, number] {
		const snappedX = Math.round(x / size);
		const snappedY = Math.round(y / size);
		return [snappedX, snappedY];
	}

	function getProps(child: React.ReactNode, item?: DragItem): DashboardTileProps | null {
		if (isReactElement(child) && child.type === DashboardTileMetadata) {
			if (!!item && child.props === item.props)
				return null;
			return child.props;
		}
		return null;
	}

	function renderChild(child: React.ReactNode, index: number): JSX.Element {

		const metaProps = getProps(child);
		if (!metaProps)
			return <>Error</>;

		const rect = getTileSizeFromProps(metaProps);
		const m = parseInt(theme.spacing.m);
		const positionStyle: CSSProperties = {
			position: "absolute",
			left: rect.left * size + m,
			top: rect.top * size + m,
			width: size * rect.width - m,
			height: size * rect.height - m,
		};

		return <div style={positionStyle}>
			{wrap()}
		</div>

		function wrap(): JSX.Element {
			return <DashboardTile isEditting={isEditting} metaProps={metaProps!}>
				{child}
			</DashboardTile>
		}
	}

	function getStyle() {
		const s = parseInt(theme.spacing.m) / 2;
		return mergeStyleSets({
			dashboard: {
				height: props.verticalFill ? '100%' : undefined,
				backgroundImage: props.editting ? `
					repeating-linear-gradient(${tint} 0 1px, transparent 1px 100%), 
					repeating-linear-gradient(90deg, ${tint} 0 1px, transparent 1px 100%)
				` : "transparent",
				backgroundSize: `${size}px ${size}px`,
				backgroundPosition: `${s}px ${s}px`,
				position: "relative",
			}
		})
	}
}

Dashboard.Tile = DashboardTileMetadata;

function isReactElement(child: React.ReactNode): child is React.ReactElement {
	return !!child && typeof child === "object" && "props" in child && "type" in child;
}

function DashboardTileMetadata(tileProps: PropsWithChildren<DashboardTileProps>): JSX.Element {
	if (tileProps.definition.renderContent) {
		return tileProps.definition.renderContent(tileProps.props);
	}

	return <>{tileProps.children}</>;
}

// based on https://www.davedrinks.coffee/how-do-i-use-two-react-refs/
function mergeRefs<T extends HTMLElement>(...refs: Ref<T>[]): Ref<T> {
	const filteredRefs = refs.filter(Boolean);
	if (!filteredRefs.length) return null;
	if (filteredRefs.length === 0) return filteredRefs[0];

	return inst => {
		for (const ref of filteredRefs) {
			if (typeof ref === 'function') {
				ref(inst);
			} else if (isMutableRef(ref) && !!inst) {
				ref.current = inst;
			}
		}
	};
};

function isMutableRef<T extends HTMLElement>(ref: Ref<T>): ref is MutableRefObject<T> {
	return !!ref && typeof ref === "object" && "current" in ref;
}

function intersects(r1: Rectangle, r2: Rectangle): boolean {
	if (r1.left >= r2.right || r2.left >= r1.right)
		return false;
	if (r1.top >= r2.bottom || r2.top >= r1.bottom)
		return false;
	return true;
}