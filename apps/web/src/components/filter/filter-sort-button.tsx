"use client"

import { SlidersHorizontal } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"

interface FilterSortButtonProps {
  onClick: () => void
  appliedCount?: number
  className?: string
  /** Desktop full label vs icon-only mobile */
  mobileIconOnly?: boolean
}

export default function FilterSortButton({
  onClick,
  appliedCount = 0,
  className,
  mobileIconOnly = false,
}: FilterSortButtonProps) {
  const t = useTranslations("productList")
  const filterT = useTranslations("filter")
  const label = filterT?.filterAndSort || t?.filterSort || "Filter & Sort"
  const showBadge = appliedCount > 0

  const iconWithBadge = (iconClass: string) => (
    <span className="relative inline-flex shrink-0">
      <SlidersHorizontal className={iconClass} aria-hidden />
      {showBadge && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center bg-black px-0.5 text-[10px] font-bold leading-none text-white dark:bg-white dark:text-black"
          aria-label={`${appliedCount} ${filterT?.active || "active"}`}
        >
          {appliedCount > 99 ? "99+" : appliedCount}
        </span>
      )}
    </span>
  )

  if (mobileIconOnly) {
    return (
      <BaseButton
        variant="outline"
        onClick={onClick}
        aria-label={label}
        className={cn(
          "flex items-center justify-center border-none bg-white p-2 text-black dark:bg-black dark:text-white",
          className
        )}
      >
        {iconWithBadge("h-5 w-5")}
      </BaseButton>
    )
  }

  return (
    <BaseButton
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-none border border-black bg-white px-3 py-2 text-black dark:border-white dark:bg-black dark:text-white",
        className
      )}
    >
      <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
      {iconWithBadge("h-4 w-4")}
    </BaseButton>
  )
}
