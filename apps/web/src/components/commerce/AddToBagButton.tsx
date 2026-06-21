"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AddToBagButtonProps = {
  label?: string
  onClick?: () => void
  className?: string
}

export default function AddToBagButton({
  label = "Add to bag",
  onClick,
  className,
}: AddToBagButtonProps) {
  return (
    <Button
      theme="black"
      border
      shadow
      pressEffect
      showArrow={false}
      fullWidth
      onClick={onClick}
      className={cn(
        "h-12 w-full normal-case [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:justify-between [&>span]:px-1",
        className,
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      <ShoppingBag className="mr-1 h-5 w-5 shrink-0" strokeWidth={1.5} />
    </Button>
  )
}
