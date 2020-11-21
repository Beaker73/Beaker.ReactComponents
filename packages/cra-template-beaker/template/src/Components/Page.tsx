import React, { PropsWithChildren } from "react";
import { mergeStyleSets, useTheme } from "@fluentui/react";

export interface PageProps {
}

export function Page(props: PropsWithChildren<PageProps>): JSX.Element {

    const theme = useTheme();
    const style = getStyle();

    return <div className={style.page}>
        {props.children}
    </div>

    function getStyle() {
        return mergeStyleSets({
            page: {
                padding: theme.spacing.l1,
            }
        })
    }
}