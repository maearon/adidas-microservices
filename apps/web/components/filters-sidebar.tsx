"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  slug: string
  currentFilters: any
}

export default function FiltersSidebar({ isOpen, onClose, onApplyFilters, slug, currentFilters }: FiltersSidebarProps) {
  const [filters, setFilters] = useState<any>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sort: true,
    shipping: false,
    gender: true,
    category: true,
    activity: true,
    product_type: true,
    size: true,
    best_for: false,
    sport: true,
    color: true,
    material: true,
    brand: true,
    price: true,
    model: false,
    collection: false,
  })
  const [priceRange, setPriceRange] = useState({ min: 65, max: 300 })

  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters)
    }
  }, [currentFilters])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setFilters((prev: any) => {
      const newFilters = { ...prev }

      if (!newFilters[filterType]) {
        newFilters[filterType] = []
      }

      if (checked) {
        if (!newFilters[filterType].includes(value)) {
          newFilters[filterType] = [...newFilters[filterType], value]
        }
      } else {
        newFilters[filterType] = newFilters[filterType].filter((v: string) => v !== value)
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType]
        }
      }

      return newFilters
    })
  }

  const handleSortChange = (sortValue: string) => {
    setFilters((prev: any) => ({
      ...prev,
      sort: sortValue,
    }))
  }

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }))
    setFilters((prev: any) => ({
      ...prev,
      min_price: type === "min" ? value : prev.min_price || priceRange.min,
      max_price: type === "max" ? value : prev.max_price || priceRange.max,
    }))
  }

  const applyFilters = () => {
    const finalFilters = {
      ...filters,
      min_price: priceRange.min,
      max_price: priceRange.max,
    }
    onApplyFilters(finalFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    setPriceRange({ min: 65, max: 300 })
    onApplyFilters({})
  }

  const getAppliedFiltersCount = () => {
    let count = 0
    Object.values(filters).forEach((value: any) => {
      if (Array.isArray(value)) {
        count += value.length
      } else if (value) {
        count += 1
      }
    })
    return count
  }

  if (!isOpen) return null

  const colorOptions = [
    { value: "black", label: "Black", hex: "#000000" },
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "gray", label: "Gray", hex: "#808080" },
    { value: "blue", label: "Blue", hex: "#0000FF" },
    { value: "red", label: "Red", hex: "#FF0000" },
    { value: "purple", label: "Purple", hex: "#800080" },
    { value: "pink", label: "Pink", hex: "#FFC0CB" },
    { value: "silver", label: "Silver", hex: "#C0C0C0" },
    { value: "green", label: "Green", hex: "#008000" },
    { value: "cyan", label: "Cyan", hex: "#00FFFF" },
    { value: "beige", label: "Beige", hex: "#F5F5DC" },
  ]

  const sizeOptions = [
    "4",
    "4.5",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "12.5",
    "13",
    "13.5",
    "14",
    "15",
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filter & Sort</h2>
            <div className="flex items-center space-x-2">
              <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Clear All
              </button>
              <button onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Applied Filters */}
        {getAppliedFiltersCount() > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-3">APPLIED FILTERS</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  return value.map((item) => (
                    <div key={`${key}-${item}`} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                      <span>{item}</span>
                      <button
                        onClick={() => handleFilterChange(key, item, false)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                } else if (typeof value === "string" && value) {
                  return (
                    <div key={key} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                      <span>{value}</span>
                      <button
                        onClick={() => setFilters((prev: any) => ({ ...prev, [key]: undefined }))}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* Filter Sections */}
        <div className="p-4 space-y-6">
          {/* Sort By */}
          <div>
            <button
              onClick={() => toggleSection("sort")}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>SORT BY</span>
              {expandedSections.sort ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.sort && (
              <div className="space-y-2">
                {["PRICE (LOW - HIGH)", "NEWEST", "TOP SELLERS", "PRICE (HIGH - LOW)"].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option}
                      checked={filters.sort === option}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Gender */}
          <div>
            <button
              onClick={() => toggleSection("gender")}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>GENDER</span>
              {expandedSections.gender ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.gender && (
              <div className="space-y-2">
                {[
                  { value: "women", label: "Women", count: 128 },
                  { value: "men", label: "Men", count: 126 },
                  { value: "unisex", label: "Unisex", count: 116 },
                  { value: "kids", label: "Kids", count: 58 },
                ].map((option) => (
                  <label key={option.value} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={(filters.gender || []).includes(option.value)}
                        onCheckedChange={(checked) => handleFilterChange("gender", option.value, checked as boolean)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size */}
          <div>
            <button
              onClick={() => toggleSection("size")}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>SIZE</span>
              {expandedSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.size && (
              <div className="grid grid-cols-5 gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange("size", size, !(filters.size || []).includes(size))}
                    className={`p-2 text-sm border rounded transition-colors ${
                      (filters.size || []).includes(size)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <button
              onClick={() => toggleSection("color")}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>COLOR</span>
              {expandedSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.color && (
              <div className="grid grid-cols-8 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      handleFilterChange("color", color.value, !(filters.color || []).includes(color.value))
                    }
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      (filters.color || []).includes(color.value)
                        ? "border-black scale-110"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <button
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <span>PRICE</span>
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600">
                  ${priceRange.min} – ${priceRange.max}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange("min", Number.parseInt(e.target.value) || 65)}
                        className="pl-6"
                        min={65}
                        max={300}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange("max", Number.parseInt(e.target.value) || 300)}
                        className="pl-6"
                        min={65}
                        max={300}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Button
            pressEffect={true}
            fullWidth={false}
            onClick={applyFilters}
            className="w-full bg-black text-white hover:bg-gray-800 py-3 text-sm font-medium"
          >
            APPLY ({getAppliedFiltersCount()})
          </Button>
        </div>
      </div>
    </div>
  )
}
