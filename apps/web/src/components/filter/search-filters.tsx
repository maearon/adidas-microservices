"use client"

import FiltersSidebar, { type FilterState } from "./filters-sidebar"
import type { SearchFilters as SearchFiltersType } from "@/types/search"
import type { FilterOptionsResponse } from "@/types/product/filters"

interface SearchFiltersProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void
  currentFilters: SearchFiltersType
  totalResults: number
  facets?: FilterOptionsResponse | null
}

export default function SearchFilters({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters,
  totalResults,
  facets = null,
}: SearchFiltersProps) {
  return (
    <FiltersSidebar
      isOpen={isOpen}
      onClose={onClose}
      preset="search"
      showClearAll={false}
      currentFilters={currentFilters as FilterState}
      totalCount={totalResults}
      facets={facets}
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
