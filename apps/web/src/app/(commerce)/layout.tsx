import Navbar from "@/components/navbar/Navbar"
import CommerceMinimalFooter from "@/components/commerce/CommerceMinimalFooter"
import { BodyScrollLockReset } from "@/components/BodyScrollLockReset"

export default function CommerceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BodyScrollLockReset />
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <CommerceMinimalFooter />
    </div>
  )
}
