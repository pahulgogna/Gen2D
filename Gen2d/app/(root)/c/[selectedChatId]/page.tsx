
import { GetMessages } from "@/app/actions/chats"
import InputBox from "@/components/InputBox"
import OpenedMessages from "@/components/OpenedMessages"
import { Message } from "@/lib/types"

async function OpenChat({ params }: { params: Promise<{ selectedChatId: string }> }) {

  const { selectedChatId } = await params

  let Messages = await GetMessages(selectedChatId)
  let cleanedMessages: Message[] = Messages.map(m => {
        return {
          id: m._id.toString(),
          role: m.role,
          content: m.content,
          assets: m.assets,
          createdAt: m.createdAt
        }
      })

  return (
    <div className="p-10">
      <OpenedMessages Messages={cleanedMessages} />
    </div>
  )
}

export default OpenChat