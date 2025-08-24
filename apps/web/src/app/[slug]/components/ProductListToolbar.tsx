"use client"

import { useState } from "react"
import { Filter, Grid3X3, List, ChevronDown } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"
import { cn } from "@/lib/utils"

interface ProductListToolbarProps {
  totalCount: number
  currentSort: string
  viewMode: 'grid' | 'list'
  onSortChange: (sort: string) => void
  onViewChange: (view: 'grid' | 'list') => void
  onFilterToggle: () => void
  className?: string
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low_high', label: 'Price: Low to High' },
  { value: 'price_high_low', label: 'Price: High to Low' },
  { value: 'top_sellers', label: 'Top Sellers' },
  { value: 'relevance', label: 'Relevance' }
]

export default function ProductListToolbar({
  totalCount,
  currentSort,
  viewMode,
  onSortChange,
  onViewChange,
  onFilterToggle,
  className
}: ProductListToolbarProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort by'

  return (
    <div className={cn("bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Results count */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount} results
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <BaseButton
                variant="outline"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white bg-white dark:bg-black text-black dark:text-white rounded-none px-4 py-2"
              >
                <span className="text-sm">{currentSortLabel}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showSortDropdown && "rotate-180")} />
              </BaseButton>

              {showSortDropdown && (
                <div className="absolute top-full right-0 z-50 mt-1 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                          currentSort === option.value
                            ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
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

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-none">
              <button
                onClick={() => onViewChange('grid')}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === 'grid'
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === 'list'
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle Button */}
            <BaseButton
              variant="outline"
              onClick={onFilterToggle}
              className="flex items-center gap-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white rounded-none px-4 py-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  )
}
