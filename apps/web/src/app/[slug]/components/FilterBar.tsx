"use client"

import { useState, useEffect } from "react"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { parseSlugToFilters } from "@/utils/slug-parser"

interface FilterBarProps {
  filters: Record<string, any>
  onFilterChange: (filters: Record<string, any>) => void
  onClearFilters: () => void
  slug: string
  totalCount: number
}

interface FilterOption {
  value: string
  label: string
  count?: number
}

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  slug,
  totalCount
}: FilterBarProps) {
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    gender: false,
    category: false,
    sport: false,
    price: false,
    size: false,
    color: false,
    brand: false,
    material: false,
    collection: false
  })

  // Get initial filters from slug
  const slugFilters = parseSlugToFilters(slug)

  // const toggleFilter = (filterType: string) => {
  //   setExpandedFilters(prev => ({
  //     ...prev,
  //     [filterType]: !prev[filterType]
  //   }))
  // }
  const toggleFilter = (filterType: string) => {
    setExpandedFilters(prev => {
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false
        return acc
      }, {} as Record<string, boolean>)

      return {
        ...allClosed,
        [filterType]: !prev[filterType],  // mở/đóng cái đang click
      }
    })
  }

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const currentValues = Array.isArray(filters[filterType]) ? filters[filterType] : []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    const newFilters = {
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : undefined
    }

    onFilterChange(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value && (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  const clearFilter = (filterType: string) => {
    const newFilters = { ...filters }
    delete newFilters[filterType]
    onFilterChange(newFilters)
  }

  // Filter options based on slug context and real data
  const getFilterOptions = (filterType: string): FilterOption[] => {
    switch (filterType) {
      case 'gender':
        return [
          { value: 'men', label: 'Men', count: slugFilters.gender?.includes('men') ? totalCount : Math.floor(totalCount * 0.4) },
          { value: 'women', label: 'Women', count: slugFilters.gender?.includes('women') ? totalCount : Math.floor(totalCount * 0.4) },
          { value: 'kids', label: 'Kids', count: slugFilters.gender?.includes('kids') ? totalCount : Math.floor(totalCount * 0.2) },
          { value: 'unisex', label: 'Unisex', count: Math.floor(totalCount * 0.1) }
        ]
      case 'category':
        return [
          { value: 'shoes', label: 'Shoes', count: slugFilters.category?.includes('shoes') ? totalCount : Math.floor(totalCount * 0.6) },
          { value: 'clothing', label: 'Clothing', count: slugFilters.category?.includes('clothing') ? totalCount : Math.floor(totalCount * 0.3) },
          { value: 'accessories', label: 'Accessories', count: slugFilters.category?.includes('accessories') ? totalCount : Math.floor(totalCount * 0.1) }
        ]
      case 'sport':
        const sports = [
          'running', 'soccer', 'basketball', 'football', 'golf', 'tennis',
          'baseball', 'volleyball', 'cycling', 'hiking', 'outdoor', 'workout',
          'yoga', 'motorsport', 'swim', 'softball', 'cricket', 'rugby',
          'skateboarding', 'weightlifting'
        ]
        return sports.map(sport => ({
          value: sport,
          label: sport.charAt(0).toUpperCase() + sport.slice(1),
          count: slugFilters.sport?.includes(sport) ? totalCount : Math.floor(totalCount * 0.1)
        }))
      case 'brand':
        return [
          { value: 'adidas', label: 'adidas', count: Math.floor(totalCount * 0.8) },
          { value: 'adidas-originals', label: 'adidas Originals', count: Math.floor(totalCount * 0.15) },
          { value: 'adidas-performance', label: 'adidas Performance', count: Math.floor(totalCount * 0.05) }
        ]
      case 'material':
        return [
          { value: 'mesh', label: 'Mesh', count: Math.floor(totalCount * 0.3) },
          { value: 'leather', label: 'Leather', count: Math.floor(totalCount * 0.25) },
          { value: 'synthetic', label: 'Synthetic', count: Math.floor(totalCount * 0.2) },
          { value: 'knit', label: 'Knit', count: Math.floor(totalCount * 0.15) },
          { value: 'canvas', label: 'Canvas', count: Math.floor(totalCount * 0.1) }
        ]
      case 'collection':
        return [
          { value: 'adicolor', label: 'adicolor', count: Math.floor(totalCount * 0.2) },
          { value: 'ultraboost', label: 'Ultraboost', count: Math.floor(totalCount * 0.15) },
          { value: 'samba', label: 'Samba', count: Math.floor(totalCount * 0.15) },
          { value: 'superstar', label: 'Superstar', count: Math.floor(totalCount * 0.15) },
          { value: 'gazelle', label: 'Gazelle', count: Math.floor(totalCount * 0.15) },
          { value: 'terrex', label: 'TERREX', count: Math.floor(totalCount * 0.1) },
          { value: 'y-3', label: 'Y-3', count: Math.floor(totalCount * 0.1) }
        ]
      case 'size':
        return [
          '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5',
          '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5'
        ].map(size => ({ value: size, label: size }))
      case 'color':
        return [
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' },
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'gray', label: 'Gray' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'orange', label: 'Orange' },
          { value: 'purple', label: 'Purple' },
          { value: 'pink', label: 'Pink' }
        ]
      default:
        return []
    }
  }

  const priceRanges = [
    { min: 0, max: 50, label: 'Under $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 150, label: '$100 - $150' },
    { min: 150, max: 200, label: '$150 - $200' },
    { min: 200, max: 300, label: '$200 - $300' },
    { min: 300, max: 500, label: 'Over $300' }
  ]

  return (
    <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Filter Bar Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Filters
            </h3>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="bg-black text-white dark:bg-white dark:text-black">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <BaseButton
              variant="ghost"
              onClick={onClearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Clear all
            </BaseButton>
          )}
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-4 pb-4">
          {/* Gender Filter - Only show if not already filtered by slug */}
          {!slugFilters.gender && (
            <FilterDropdown
              title="Gender"
              expanded={expandedFilters.gender}
              onToggle={() => toggleFilter('gender')}
              options={getFilterOptions('gender')}
              selectedValues={filters.gender || []}
              onValueChange={(value, checked) => handleFilterChange('gender', value, checked)}
              onClear={() => clearFilter('gender')}
            />
          )}

          {/* Category Filter - Only show if not already filtered by slug */}
          {!slugFilters.category && (
            <FilterDropdown
              title="Category"
              expanded={expandedFilters.category}
              onToggle={() => toggleFilter('category')}
              options={getFilterOptions('category')}
              selectedValues={filters.category || []}
              onValueChange={(value, checked) => handleFilterChange('category', value, checked)}
              onClear={() => clearFilter('category')}
            />
          )}

          {/* Sport Filter - Only show if not already filtered by slug */}
          {!slugFilters.sport && (
            <FilterDropdown
              title="Sport"
              expanded={expandedFilters.sport}
              onToggle={() => toggleFilter('sport')}
              options={getFilterOptions('sport')}
              selectedValues={filters.sport || []}
              onValueChange={(value, checked) => handleFilterChange('sport', value, checked)}
              onClear={() => clearFilter('sport')}
            />
          )}

          {/* Brand Filter */}
          <FilterDropdown
            title="Brand"
            expanded={expandedFilters.brand}
            onToggle={() => toggleFilter('brand')}
            options={getFilterOptions('brand')}
            selectedValues={filters.brand || []}
            onValueChange={(value, checked) => handleFilterChange('brand', value, checked)}
            onClear={() => clearFilter('brand')}
          />

          {/* Material Filter */}
          <FilterDropdown
            title="Material"
            expanded={expandedFilters.material}
            onToggle={() => toggleFilter('material')}
            options={getFilterOptions('material')}
            selectedValues={filters.material || []}
            onValueChange={(value, checked) => handleFilterChange('material', value, checked)}
            onClear={() => clearFilter('material')}
          />

          {/* Collection Filter - Only show if not already filtered by slug */}
          {!slugFilters.collection && (
            <FilterDropdown
              title="Collection"
              expanded={expandedFilters.collection}
              onToggle={() => toggleFilter('collection')}
              options={getFilterOptions('collection')}
              selectedValues={filters.collection || []}
              onValueChange={(value, checked) => handleFilterChange('collection', value, checked)}
              onClear={() => clearFilter('collection')}
            />
          )}

          {/* Price Range Filter - Only show if not already filtered by slug */}
          {!slugFilters.max_price && (
            <FilterDropdown
              title="Price"
              expanded={expandedFilters?.price}
              onToggle={() => toggleFilter('price')}
              customContent={
                <div className="p-4 space-y-3">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.min_price === range.min && filters.max_price === range.max}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onFilterChange({
                              ...filters,
                              min_price: range.min,
                              max_price: range.max
                            })
                          } else {
                            const newFilters = { ...filters }
                            delete newFilters.min_price
                            delete newFilters.max_price
                            onFilterChange(newFilters)
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              }
              onClear={() => {
                const newFilters = { ...filters }
                delete newFilters.min_price
                delete newFilters.max_price
                onFilterChange(newFilters)
              }}
            />
          )}

          {/* Size Filter */}
          <FilterDropdown
            title="Size"
            expanded={expandedFilters.size}
            onToggle={() => toggleFilter('size')}
            options={getFilterOptions('size')}
            selectedValues={filters.size || []}
            onValueChange={(value, checked) => handleFilterChange('size', value, checked)}
            onClear={() => clearFilter('size')}
            gridLayout
          />

          {/* Color Filter */}
          <FilterDropdown
            title="Color"
            expanded={expandedFilters.color}
            onToggle={() => toggleFilter('color')}
            options={getFilterOptions('color')}
            selectedValues={filters.color || []}
            onValueChange={(value, checked) => handleFilterChange('color', value, checked)}
            onClear={() => clearFilter('color')}
            colorLayout
          />
        </div>
      </div>
    </div>
  )
}

interface FilterDropdownProps {
  title: string
  expanded: boolean
  onToggle: () => void
  options?: FilterOption[]
  selectedValues?: string[]
  onValueChange?: (value: string, checked: boolean) => void
  onClear: () => void
  customContent?: React.ReactNode
  gridLayout?: boolean
  colorLayout?: boolean
}

function FilterDropdown({
  title,
  expanded,
  onToggle,
  options = [],
  selectedValues = [],
  onValueChange,
  onClear,
  customContent,
  gridLayout,
  colorLayout
}: FilterDropdownProps) {
  const hasSelectedValues = selectedValues.length > 0

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border rounded-none transition-colors",
          hasSelectedValues
            ? "border-black dark:border-white bg-black text-white dark:bg-white dark:text-black"
            : "border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white"
        )}
      >
        <span className="text-sm font-medium">{title}</span>
        {hasSelectedValues && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {selectedValues.length}
          </Badge>
        )}
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {expanded && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{title}</span>
              {hasSelectedValues && (
                <button
                  onClick={onClear}
                  className="text-xs text-gray-500 hover:text-black dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {customContent ? (
            customContent
          ) : (
            <div className="p-3">
              {gridLayout ? (
                <div className="grid grid-cols-4 gap-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onValueChange?.(option.value, !selectedValues.includes(option.value))}
                      className={cn(
                        "px-3 py-2 text-sm border rounded-none transition-colors",
                        selectedValues.includes(option.value)
                          ? "border-black dark:border-white bg-black text-white dark:bg-white dark:text-black"
                          : "border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : colorLayout ? (
                <div className="grid grid-cols-6 gap-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onValueChange?.(option.value, !selectedValues.includes(option.value))}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        selectedValues.includes(option.value)
                          ? "border-black dark:border-white scale-110"
                          : "border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white"
                      )}
                      style={{ backgroundColor: option.value }}
                      title={option.label}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {options.map((option) => (
                    <label key={option.value} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedValues.includes(option.value)}
                          onChange={(e) => onValueChange?.(option.value, e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{option.label}</span>
                      </div>
                      {option.count && (
                        <span className="text-xs text-gray-500">({option.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
