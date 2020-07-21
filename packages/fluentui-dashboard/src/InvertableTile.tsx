import React from "react";
import { Stack, getTheme, mergeStyleSets } from "@fluentui/react";

export interface InvertableTileProps {
    isInverted?: boolean;
}

export function InvertableTile(props: InvertableTileProps): JSX.Element {

    const theme = getTheme();
    const style = getStyle();

    return <Stack verticalFill className={style.tile}>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.</p>
    </Stack>;

    function getStyle() {
        return mergeStyleSets({
            tile: {
                background: props.isInverted
                    ? theme.semanticColors.bodyText
                    : theme.semanticColors.bodyBackground,
                color: props.isInverted
                    ? theme.semanticColors.bodyBackground
                    : theme.semanticColors.bodyText,
            }
        })
    }
}
