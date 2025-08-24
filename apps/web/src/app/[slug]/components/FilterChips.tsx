"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { parseSlugToFilters } from "@/utils/slug-parser"

interface FilterChipsProps {
  filters: Record<string, any>
  onRemoveFilter: (filterKey: string, value?: string) => void
  onClearAll: () => void
  className?: string
  slug: string
}

export default function FilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
  slug
}: FilterChipsProps) {
  // Get slug-based filters to determine which ones can be removed
  const slugFilters = parseSlugToFilters(slug)
  
  const getActiveFilters = () => {
    const active: Array<{ key: string; value: string; label: string; removable: boolean }> = []
    
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return
      
      if (Array.isArray(value)) {
        value.forEach(v => {
          // Check if this filter can be removed (not from slug)
          const slugValue = slugFilters[key as keyof typeof slugFilters]
          const isFromSlug = Array.isArray(slugValue) ? slugValue.includes(v) : slugValue === v
          const removable = !isFromSlug
          
          active.push({
            key,
            value: v,
            label: `${getFilterLabel(key)}: ${getValueLabel(key, v)}`,
            removable
          })
        })
      } else if (typeof value === 'string' || typeof value === 'number') {
        // Check if this filter can be removed (not from slug)
        const slugValue = slugFilters[key as keyof typeof slugFilters]
        const isFromSlug = Array.isArray(slugValue) ? slugValue.includes(String(value)) : slugValue === value
        const removable = !isFromSlug
        
        active.push({
          key,
          value: String(value),
          label: `${getFilterLabel(key)}: ${getValueLabel(key, String(value))}`,
          removable
        })
      }
    })
    
    return active
  }

  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      gender: 'Gender',
      category: 'Category',
      sport: 'Sport',
      size: 'Size',
      color: 'Color',
      min_price: 'Min Price',
      max_price: 'Max Price',
      brand: 'Brand',
      material: 'Material',
      collection: 'Collection',
      product_type: 'Product Type',
      activity: 'Activity',
      franchise: 'Franchise'
    }
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  const getValueLabel = (key: string, value: string): string => {
    if (key === 'min_price' || key === 'max_price') {
      return `$${value}`
    }
    
    // Special handling for product types
    if (key === 'product_type') {
      const typeLabels: Record<string, string> = {
        't-shirts': 'T-Shirts',
        't-shirts_tops': 'T-Shirts & Tops',
        'hoodies_sweatshirts': 'Hoodies & Sweatshirts',
        'jackets_coats': 'Jackets & Coats',
        'dresses_skirts': 'Dresses & Skirts',
        'tights_leggings': 'Tights & Leggings',
        'slip-on_straps': 'Slip-On & Straps',
        'slides_sandals': 'Slides & Sandals',
        'platform_shoes': 'Platform Shoes',
        'workout_gym': 'Workout & Gym'
      }
      return typeLabels[value] || value.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    
    // Special handling for activities
    if (key === 'activity') {
      const activityLabels: Record<string, string> = {
        'new_arrivals': 'New Arrivals',
        'best_sellers': 'Best Sellers',
        'back_to_school': 'Back to School',
        'youth_teens': 'Youth & Teens',
        'children': 'Children',
        'babies_toddlers': 'Babies & Toddlers'
      }
      return activityLabels[value] || value.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    
    // Capitalize first letter and replace underscores with spaces
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const activeFilters = getActiveFilters()
  
  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className={cn("bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800", className)}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {activeFilters.map((filter) => (
              <Badge
                key={`${filter.key}-${filter.value}`}
                variant="secondary"
                className={cn(
                  "bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200",
                  filter.removable 
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" 
                    : "opacity-75 cursor-default"
                )}
              >
                <span className="text-sm">{filter.label}</span>
                {filter.removable && (
                  <button
                    onClick={() => onRemoveFilter(filter.key, filter.value)}
                    className="ml-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          
          <button
            onClick={onClearAll}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  )
}
