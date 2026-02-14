"use client"

import SidebarChat from './SidebarChat'
import { CirclePlus, ListPlus } from 'lucide-react'
import Link from 'next/link'
import { Chat } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GetAllChats } from '@/app/actions/chats'
import Modal from './Modal'
import ChatList from './ChatList'

function ChatsSidebar({ chats }: { chats: Chat[] }) {

    const [chatsState, setChatsState] = useState(chats)
    const { selectedChatId } = useParams<{ selectedChatId?: string }>();

    const [chatsOpen, setChatsOpen] = useState(false)

    async function updateChats() {
        let newChats: Chat[] = await GetAllChats()
        setChatsState(c => newChats)
    }

    useEffect(() => {

        if (!selectedChatId) return

        let newChatCreated = true

        chatsState.map((m) => {
            if (m.id == selectedChatId) newChatCreated = false;
        })

        if (newChatCreated) {
            updateChats()
        }

    }, [selectedChatId])

    return (
        <div className='w-full m-2 2xl:border-r border-slate-800'>
            <div className='hidden 2xl:inline'>
                <ChatList chats={chatsState} />
            </div>
            <div className='inline 2xl:hidden w-full p-1'>
                <ListPlus className='hover:cursor-pointer' onClick={() => {
                    setChatsOpen(o => !o)
                }} />
                <Modal className='left-0 top-35' open={chatsOpen}>
                    <ChatList chats={chatsState}/>
                </Modal>
            </div>
        </div>
    )
}

export default ChatsSidebar