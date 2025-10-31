import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import MyAccountClient from "./MyAccountClient";
import { redirect } from "next/navigation";

const MyAccountPage = async () => {
  const session: Session | null = await getServerSession() // Session type-safe

  if (!session?.user?.email) redirect("/sign-in")

  return (
    <MyAccountClient session={session} />
  )
}

export default MyAccountPage
