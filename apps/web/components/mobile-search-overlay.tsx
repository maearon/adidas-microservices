"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
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
  const [filteredSuggestions, setFilteredSuggestions] = useState(searchSuggestions)

  useEffect(() => {
    const q = searchQuery.trim()
    if (q) {
      const filtered = searchSuggestions.filter(({ term }) => term.toLowerCase().includes(q.toLowerCase()))
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions(searchSuggestions)
    }
  }, [searchQuery])

  const handleClear = () => {
    setSearchQuery("")
  }

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term)
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    onSearch(fakeEvent)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 sm:hidden" onClick={onClose} />

      {/* Search Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full bg-white z-50 transform transition-transform duration-300 sm:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Search Header */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <button onClick={onClose} className="mr-3">
            <ArrowLeft className="h-6 w-6" />
          </button>

          <form onSubmit={onSearch} className="flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 text-lg outline-hidden"
              autoFocus
            />
            {searchQuery && (
              <button type="button" onClick={handleClear} className="ml-2 text-gray-500 text-sm">
                clear
              </button>
            )}
          </form>
        </div>

        {/* Search Suggestions */}
        <div className="p-4">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.term)}
              className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50"
            >
              <span className="font-medium">{suggestion.term}</span>
              <span className="text-gray-500 text-sm">{suggestion.count}</span>
            </button>
          ))}

          {searchQuery && filteredSuggestions.length > 0 && (
            <button onClick={() => handleSuggestionClick(searchQuery)} className="mt-4 text-blue-600 text-sm">
              See all "{searchQuery}"
            </button>
          )}
        </div>
      </div>
    </>
  )
}
