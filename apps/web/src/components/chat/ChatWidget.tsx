import { getSession, Session } from "@/lib/auth"
import ChatWidgetClient from "./ChatWidgetClient"

const constChatWidgetPage = async () => {
  const session: Session | null = await getSession() // Session type-safe

  if (!session?.user?.email) return null

  return (
    <ChatWidgetClient session={session} />
  )
}

export default constChatWidgetPage
