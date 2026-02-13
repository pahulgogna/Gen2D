
import React from "react";

export default function Modal({ open, onClose, children }: {
    open: boolean,
    onClose: () => Promise<undefined>,
    children: React.ReactNode
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex w-fit h-fit rounded-2xl justify-self-end top-15 right-5 bg-black/20"
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