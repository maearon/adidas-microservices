"use client"

import FiltersSidebar, { type FilterState } from "./filters-sidebar"
import type { SearchFilters as SearchFiltersType } from "@/types/search"

interface SearchFiltersProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void
  currentFilters: SearchFiltersType
  totalResults: number
}

export default function SearchFilters({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters,
  totalResults,
}: SearchFiltersProps) {
  return (
    <FiltersSidebar
      isOpen={isOpen}
      onClose={onClose}
      currentFilters={currentFilters as FilterState}
      totalCount={totalResults}
      onApplyFilters={(next) => {
        onFiltersChange({
          ...currentFilters,
          ...next,
          page: 1,
          query: currentFilters.query,
        } as Partial<SearchFiltersType>)
      }}
    />
  )
}
