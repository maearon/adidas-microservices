import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import CartPageClient from "./CartPageClient";

export default async function Footer() {
  const session: Session | null = await getServerSession() // Session type-safe
  return <CartPageClient session={session} />
}
