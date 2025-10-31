import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if(session) redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
        {children}
      <Footer />
    </div>
  );
}
