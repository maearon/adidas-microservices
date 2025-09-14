"use client"

import { useAppSelector } from "@/store/hooks"
import { selectUser } from "@/store/sessionSlice"

export default function AccountHeader() {
  const userData = useAppSelector(selectUser)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">HI {userData.value?.name?.toUpperCase() || "MANH"}</h1>
        <div className="flex items-center mt-2">
          <span className="text-base text-gray-600 dark:text-white mr-2">👑</span>
          <span className="text-base text-gray-600 dark:text-white">0 points to spend</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">adiclub</div>
        <div className="text-base">LEVEL 1</div>
      </div>
    </div>
  )
}
