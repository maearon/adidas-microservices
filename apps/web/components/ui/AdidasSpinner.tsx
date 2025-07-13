// components/ui/AdidasSpinner.tsx
"use client"

import { cn } from "@/lib/utils"

export default function AdidasSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center w-24 h-24", className)}>
      <div className="relative w-12 h-12 animate-spin-slow">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-3 h-6 border-t-[3px] border-l-[3px] border-black rounded-bl-full"
            style={{
              transform: `rotate(${i * 120}deg) translate(0, -100%)`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>
    </div>
  )
}
