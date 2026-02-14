import SidebarChat from './SidebarChat'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Chat } from '@/lib/types'

function ChatsSidebar({ chats }: { chats: Chat[] }) {
    return (
        <div className="col-span-1 h-full border-r">
            <Link href={"/c"} className='flex justify-center p-2 pb-1 gap-1 rounded-md m-1 mb-3'>
                <div>
                    New Chat
                </div>
                <CirclePlus className='hover:cursor-pointer' />
            </Link>
            {chats.map((c, i) => {
                return <SidebarChat chatName={c.name} chatId={c.id.toString()} key={i} />
            })}
        </div>
    )
}

export default ChatsSidebar