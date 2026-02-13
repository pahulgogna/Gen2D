import { GetAllChats } from "@/app/actions/chats"
import ChatsSidebar from "@/components/ChatsSidebar"
import React from "react"

export default async function ({ children }: { children: React.ReactNode }) {
    
    let chats = await GetAllChats()

    return (
        <div className="grid grid-cols-12 min-h-screen">
            <div className="hidden md:inline">
                <ChatsSidebar chats={chats} />
            </div>
            <div className="h-full col-span-11">
                {children}
            </div>
        </div>
    )
}