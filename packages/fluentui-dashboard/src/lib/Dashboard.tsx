import React, { useMemo, PropsWithChildren, CSSProperties, LegacyRef, useRef, Ref, MutableRefObject, useEffect, useState } from "react";
import { mergeStyleSets, getTheme, Rectangle } from "@fluentui/react";

import { DashboardDragLayer } from "./DashboardDragLayer";
import { DashboardProps } from "./DashboardProps";
import { DashboardTile } from "./DashboardTile";
import { DashboardTileCoreProps, DashboardTileProps } from "./DashboardTileProps";
import { useDrop, XYCoord } from "react-dnd";
import { DragItem } from "./DragItem";

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
		accept: "tile",
		canDrop: (item: DragItem, monitor) => {

			// compute current target
			const delta = monitor.getDifferenceFromInitialOffset()!;
			const source = monitor.getInitialSourceClientOffset()!;

			let left = Math.round(source.x + delta.x - clientOffset.x);
			let top = Math.round(source.y + delta.y - clientOffset.y);
			[left, top] = snapToGrid(left, top);

			// walk over all tiles to find any occupied
			// if so, no drop allowed
			const dragRect = new Rectangle(left, left + (item?.props?.width ?? 2) - 1, top, top + (item?.props?.height ?? 2) - 1);
			var intersections = React.Children.map(props.children, child => {
				let metaProps: DashboardTileProps = { left: 0, top: 0, width: 2, height: 2 };
				if (isReactElement(child) && child.type === DashboardTileMetadata) {
					if(child.props === item.props)
						return false;
					metaProps = Object.assign(metaProps, child.props);
				}
				console.log({ metaProps });
				const targetRect = new Rectangle(metaProps.left, metaProps.left! + metaProps.width! - 1, metaProps.top, metaProps.top! + metaProps.height! - 1)
				return intersects(dragRect, targetRect);
			})
			console.log({ intersections });

			// all intersections must be false to be able to drop
			return intersections?.every(i => i === false) ?? true;
		},
		drop: (item: DragItem, monitor) => {
			const delta = monitor.getDifferenceFromInitialOffset()!;
			const source = monitor.getInitialSourceClientOffset()!;

			let left = Math.round(source.x + delta.x - clientOffset.x);
			let top = Math.round(source.y + delta.y - clientOffset.y);
			[left, top] = snapToGrid(left, top);

			if (item.props.onPositionChanged)
				item.props.onPositionChanged({ left, top });
		},
	});

	return <div ref={mergeRefs<HTMLDivElement>(dashRef, dropRef)} className={style.dashboard}>
		<DashboardDragLayer gridSize={size} clientOffset={clientOffset} />
		{React.Children.map(props.children, renderChild)}
	</div>

	function snapToGrid(x: number, y: number): [number, number] {
		const snappedX = Math.round(x / size);
		const snappedY = Math.round(y / size);
		return [snappedX, snappedY];
	}

	function renderChild(child: React.ReactNode, index: number): JSX.Element {

		let metaProps: DashboardTileProps = {};
		if (isReactElement(child) && child.type === DashboardTileMetadata)
			metaProps = child.props;
		const { left = 0, top = 0, width = 2, height = 2, } = metaProps;

		const s = parseInt(theme.spacing.m) / 2;
		const positionStyle: CSSProperties = {
			position: "absolute",
			left: left * size + s,
			top: top * size + s,
			width: size * width - s * 2,
			height: size * height - s * 2,
		};

		return <div style={positionStyle}>
			{wrap()}
		</div>

		function wrap(): JSX.Element {

			return <DashboardTile isEditting={isEditting} metaProps={metaProps}>
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
				position: "relative",
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

	console.log({ r1, r2 });

	if (r1.left > r2.right || r2.left > r1.right)
		return false;
	if (r1.top > r2.bottom || r2.top > r1.bottom)
		return false;
	return true;
}