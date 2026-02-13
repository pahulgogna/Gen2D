import SidebarChat from './SidebarChat'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Chat } from '@/lib/types'

function ChatsSidebar({ chats }: { chats: Chat[] }) {
    return (
        <div className="col-span-1 h-full border-r">
            <div className='flex justify-center p-2 pb-1 gap-1 bg-neutral-800 rounded-md m-1 mb-3'>
                <div>
                    New Chat
                </div>
                <Link href={"/c"}>
                    <CirclePlus className='hover:cursor-pointer'/>
                </Link>
            </div>
            {chats.map((c, i) => {
                return <SidebarChat chatName={c.name} chatId={c.id.toString()} key={i} />
            })}
        </div>
    )
}

export default ChatsSidebar