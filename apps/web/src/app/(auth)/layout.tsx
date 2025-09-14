import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if(session) redirect("/");

  return <>{children}</>;
}
