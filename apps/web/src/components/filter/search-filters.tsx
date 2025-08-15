"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { SearchFilters as SearchFiltersType } from "@/types/search"
import { BaseButton } from "../ui/base-button"

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
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(currentFilters)
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    shipping: true,
    gender: false,
    category: false,
    activity: false,
    size: false,
    bestFor: false,
    sport: false,
    features: false,
    color: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearFilters = () => {
    const clearedFilters: SearchFiltersType = {
      query: currentFilters.query,
      page: 1,
      size: 20,
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]">
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-black text-black dark:text-white shadow-lg overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filter & Sort</h2>
            <BaseButton variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </BaseButton>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <BaseButton variant="ghost" onClick={() => toggleSection("sort")} className="flex justify-between items-center w-full mb-4">
              <h3 className="font-semibold">SORT BY</h3>
              {expandedSections.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </BaseButton>
            {expandedSections.sort && (
              <div className="space-y-3">
                {[
                  { value: "relevance", label: "RELEVANCE" },
                  { value: "price_low_high", label: "PRICE (LOW - HIGH)" },
                  { value: "newest", label: "NEWEST" },
                  { value: "top_sellers", label: "TOP SELLERS" },
                  { value: "price_high_low", label: "PRICE (HIGH - LOW)" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sort"
                      id={option.value}
                      checked={localFilters.sort === option.value}
                      onChange={() => handleFilterChange("sort", option.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={option.value} className="text-base cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping */}
          <div className="mb-6">
            <BaseButton variant="ghost" onClick={() => toggleSection("shipping")} className="flex justify-between items-center w-full mb-4">
              <h3 className="font-semibold">SHIPPING</h3>
              {expandedSections.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </BaseButton>
            {expandedSections.shipping && (
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-base">prime</span>
                <span className="text-base text-gray-600 dark:text-white">(20)</span>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="mb-6">
            <BaseButton variant="ghost" onClick={() => toggleSection("gender")} className="flex justify-between items-center w-full mb-4">
              <h3 className="font-semibold">GENDER</h3>
              {expandedSections.gender ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </BaseButton>
            {expandedSections.gender && (
              <div className="space-y-3">
                {["Men", "Women", "Kids"].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={gender}
                      checked={localFilters.gender === gender.toLowerCase()}
                      onCheckedChange={(checked) =>
                        handleFilterChange("gender", checked ? gender.toLowerCase() : undefined)
                      }
                    />
                    <label htmlFor={gender} className="text-base cursor-pointer">
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <BaseButton variant="ghost" onClick={() => toggleSection("category")} className="flex justify-between items-center w-full mb-4">
              <h3 className="font-semibold">CATEGORY</h3>
              {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </BaseButton>
            {expandedSections.category && (
              <div className="space-y-3">
                {["Shoes", "Clothing", "Accessories"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={localFilters.category === category.toLowerCase()}
                      onCheckedChange={(checked) =>
                        handleFilterChange("category", checked ? category.toLowerCase() : undefined)
                      }
                    />
                    <label htmlFor={category} className="text-base cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sport */}
          <div className="mb-6">
            <BaseButton variant="ghost" onClick={() => toggleSection("sport")} className="flex justify-between items-center w-full mb-4">
              <h3 className="font-semibold">SPORT</h3>
              {expandedSections.sport ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </BaseButton>
            {expandedSections.sport && (
              <div className="space-y-3">
                {["Running", "Training", "Lifestyle", "Soccer", "Basketball"].map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={sport}
                      checked={localFilters.sport === sport.toLowerCase()}
                      onCheckedChange={(checked) =>
                        handleFilterChange("sport", checked ? sport.toLowerCase() : undefined)
                      }
                    />
                    <label htmlFor={sport} className="text-base cursor-pointer">
                      {sport}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">PRICE RANGE</h3>
            <div className="px-2">
              <Slider
                value={[localFilters.min_price || 0, localFilters.max_price || 500]}
                onValueChange={([min, max]) => {
                  handleFilterChange("min_price", min)
                  handleFilterChange("max_price", max)
                }}
                max={500}
                step={10}
                className="mb-2"
              />
              <div className="flex justify-between text-base text-gray-600 dark:text-white">
                <span>${localFilters.min_price || 0}</span>
                <span>${localFilters.max_price || 500}</span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-6 border-t">
            <Button shadow={true} pressEffect={true} onClick={applyFilters} fullWidth={true} className="w-full bg-black text-white hover:bg-gray-800 mb-3">
              APPLY ({totalResults})
            </Button>
            <Button shadow={true} pressEffect={true} onClick={clearFilters} variant="outline" fullWidth={true} className="w-full">
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
