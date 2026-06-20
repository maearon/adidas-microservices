import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
