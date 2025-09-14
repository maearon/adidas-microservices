// Navbar.tsx (server component)
import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  const session: Session | null = await getServerSession() // Session type-safe
  return <NavbarClient session={session} />
}
