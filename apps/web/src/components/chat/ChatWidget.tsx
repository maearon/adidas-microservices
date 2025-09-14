import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import ChatWidgetClient from "./ChatWidgetClient"

const ChatWidget = async () => {
  const session: Session | null = await getServerSession() // Session type-safe

  if (!session?.user?.email) return null

  return (
    <ChatWidgetClient session={session} />
  )
}

export default ChatWidget
