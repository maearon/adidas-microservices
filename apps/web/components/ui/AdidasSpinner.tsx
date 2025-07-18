// components/ui/AdidasSpinner.tsx
"use client"

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"

export default function AdidasSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      {[0, 1, 2].map((i) => (
        <Loader2 className="h-32 w-32 animate-spin" />
      ))}
    </div>
  )
}
