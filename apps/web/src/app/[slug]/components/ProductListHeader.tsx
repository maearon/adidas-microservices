"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BaseButton } from "@/components/ui/base-button"
import { cn } from "@/lib/utils"

interface ProductListHeaderProps {
  title: string
  totalCount: number
  searchQuery?: string
  onSearch: (query: string) => void
  showSearchBar?: boolean
  className?: string
}

export default function ProductListHeader({
  title,
  totalCount,
  searchQuery = "",
  onSearch,
  showSearchBar = true,
  className
}: ProductListHeaderProps) {
  const [searchText, setSearchText] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchText.trim()
    if (query) {
      onSearch(query)
    }
  }

  const clearSearch = () => {
    setSearchText("")
    onSearch("")
  }

  return (
    <div className={cn("bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800", className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          {/* Left: Title and Count */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words text-black dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount} products available
            </p>
          </div>

          {/* Right: Search Bar */}
          {showSearchBar && (
            <div className="flex-shrink-0">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10 pr-10 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-none focus:border-black dark:focus:border-white focus:ring-0"
                  />
                  {searchText && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <BaseButton
                  type="submit"
                  variant="outline"
                  className="ml-2 px-4 py-2 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white rounded-none hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Search
                </BaseButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
