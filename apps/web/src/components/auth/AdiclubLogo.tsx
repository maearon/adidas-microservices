"use client"

import AdidasLogo from "@/components/adidas-logo"
import { cn } from "@/lib/utils"

type AdiclubLogoProps = {
  className?: string
  logoClassName?: string
}

export default function AdiclubLogo({ className, logoClassName }: AdiclubLogoProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <AdidasLogo className={cn("h-auto w-14", logoClassName)} />
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
      <div className="inline-flex items-center text-foreground">
        <span className="text-2xl font-bold leading-none">adi</span>
        <span className="text-2xl font-bold italic leading-none text-[#0085CA]">club</span>
        <span className="relative ml-2 inline-flex h-6 w-12 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-[#0085CA]" />
          <span className="absolute inset-0 rounded-full border-2 border-[#0085CA] rotate-12" />
        </span>
      </div>
    </div>
  )
}
