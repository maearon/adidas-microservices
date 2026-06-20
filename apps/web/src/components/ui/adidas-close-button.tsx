"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type AdidasCloseButtonProps = {
  onClick: () => void
  ariaLabel?: string
  className?: string
  wrapperClassName?: string
  /** corner = modal overlap; panel = inline square for drawers/panels */
  variant?: "corner" | "panel"
}

export function AdidasCloseButton({
  onClick,
  ariaLabel = "Close",
  className,
  wrapperClassName,
  variant = "corner",
}: AdidasCloseButtonProps) {
  return (
    <div
      className={cn(
        "border border-black bg-white dark:border-white dark:bg-black",
        variant === "corner" &&
          "absolute right-0 top-0 z-50 translate-x-[30%] -translate-y-[30%]",
        variant === "panel" && "inline-flex shrink-0",
        wrapperClassName,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          "flex h-12 w-12 cursor-pointer items-center justify-center border border-border bg-white transition-colors duration-150 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900",
          className,
        )}
      >
        <X className="h-5 w-5" strokeWidth={1.25} />
      </button>
    </div>
  )
}
