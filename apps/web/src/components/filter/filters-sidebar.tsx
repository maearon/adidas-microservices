"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: Record<string, string[] | string | number>) => void
  currentFilters: Record<string, string[] | string | number>
}

type FiltersState = Record<string, string | number | string[] | undefined>
type Filters = Record<string, string[] | string | number | undefined>

export default function FiltersSidebar({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: FiltersSidebarProps) {
  const [filters, setFilters] = useState<FiltersState>({})
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
    setFilters((prev: FiltersState) => {
      const newFilters = { ...prev }

      if (!newFilters[filterType]) {
        newFilters[filterType] = []
      }

      if (checked) {
        const currentValues = Array.isArray(newFilters[filterType])
          ? (newFilters[filterType] as string[])
          : []

        if (!currentValues.includes(value)) {
          newFilters[filterType] = [...currentValues, value]
        }
      } else {
        const currentValues = Array.isArray(newFilters[filterType])
          ? (newFilters[filterType] as string[])
          : []

        const updatedValues = currentValues.filter((v) => v !== value)

        if (updatedValues.length > 0) {
          newFilters[filterType] = updatedValues
        } else {
          delete newFilters[filterType]
        }
      }

      return newFilters
    })
  }

  const handleSortChange = (sortValue: string) => {
    setFilters((prev: FiltersState) => ({
      ...prev,
      sort: sortValue,
    }))
  }

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }))
    setFilters((prev: FiltersState) => ({
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
    Object.values(filters).forEach((value: unknown) => {
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
    "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
    "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5",
    "12", "12.5", "13", "13.5", "14", "15",
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-black text-black dark:text-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filter & Sort</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="text-base text-gray-500 hover:text-gray-700 underline"
              >
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
            <h3 className="text-base font-medium mb-3">APPLIED FILTERS</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  return value.map((item) => (
                    <div
                      key={`${key}-${item}`}
                      className="flex items-center bg-gray-100 rounded px-2 py-1 text-base"
                    >
                      <span className="bg-white dark:bg-black text-black dark:text-white">{item}</span>
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
                    <div
                      key={key}
                      className="flex items-center bg-gray-100 rounded px-2 py-1 text-base"
                    >
                      <span className="bg-white dark:bg-black text-black dark:text-white">{value}</span>
                      <button
                        onClick={() => setFilters((prev: Filters) => ({ ...prev, [key]: undefined }))}
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
          <FilterSection
            title="SORT BY"
            expanded={expandedSections.sort}
            onToggle={() => toggleSection("sort")}
          >
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
                <span className="text-base">{option}</span>
              </label>
            ))}
          </FilterSection>

          {/* Gender */}
          <FilterSection
            title="GENDER"
            expanded={expandedSections.gender}
            onToggle={() => toggleSection("gender")}
          >
            {[
              { value: "women", label: "Women", count: 128 },
              { value: "men", label: "Men", count: 126 },
              { value: "unisex", label: "Unisex", count: 116 },
              { value: "kids", label: "Kids", count: 58 },
            ].map((option) => (
              <label key={option.value} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={(Array.isArray(filters.gender) ? filters.gender : []).includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleFilterChange("gender", option.value, checked as boolean)
                    }
                  />
                  <span className="text-base">{option.label}</span>
                </div>
                <span className="text-xs text-gray-500">({option.count})</span>
              </label>
            ))}
          </FilterSection>

          {/* Size */}
          <FilterSection
            title="SIZE"
            expanded={expandedSections.size}
            onToggle={() => toggleSection("size")}
          >
            <div className="grid grid-cols-5 gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    handleFilterChange(
                      "size",
                      size,
                      !(Array.isArray(filters.size) ? filters.size : []).includes(size)
                    )
                  }
                  className={`p-2 text-base border rounded transition-colors ${
                    (Array.isArray(filters.size) ? filters.size : []).includes(size)
                      ? "border-border bg-black text-white"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection
            title="COLOR"
            expanded={expandedSections.color}
            onToggle={() => toggleSection("color")}
          >
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    handleFilterChange(
                      "color",
                      color.value,
                      !(Array.isArray(filters.color) ? filters.color : []).includes(color.value)
                    )
                  }
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    (Array.isArray(filters.color) ? filters.color : []).includes(color.value)
                      ? "border-border scale-110"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                />
              ))}
            </div>
          </FilterSection>

          {/* Price */}
          <FilterSection
            title="PRICE"
            expanded={expandedSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="space-y-4">
              <div className="text-center text-base text-gray-600 dark:text-white">
                ${priceRange.min} – ${priceRange.max}
              </div>
              <div className="flex gap-2">
                <PriceInput
                  label="Minimum"
                  value={priceRange.min}
                  onChange={(v) => handlePriceChange("min", v)}
                />
                <PriceInput
                  label="Maximum"
                  value={priceRange.max}
                  onChange={(v) => handlePriceChange("max", v)}
                />
              </div>
            </div>
          </FilterSection>
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-background border-t border-gray-200 p-4">
          <Button
            pressEffect={true}
            onClick={applyFilters}
            className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-medium"
          >
            APPLY ({getAppliedFiltersCount()})
          </Button>
        </div>
      </div>
    </div>
  )
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium mb-3"
      >
        <span>{title}</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && <div className="space-y-2">{children}</div>}
    </div>
  )
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex-1">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number.parseInt(e.target.value) || value)}
          className="pl-6"
          min={65}
          max={300}
        />
      </div>
    </div>
  )
}
