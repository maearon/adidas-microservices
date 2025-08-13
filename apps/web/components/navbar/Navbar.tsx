// Navbar.tsx (server component)
import { getSession, type Session } from "@/lib/auth"
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  const session: Session | null = await getSession() // Session type-safe
  return <NavbarClient session={session} />
}
