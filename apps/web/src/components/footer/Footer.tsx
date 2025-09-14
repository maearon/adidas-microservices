// Footer.tsx (server component)
import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import FooterClient from "./FooterClient"

export default async function Footer() {
  const session: Session | null = await getServerSession() // Session type-safe
  return <FooterClient session={session} />
}
