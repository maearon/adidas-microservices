import { Footer } from "react-day-picker";
import { Navbar } from "./navbar";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
