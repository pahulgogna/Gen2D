"use client"

import InputBox from "@/components/InputBox";
import { Chat, Message } from "@/lib/types";
import { redirect, useRouter } from "next/navigation";

export default function () {

    const router = useRouter()

    function onMessageSent(_: Message, chat: Chat) {
        let newUrl = `/c/${chat.id}`
        router.push(newUrl)
    }

    return (
        <div className="flex flex-col h-full justify-center gap-10">
            <div className="flex justify-center text-4xl font-semibold">
                Start Creating
            </div>
            <InputBox disabled={false} onMessageSent={onMessageSent} className="relative flex" />
        </div>
    )
}