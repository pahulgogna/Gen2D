"use client"

import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { Message } from "@/lib/types";

function DisplayMessage({ message }: { message: Message }) {

    const [open, setOpen] = useState(false)

    if (message.role === "assistant") {
        return (
            <div className="flex justify-start border-b border-dashed border-slate-800 pb-5">
                <div className={`flex flex-col gap-5`}>
                    {message.assets.length != 0 ?
                        <div>
                            {message.assets.map((a, i) => {
                                return <video key={i} className="w-full rounded-xl border border-dashed border-slate-800" autoPlay controls>
                                    <source src={a} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            })}

                        </div>
                        :
                        null
                    }
                    {message.content.includes("from manim import *") ?
                        <div>
                            <div className="font-bold text-lg underline hover:cursor-pointer" onClick={() => setOpen(o => !o)}>
                                {open ? "hide code" : "show code"}
                            </div>
                            <div className={`${open ? "" : "hidden"}`}>
                                <MarkdownRenderer content={message.content} />
                            </div>
                        </div>
                        : 
                        <div className="font-semibold">
                            {message.content}
                        </div>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end">
            <div className="w-fit shadow-md bg-neutral-900 p-3 rounded-xl">
                {message.content}
            </div>
        </div>
    );
}

export default DisplayMessage;
