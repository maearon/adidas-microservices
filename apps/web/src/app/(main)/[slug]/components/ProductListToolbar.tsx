"use client"

import { useState } from "react"
import { Grid3X3, List, ChevronDown } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"
import FilterSortButton from "@/components/filter/filter-sort-button"
import { cn } from "@/lib/utils"
import { Product } from "@/types/product"
import { useTranslations } from "@/hooks/useTranslations"

interface ProductListToolbarProps {
  products: Product[]
  totalCount: number
  currentSort: string
  viewMode: "grid" | "list"
  onSortChange: (sort: string) => void
  onViewChange: (view: "grid" | "list") => void
  onFilterToggle: () => void
  appliedFilterCount?: number
  className?: string
}

export default function ProductListToolbar({
  products,
  totalCount,
  currentSort,
  viewMode,
  onSortChange,
  onViewChange,
  onFilterToggle,
  appliedFilterCount = 0,
  className,
}: ProductListToolbarProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const t = useTranslations("productList")
  const filterT = useTranslations("filter")

  const sortOptions = [
    {
      value: "price_low_high",
      label: filterT?.priceLowHigh || t?.priceLowToHigh || "Price (low - high)",
    },
    { value: "newest", label: filterT?.newest || t?.newest || "Newest" },
    {
      value: "top_sellers",
      label: filterT?.topSellers || t?.topSellers || "Top Sellers",
    },
    {
      value: "price_high_low",
      label: filterT?.priceHighLow || t?.priceHighToLow || "Price (high - low)",
    },
  ]

  const currentSortLabel =
    sortOptions.find((option) => option.value === currentSort)?.label ||
    filterT?.sortBy ||
    t?.sortBy ||
    "Sort by"

  return (
    <div
      className={cn(
        "border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: results — Adidas style */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {(filterT?.resultsCount || "{count} results").replace(
              "{count}",
              String(totalCount)
            )}
          </p>

          {/* Right: optional sort/view + Filter & Sort with badge */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <BaseButton
                variant="outline"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 rounded-none border border-gray-300 bg-white px-3 py-2 text-black hover:border-black dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-white"
              >
                <span className="text-sm">{currentSortLabel}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showSortDropdown && "rotate-180"
                  )}
                />
              </BaseButton>

              {showSortDropdown && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-black">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onSortChange(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                          currentSort === option.value
                            ? "bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden items-center border border-gray-300 dark:border-gray-600 sm:flex">
              <button
                type="button"
                onClick={() => onViewChange("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white text-gray-600 hover:text-black dark:bg-black dark:text-gray-400 dark:hover:text-white"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewChange("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white text-gray-600 hover:text-black dark:bg-black dark:text-gray-400 dark:hover:text-white"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <FilterSortButton
              onClick={onFilterToggle}
              appliedCount={appliedFilterCount}
              className="hidden sm:flex"
            />
            <FilterSortButton
              onClick={onFilterToggle}
              appliedCount={appliedFilterCount}
              mobileIconOnly
              className="flex sm:hidden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
