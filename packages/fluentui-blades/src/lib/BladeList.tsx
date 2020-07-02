import React, { useMemo, useRef, Children, useEffect, useState, PropsWithChildren } from "react";
import { Stack, getTheme, mergeStyleSets, mergeStyles, AnimationStyles } from "@fluentui/react";
import { bladeHostContext, bladeContext } from "./BladeContext";
import { DefineBladeProps } from "./BladeHost";

export interface BladeListProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function BladeList(props: PropsWithChildren<{}>): JSX.Element {

    const context = React.useContext(bladeHostContext);

    return <BladeListCore>
        {props.children}
        {renderBlades(context.blades)}
    </BladeListCore>;

    function renderBlades(blades: DefineBladeProps[]): JSX.Element[] {
        return blades.map((blade, i) => {
            const BladeType = blade.bladeType;
            return <bladeContext.Provider value={{ bladeId: i, bladeProps: blade.bladeProps }}>
                <BladeType key={blade.bladeType.name + ":" + JSON.stringify(blade.bladeProps)} {...blade.bladeProps} />
            </bladeContext.Provider>
        });
    }
}

/**
* a BladeList is the container that holds all the blades on screen
*/
function BladeListCore(props: React.PropsWithChildren<BladeListProps>): JSX.Element {

    // mobile view
    // 400 pixels is the default for a blade
    // when running on system less as 450
    //   - we disable margins
    //   - we scale 400 based on width of view
    const viewRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(100);
    const [gap, setGap] = useState(true);
    useEffect(() => {
        const width = viewRef.current?.clientWidth ?? 400;
        const gap = (!!width) && width >= 450;
        setScale(gap ? 100 : width / 4);
        setGap(gap);
    }, []);

    // when number of children changes, scroll smoothly to end
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const childCount = Children.count(props.children);
    useEffect(() => {
        window.setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }, [childCount]);

    const theme = getTheme();
    const style = useMemo(useStyle, [theme, gap]);
    const context = React.useContext(bladeHostContext);

    return <div ref={viewRef} className={`${style.container} ${props.className ?? ""}`}>
        <Stack horizontal tokens={{ childrenGap: gap ? theme.spacing.m : 0 }}
            className={[props.className, style.bladeList].join(" ")} style={{ scrollSnapType: gap ? "x proximity" : "x mandatory" }}>

            {Children.map(props.children, child => {
                const bladeWidth = 4 * scale; // for now, hardcoded at 4
                const sizeStyle = { width: bladeWidth, minWidth: bladeWidth, maxWidth: bladeWidth };
                return <div className={style.blade} style={{ ...sizeStyle, scrollSnapAlign: gap ? "start" : "center" }}>
                    {child}
                </div>;
            })}

            {/* No margin at righ scroll side
            https://stackoverflow.com/questions/11695354/css-right-margin-does-not-work-inside-a-div-with-overflow-scroll 
            as bonus: we now also have something to scroll into view when blade count changes */}
            <div className={style.rightMargin} ref={scrollRef}></div>

        </Stack>
    </div>;

    function useStyle() {
        return mergeStyleSets({
            container: {
                height: '100%',
            },
            bladeList: {
                boxSizing: "border-box",
                overflowY: "hidden",
                overflowX: "scroll",
                padding: gap ? theme.spacing.m : 0,
                scrollBehavior: "smooth",
                height: '100%',
            },
            blade: mergeStyles(
                {
                    boxSizing: "border-box",
                    height: "100%",
                    boxShadow: gap ? theme.effects.elevation16 : undefined,
                    border: `solid 1px ${theme.semanticColors.bodyFrameDivider}`,
                    background: theme.semanticColors.bodyBackground,
                    padding: theme.spacing.m,
                },
                AnimationStyles.slideLeftIn400,
            ),
            rightMargin: {
                width: 1,
                minWidth: 1,
                maxWidth: 1,
                background: "transparent",
            },
        })
    }
}

