import type React from "react"
import { redirect } from "next/navigation"
import { getSession, type Session } from "@/lib/auth"
// import MyAccountSideBar from "./profile/MyAccountSideBar";

export default async function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const session: Session | null = await getSession() // Session type-safe

  if(!session) redirect("/account-login");

  return (
    // <div className="container mx-auto px-4 py-8">
    //   <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    //     {/* Sidebar */}
    //     <div className="lg:col-span-1">
    //       <div className="bg-background border rounded-lg p-6">
    //         <div className="mb-6">
    //           <h2 className="text-xl font-bold mb-2">HI {session?.user?.name?.toUpperCase() || "USER"}</h2>
    //           <div className="flex items-center text-base text-gray-600 dark:text-white">
    //             <span className="mr-2">🏆</span>
    //             <span>0 points to spend</span>
    //           </div>
    //         </div>

    //         <MyAccountSideBar />
    //       </div>
    //     </div>

    //     {/* Main Content */}
    //     <div className="lg:col-span-3">{children}</div>
    //   </div>
    // </div>
    {children}
  )
}
