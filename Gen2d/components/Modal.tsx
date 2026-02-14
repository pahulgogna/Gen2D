
import React from "react";

export default function Modal({ open, onClose, children, className }: {
    open: boolean,
    onClose?: () => Promise<undefined>,
    children: React.ReactNode,
    className?: string
}) {
    if (!open) return null;

    return (
        <div
            className={"fixed inset-0 -scale-z-200 flex w-fit h-fit rounded-2xl bg-black " + className}
            onClick={onClose}
        >
            <div
                className="p-6 rounded"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}