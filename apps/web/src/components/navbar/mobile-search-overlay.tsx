"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
}

interface Suggestion {
  term: string
  count: number
}

const searchSuggestions = [
  { term: "dame", count: 22 },
  { term: "daily", count: 11 },
  { term: "dame 9", count: 4 },
  { term: "daily 4.0", count: 9 },
  { term: "daily 4.0 shoes", count: 9 },
  { term: "dance", count: 139 },
]

export default function MobileSearchOverlay({
  isOpen,
  onClose,
  searchQuery = "",
  setSearchQuery,
  onSearch,
}: MobileSearchOverlayProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const t = useTranslations("common")

  // 🔁 Debounce fetch
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      setFilteredSuggestions([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`)
        if (!res.ok) throw new Error("Failed to fetch suggestions")
        const data = await res.json()
        setFilteredSuggestions(data.suggestions || [])
      } catch {
        setFilteredSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleClear = () => setSearchQuery("")

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term)
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    onSearch(fakeEvent)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay mờ */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 sm:hidden" onClick={onClose} />

      {/* Search panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full bg-white dark:bg-black z-50 transform transition-transform duration-300 sm:hidden flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center bg-[#eceff1] dark:bg-black p-4 relative">
          <button onClick={onClose} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <form onSubmit={onSearch} className="flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t?.searchPlaceholder || "Search"}
              className="flex-1 text-[15px] outline-none font-medium placeholder:text-black"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-gray-500 text-sm font-medium"
              >
                {t?.clear || "clear"}
              </button>
            )}
          </form>

          {/* Thanh cam mảnh ở dưới header */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" />
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto p-4 pb-20 text-[14px] leading-snug">
          {loading ? (
            null
          ) : filteredSuggestions.length > 0 ? (
            <ul>
              {filteredSuggestions.map((suggestion, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion.term)}
                    className="flex justify-between items-center w-full py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate max-w-[75%] font-medium text-[15px]">
                      {suggestion.term}
                    </span>
                    <span className="text-gray-500 text-[14px]">{suggestion.count}</span>
                  </button>
                </li>
              ))}
              {(searchQuery && filteredSuggestions.length > 0) && (
                <li key={filteredSuggestions.length}>
                  <button
                    onClick={() => handleSuggestionClick(searchQuery)}
                    className="flex justify-between items-center w-full py-3 text-left underline underline-offset-2 hover:bg-gray-50 font-medium transition-colors"
                  >
                    {t?.seeAll || "See all"} &ldquo;{searchQuery}&rdquo;
                  </button>
                </li>
              )}
            </ul>
          ) : searchQuery && !loading ? (
            null
          ) : null}
        </div>
      </div>
    </>
  )
}
