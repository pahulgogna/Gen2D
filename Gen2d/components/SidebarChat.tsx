"use client"

import Link from 'next/link'
import { useParams } from 'next/navigation'

const styleUnselected = "flex py-2 px-1 justify-center bg-neutral-900 hover:bg-neutral-800 hover:cursor-pointer rounded-md m-1"
const styleSelected = "flex py-2 px-1 justify-center bg-neutral-800 hover:bg-neutral-700 hover:cursor-pointer rounded-md m-1"

function SidebarChat({ chatName, chatId, key }: { chatName: string, chatId: string, key: number }) {

    const { selectedChatId } = useParams<{ selectedChatId?: string }>();

    if (selectedChatId == chatId) {
        return <div className={styleSelected}>
            {chatName}
        </div>
    }

    return (
        <Link href={"/c/" + chatId} key={key} className={styleUnselected}>
            {chatName}
        </Link>
    )
}

export default SidebarChat