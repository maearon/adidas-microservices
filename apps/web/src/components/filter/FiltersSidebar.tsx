"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { BaseButton } from "@/components/ui/base-button"
import { useUrlFilters } from "@/hooks/useUrlFilters"

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
  slug: string
}

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterSection {
  key: string
  title: string
  options: FilterOption[]
  type: "checkbox" | "radio" | "price" | "color"
}

// Mock filter data - in real app, this would come from API
const getFilterSections = (slug: string): FilterSection[] => {
  const baseFilters: FilterSection[] = [
    {
      key: "gender",
      title: "Gender",
      type: "checkbox",
      options: [
        { value: "men", label: "Men", count: 1250 },
        { value: "women", label: "Women", count: 980 },
        { value: "kids", label: "Kids", count: 450 },
        { value: "unisex", label: "Unisex", count: 120 },
      ],
    },
    {
      key: "category",
      title: "Category",
      type: "checkbox",
      options: [
        { value: "shoes", label: "Shoes", count: 850 },
        { value: "clothing", label: "Clothing", count: 1200 },
        { value: "accessories", label: "Accessories", count: 300 },
        { value: "equipment", label: "Equipment", count: 150 },
      ],
    },
    {
      key: "sport",
      title: "Sport",
      type: "checkbox",
      options: [
        { value: "running", label: "Running", count: 420 },
        { value: "football", label: "Football", count: 380 },
        { value: "basketball", label: "Basketball", count: 290 },
        { value: "training", label: "Training", count: 350 },
        { value: "lifestyle", label: "Lifestyle", count: 600 },
      ],
    },
    {
      key: "size",
      title: "Size",
      type: "checkbox",
      options: [
        { value: "6", label: "6", count: 45 },
        { value: "6.5", label: "6.5", count: 38 },
        { value: "7", label: "7", count: 52 },
        { value: "7.5", label: "7.5", count: 48 },
        { value: "8", label: "8", count: 65 },
        { value: "8.5", label: "8.5", count: 58 },
        { value: "9", label: "9", count: 72 },
        { value: "9.5", label: "9.5", count: 68 },
        { value: "10", label: "10", count: 75 },
        { value: "10.5", label: "10.5", count: 62 },
        { value: "11", label: "11", count: 55 },
        { value: "11.5", label: "11.5", count: 42 },
        { value: "12", label: "12", count: 38 },
      ],
    },
    {
      key: "color",
      title: "Color",
      type: "color",
      options: [
        { value: "black", label: "Black", count: 320 },
        { value: "white", label: "White", count: 280 },
        { value: "red", label: "Red", count: 150 },
        { value: "blue", label: "Blue", count: 180 },
        { value: "green", label: "Green", count: 120 },
        { value: "yellow", label: "Yellow", count: 90 },
        { value: "orange", label: "Orange", count: 75 },
        { value: "purple", label: "Purple", count: 65 },
        { value: "pink", label: "Pink", count: 85 },
        { value: "gray", label: "Gray", count: 200 },
      ],
    },
    {
      key: "brand",
      title: "Brand",
      type: "checkbox",
      options: [
        { value: "adidas", label: "adidas", count: 1200 },
        { value: "adidas-originals", label: "adidas Originals", count: 450 },
        { value: "y-3", label: "Y-3", count: 80 },
        { value: "stella-mccartney", label: "Stella McCartney", count: 60 },
      ],
    },
  ]

  return baseFilters
}

const ColorSwatch = ({ color, isSelected, onClick }: { color: string; isSelected: boolean; onClick: () => void }) => {
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    red: "#DC2626",
    blue: "#2563EB",
    green: "#16A34A",
    yellow: "#EAB308",
    orange: "#EA580C",
    purple: "#9333EA",
    pink: "#EC4899",
    gray: "#6B7280",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full border-2 transition-all duration-200",
        isSelected ? "border-black scale-110" : "border-gray-300 hover:border-gray-400",
        color === "white" && "border-gray-400",
      )}
      style={{ backgroundColor: colorMap[color] || color }}
      title={color}
    />
  )
}

export default function FiltersSidebar({ isOpen, onClose, slug }: FiltersSidebarProps) {
  const { query, toggleFilter, clearFilter, clearAllFilters } = useUrlFilters(slug)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["gender", "category", "sport"]))
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })

  const filterSections = getFilterSections(slug)

  // Get applied filters count
  const appliedFiltersCount = Object.entries(query).filter(([key, value]) => {
    if (["slug", "page", "per_page"].includes(key)) return false
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ""
  }).length

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey)
    } else {
      newExpanded.add(sectionKey)
    }
    setExpandedSections(newExpanded)
  }

  const isFilterSelected = (filterKey: string, value: string): boolean => {
    const currentValue = query[filterKey as keyof typeof query]
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value)
    }
    return currentValue === value
  }

  const getAppliedFilters = () => {
    const applied: Array<{ key: string; value: string; label: string }> = []

    filterSections.forEach((section) => {
      const currentValue = query[section.key as keyof typeof query]
      if (Array.isArray(currentValue)) {
        currentValue.forEach((value) => {
          const option = section.options.find((opt) => opt.value === value)
          if (option) {
            applied.push({ key: section.key, value, label: option.label })
          }
        })
      } else if (currentValue) {
        const option = section.options.find((opt) => opt.value === currentValue)
        if (option) {
          applied.push({ key: section.key, value: currentValue as string, label: option.label })
        }
      }
    })

    return applied
  }

  const appliedFilters = getAppliedFilters()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out overflow-hidden",
          "lg:max-w-sm",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Filter & Sort</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Applied Filters ({appliedFiltersCount})</span>
                <button onClick={clearAllFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map((filter) => (
                  <button
                    key={`${filter.key}-${filter.value}`}
                    onClick={() => toggleFilter(filter.key as any, filter.value)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {filter.label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex-1 overflow-y-auto">
            {filterSections.map((section) => (
              <div key={section.key} className="border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium">{section.title}</span>
                  {expandedSections.has(section.key) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedSections.has(section.key) && (
                  <div className="px-4 pb-4">
                    {section.type === "color" ? (
                      <div className="grid grid-cols-5 gap-3">
                        {section.options.map((option) => (
                          <div key={option.value} className="flex flex-col items-center gap-1">
                            <ColorSwatch
                              color={option.value}
                              isSelected={isFilterSelected(section.key, option.value)}
                              onClick={() => toggleFilter(section.key as any, option.value)}
                            />
                            <span className="text-xs text-center">{option.count}</span>
                          </div>
                        ))}
                      </div>
                    ) : section.key === "size" ? (
                      <div className="grid grid-cols-4 gap-2">
                        {section.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => toggleFilter(section.key as any, option.value)}
                            className={cn(
                              "p-2 text-sm border rounded transition-colors",
                              isFilterSelected(section.key, option.value)
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {section.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isFilterSelected(section.key, option.value)}
                              onChange={() => toggleFilter(section.key as any, option.value)}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                            />
                            <span className="flex-1 text-sm">{option.label}</span>
                            <span className="text-xs text-gray-500">({option.count})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <BaseButton onClick={onClose} className="w-full bg-black text-white hover:bg-gray-800 rounded-none">
              View Results
            </BaseButton>
          </div>
        </div>
      </div>
    </>
  )
}
