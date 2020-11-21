import React from "react";
import { mergeStyleSets, Stack, Text } from "@fluentui/react";

export function AppTitle(): JSX.Element {

    const style = getStyle();

    return <Stack className={style.title} horizontal verticalAlign="center">
        <img src="/img/beaker.svg" width="32" height="32" style={{ padding: 6 }} />
        <Text variant="medium" style={{ fontWeight: 600 }}>Beaker Template</Text>
    </Stack>;

    function getStyle() {
        return mergeStyleSets({
            title: {
                width: 200 - 44,
            }
        })
    }
}