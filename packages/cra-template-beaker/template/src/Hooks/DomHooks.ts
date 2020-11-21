import { useEffect, useState } from "react";

export type Size = [width: number, height: number];

export function useViewSize(): Size {
    const [size, setSize] = useState<Size>([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        window.addEventListener("resize", onResize);
        () => window.removeEventListener("resize", onResize);
        function onResize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
    }, []);
    return size;
}