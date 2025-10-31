import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
        {children}
      <Footer />
    </div>
  );
}
