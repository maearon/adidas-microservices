// Footer.tsx (server component)
import { getSession, type Session } from "@/lib/auth"
import FooterClient from "./FooterClient"

export default async function Footer() {
  const session: Session | null = await getSession() // Session type-safe
  return <FooterClient session={session} />
}
