"use client"

import Image from "next/image"

export default function FullScreenLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-white flex justify-center"
      data-auto-id="loading-screen"
    >
      <div className="flex flex-col items-center justify-center w-full transform -translate-y-20">
        <div className="relative w-28 h-28 animate-pulse opacity-80">
          <Image
            src="/logo.png"
            alt="Loading"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
