"use client"

// import { useAppSelector } from "@/store/hooks"
// import { selectUser } from "@/store/sessionSlice"
import { type Session } from "@/lib/auth"

interface AccountHeaderProps {
  session: Session | null;
}

export default function AccountHeader({ session }: AccountHeaderProps) {

  return (
    <div className="flex items-center justify-between border-b border-[#D3D7DA]">
      <div>
        <h1 className="text-3xl font-bold">HI {session?.user?.name?.toUpperCase() || "USER"}</h1>
        <div className="flex items-center mt-2">
          <span className="text-base text-gray-600 mr-2">👑</span>
          <span className="text-base text-gray-600">0 points to spend</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">adiclub</div>
        <div className="text-base">LEVEL 1</div>
      </div>
    </div>
  )
}
