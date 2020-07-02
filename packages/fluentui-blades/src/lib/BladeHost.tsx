import React, { useState, useRef, useEffect, PropsWithChildren } from "react";

import { bladeHostContext } from "./BladeContext";
import { DialogProps, Dialog } from "./Dialog";

export interface BladeHostProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface DefineBladeProps {
    bladeType: React.FunctionComponent,
    bladeProps: {}
};

/**
 * Blade host provides the context for the blades
 * It also host the BladeList that physicly shows the blades
 */
export function BladeHost(props: PropsWithChildren<BladeHostProps>): JSX.Element {

    const [blades, setBlades] = useState<DefineBladeProps[]>([]);
    const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

    return <bladeHostContext.Provider value={{ openBlade, closeBlade, showDialog, blades }}>
        {props.children}
        {dialogProps ? <Dialog {...dialogProps} onClose={() => closeDialog()} /> : undefined}
    </bladeHostContext.Provider >;

    function openBlade(afterBladeId: number, blade: DefineBladeProps) {
        setBlades(b => [...b.slice(0, afterBladeId + 1), blade]);
    }

    function closeBlade(bladeId: number) {
        setBlades(b => b.slice(0, bladeId));
    }

    function showDialog(dialogProps: DialogProps) {
        setDialogProps(dialogProps);
    }

    function closeDialog() {
        setDialogProps(null);
    }
}
