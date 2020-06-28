import React, { useState, useRef, useEffect, PropsWithChildren } from "react";

import { bladeContext } from "./BladeContext";
import { BladeList } from "./BladeList";
import { DialogProps, Dialog } from "./Dialog";
import { Dictionary } from "./Dictionary";

export interface BladeHostProps extends React.HTMLAttributes<HTMLDivElement> {
    root: DefineBladeProps;
}

export interface DefineBladeProps {
    bladeType: React.FunctionComponent,
    bladeProps: {}
};

/**
 * Blade host provides the context for the blades
 * It also host the BladeList that physicly shows the blades
 */
export function BladeHost(props: BladeHostProps): JSX.Element {

    const [blades, setBlades] = useState<DefineBladeProps[]>([props.root]);
    const [dialogs, setDialogs] = useState<Dictionary<DialogProps>>({});

    const bladeInstances = blades.map((blade, i) => {
        const BladeType = blade.bladeType;
        const dialogProps = dialogs[i];
        return <bladeContext.Provider value={{ openBlade, closeBlade, showDialog, bladeId: i }}>
            <BladeType key={blade.bladeType.name + ":" + JSON.stringify(blade.bladeProps)} {...blade.bladeProps} />
            {dialogProps ? <Dialog {...dialogProps} onClose={() => closeDialog(i)} /> : undefined}
        </bladeContext.Provider>
    });

    return <bladeContext.Provider value={{ openBlade }}>
        <BladeList {...props}>
            {bladeInstances}
        </BladeList>
    </bladeContext.Provider >;

    function openBlade(afterBladeId: number, blade: DefineBladeProps) {
        setBlades(b => [...b.slice(0, afterBladeId + 1), blade]);
    }

    function closeBlade(bladeId: number) {
        setBlades(b => b.slice(0, bladeId));
    }

    function showDialog(bladeId: number, dialogProps: DialogProps) {
        setDialogs(d => {
            const clone = { ...d };
            clone[bladeId] = dialogProps
            return clone;
        });
    }

    function closeDialog(bladeId: number) {
        setDialogs(d => {
            const clone = { ...d };
            delete clone[bladeId];
            return clone;
        });
    }
}
