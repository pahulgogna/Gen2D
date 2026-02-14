import { CirclePlus } from 'lucide-react'
import SidebarChat from './SidebarChat'
import { Chat } from '@/lib/types'
import Link from 'next/link'

function ChatList({ chats }: { chats: Chat[] }) {
    return (
        <div>
            <Link href={"/c"} className='flex justify-center rounded-md m-1 w-full mb-3'>
                <div className='text-nowrap text-center'>
                    New Chat
                </div>
                <CirclePlus className='hover:cursor-pointer w-full' />
            </Link>
            {chats.toReversed().map((c) => {
                return <SidebarChat chatName={c.name} chatId={c.id.toString()} key={c.id} />
            })}
        </div>
    )
}

export default ChatList