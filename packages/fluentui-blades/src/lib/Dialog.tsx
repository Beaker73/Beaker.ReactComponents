import { Dialog as FluentDialog, DialogFooter, IModalProps, IDialogContentProps, PrimaryButton, Button, IButtonProps, getTheme, DefaultButton } from "@fluentui/react";
import React, { useMemo } from "react";

export type VariantName = "Warning" | "SevereWarning";

export interface DialogProps {
    title?: string | JSX.Element,
    message?: string,
    variant?: VariantName,
    onRenderBody?: () => JSX.Element,
    buttons?: IButtonProps[],
    onClose?: () => void;
}

export function Dialog(props: DialogProps): JSX.Element {

    const content: IDialogContentProps = {
        title: props.title,
        subText: props.message,
    };
    const modal: IModalProps = {
        overlay: {

        }
    }
    const theme = getTheme();
    const variantStyle: React.CSSProperties | undefined =
        useMemo(() => getVariantStyle(props.variant), [props.variant, theme]);

    const buttons = !props.buttons
        ? undefined
        : props.buttons.map((b, i) => {
            if (i == 0)
                return <PrimaryButton {...b} onClick={click} style={variantStyle} />;
            return <DefaultButton {...b} onClick={click} />;

            function click<T>(e?: React.MouseEvent<T>): void {
                if (b.onClick)
                    b.onClick(e as any);
                sendClose();
            }
        });

    return <FluentDialog hidden={false} dialogContentProps={content} modalProps={modal} onDismiss={sendClose} >
        {props.onRenderBody ? props.onRenderBody() : undefined}
        <DialogFooter>
            {buttons}
        </DialogFooter>
    </FluentDialog>

    function sendClose(): void {
        if (props.onClose)
            props.onClose();
    }

    function getVariantStyle(variant?: VariantName): React.CSSProperties | undefined {
        switch (variant) {
            case "Warning":
                return {
                    backgroundColor: theme.palette.orange,
                    borderColor: theme.palette.orange,
                };
            case "SevereWarning":
                return {
                    backgroundColor: theme.palette.red,
                    borderColor: theme.palette.red,
                };
        }

        return undefined;
    }
}