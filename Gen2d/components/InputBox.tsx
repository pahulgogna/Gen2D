"use client"

import { SendMessage } from "@/app/actions/chats";
import { useParams } from "next/navigation";
import {  useEffect, useRef, useState } from "react";
import { Chat, Message } from "@/lib/types";
import { Loader } from "lucide-react";

function InputBox({
    onMessageSent,
    disabled,
    className
}: {
    onMessageSent: (message: Message, chat: Chat) => void,
    disabled: boolean,
    className?: string
}) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { selectedChatId } = useParams<{ selectedChatId?: string }>();

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    }, [message]);

    async function handleSubmit() {
        if (!message.trim()) return;
        try {
            console.log("selected chat")
            let NewMessage = (await SendMessage(message, selectedChatId, !selectedChatId))
            let parsedMessage: Message = JSON.parse(NewMessage.message)
            let parsedChat: Chat = JSON.parse(NewMessage.chat)
            onMessageSent(parsedMessage, parsedChat)
            setMessage("");
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className={`flex fixed h-18 w-full p-2 ${className} bottom-5 left-0 right-0 justify-center `}>
            <div className="flex h-full w-1/2 gap-2">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={1}
                    placeholder="Message..."
                    className="flex-1 h-full bg-neutral-900 rounded-xl p-3 resize-none outline-none text-sm placeholder-neutral-400 max-h-40 overflow-y-auto"
                />
                <button
                    disabled={disabled}
                    type="button"
                    onClick={handleSubmit}
                    className=" hover:cursor-pointer hover:bg-neutral-900 bg-neutral-800 end-1.5 bottom-1.5 text-white strong border border-transparent shadow-xs font-medium leading-5 rounded-2xl text-xs p-3 focus:outline-none"
                >
                    {disabled ? <Loader className="animate-spin"/> : "ask"}
                </button>
            </div>
        </div>
    )
}

export default InputBox