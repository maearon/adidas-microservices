"use client"

import { useEffect, useMemo, useState } from "react"
import { X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { FacetOption, FilterOptionsResponse } from "@/types/product/filters"
import {
  type FilterPreset,
  type FilterSectionKey,
  SORT_OPTIONS,
  DEFAULT_SIZE_OPTIONS,
  SEARCH_SIZE_OPTIONS,
  DEFAULT_GENDER_OPTIONS,
  DEFAULT_CATEGORY_OPTIONS,
  DEFAULT_COLOR_OPTIONS,
  BEST_FOR_OPTIONS,
  DEFAULT_COLLECTION_OPTIONS,
  SURFACE_OPTIONS,
  WIDTH_OPTIONS,
  DEFAULT_SPORT_OPTIONS,
  AGE_OPTIONS,
  DEFAULT_ACTIVITY_OPTIONS,
  FEATURES_OPTIONS,
  DEFAULT_BRAND_OPTIONS,
  getSectionOrder,
  DEFAULT_EXPANDED,
  STUB_SECTIONS,
  mergeFacetOptions,
  asStringArray,
} from "@/lib/constants/filter-options"
import { cn } from "@/lib/utils"

export type FilterState = Record<string, string | number | string[] | undefined>

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  currentFilters: FilterState
  totalCount?: number
  facets?: FilterOptionsResponse | null
  /** PLP vs Search facet config — same drawer shell, different section order */
  preset?: FilterPreset
  showClearAll?: boolean
}

const CHIP_FIELDS = [
  "gender",
  "category",
  "sport",
  "size",
  "color",
  "collection",
  "shipping",
  "best_for",
  "surface",
  "width",
  "activity",
  "age",
  "features",
  "brand",
] as const

const SECTION_TITLES: Record<FilterSectionKey, string> = {
  sort: "Sort by",
  shipping: "Shipping",
  gender: "Gender",
  age: "Age",
  size: "Size",
  category: "Category",
  color: "Color",
  best_for: "Best For",
  sport: "Sport",
  activity: "Activity",
  collection: "Collection",
  features: "Features",
  brand: "Brand",
  surface: "Surface",
  width: "Width",
  price: "Price",
}

function buildExpandedState(preset: FilterPreset): Record<FilterSectionKey, boolean> {
  const order = getSectionOrder(preset)
  const defaults = DEFAULT_EXPANDED[preset]
  const state = {} as Record<FilterSectionKey, boolean>
  for (const key of order) {
    state[key] = Boolean(defaults[key])
  }
  return state
}

export default function FiltersSidebar({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  totalCount = 0,
  facets = null,
  preset = "plp",
  showClearAll = true,
}: FiltersSidebarProps) {
  const sectionOrder = useMemo(() => getSectionOrder(preset), [preset])
  const [filters, setFilters] = useState<FilterState>({})
  const [expanded, setExpanded] = useState<Record<FilterSectionKey, boolean>>(() =>
    buildExpandedState(preset)
  )
  const [mounted, setMounted] = useState(false)

  const priceBounds = facets?.price_range ?? { min: 0, max: 500 }
  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceBounds.min,
    priceBounds.max,
  ])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    setExpanded(buildExpandedState(preset))
  }, [preset])

  useEffect(() => {
    if (!currentFilters) return
    setFilters(currentFilters)
    const min = Number(currentFilters.min_price ?? priceBounds.min)
    const max = Number(currentFilters.max_price ?? priceBounds.max)
    setPriceRange([
      Number.isFinite(min) ? min : priceBounds.min,
      Number.isFinite(max) ? max : priceBounds.max,
    ])
  }, [currentFilters, priceBounds.min, priceBounds.max])

  const genders = useMemo(
    () => mergeFacetOptions(DEFAULT_GENDER_OPTIONS, facets?.gender),
    [facets]
  )
  const categories = useMemo(
    () => mergeFacetOptions(DEFAULT_CATEGORY_OPTIONS, facets?.category),
    [facets]
  )
  const colors = useMemo(
    () => mergeFacetOptions(DEFAULT_COLOR_OPTIONS, facets?.colors),
    [facets]
  )
  const collections = useMemo(
    () => mergeFacetOptions(DEFAULT_COLLECTION_OPTIONS, facets?.collection),
    [facets]
  )
  const sports = useMemo(
    () => mergeFacetOptions(DEFAULT_SPORT_OPTIONS, facets?.sport),
    [facets]
  )
  const activities = useMemo(
    () => mergeFacetOptions(DEFAULT_ACTIVITY_OPTIONS, facets?.activity),
    [facets]
  )
  const brands = useMemo(
    () => mergeFacetOptions(DEFAULT_BRAND_OPTIONS, facets?.brand),
    [facets]
  )
  const bestFor = useMemo(
    () => mergeFacetOptions(BEST_FOR_OPTIONS, facets?.best_for),
    [facets]
  )
  const surfaces = useMemo(
    () => mergeFacetOptions(SURFACE_OPTIONS, facets?.surface),
    [facets]
  )
  const widths = useMemo(
    () => mergeFacetOptions(WIDTH_OPTIONS, facets?.width),
    [facets]
  )
  const ages = useMemo(() => mergeFacetOptions(AGE_OPTIONS, null), [])
  const features = useMemo(() => mergeFacetOptions(FEATURES_OPTIONS, null), [])
  const shipping = useMemo(
    () =>
      facets?.shipping?.length
        ? facets.shipping
        : [{ value: "prime", label: "PRIME", count: 0 }],
    [facets]
  )

  const sizeOptions = useMemo(() => {
    const base = preset === "search" ? SEARCH_SIZE_OPTIONS : DEFAULT_SIZE_OPTIONS
    if (facets?.sizes?.length) {
      const labels = facets.sizes.map((s) => s.label || s.value)
      return Array.from(new Set([...base, ...labels]))
    }
    return base
  }, [facets, preset])

  const liveCount = facets?.total_count ?? totalCount

  const toggleSection = (key: FilterSectionKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const sectionSelectedCount = (key: string) => asStringArray(filters[key]).length

  /** Age UI maps onto activity filter field for now */
  const fieldForSection = (section: FilterSectionKey): string => {
    if (section === "age") return "activity"
    return section
  }

  const handleMultiToggle = (field: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = asStringArray(prev[field])
      let next: string[]
      if (checked) {
        next = current.includes(value) ? current : [...current, value]
      } else {
        next = current.filter((v) => v.toLowerCase() !== value.toLowerCase())
      }
      const copy = { ...prev }
      if (next.length) copy[field] = next
      else delete copy[field]
      return copy
    })
  }

  const isSelected = (field: string, value: string) =>
    asStringArray(filters[field]).some((v) => v.toLowerCase() === value.toLowerCase())

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }))
  }

  const applyFilters = () => {
    onApplyFilters({
      ...filters,
      min_price: priceRange[0],
      max_price: priceRange[1],
    })
    onClose()
  }

  const clearAll = () => {
    setFilters({})
    setPriceRange([priceBounds.min, priceBounds.max])
    onApplyFilters({})
    onClose()
  }

  const removeChip = (field: string, value?: string) => {
    if (field === "sort") {
      setFilters((prev) => {
        const copy = { ...prev }
        delete copy.sort
        return copy
      })
      return
    }
    if (value) handleMultiToggle(field, value, false)
    else {
      setFilters((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const appliedChips = useMemo(() => {
    const chips: { field: string; value: string; label: string }[] = []
    for (const field of CHIP_FIELDS) {
      for (const value of asStringArray(filters[field])) {
        const ageHit = AGE_OPTIONS.find((a) => a.value === value)
        chips.push({
          field,
          value,
          label:
            field === "shipping" && value.toLowerCase() === "prime"
              ? "PRIME"
              : ageHit?.label || value,
        })
      }
    }
    return chips
  }, [filters])

  const facetOptionsFor = (section: FilterSectionKey): FacetOption[] => {
    switch (section) {
      case "gender":
        return genders
      case "category":
        return categories
      case "sport":
        return sports
      case "activity":
        return activities
      case "collection":
        return collections
      case "brand":
        return brands
      case "best_for":
        return bestFor
      case "surface":
        return surfaces
      case "width":
        return widths
      case "age":
        return ages
      case "features":
        return features
      default:
        return []
    }
  }

  const renderSection = (section: FilterSectionKey) => {
    const open = Boolean(expanded[section])
    const title = SECTION_TITLES[section]

    if (section === "sort") {
      return (
        <Accordion key={section} title={title} open={open} onToggle={() => toggleSection(section)}>
          <div className="space-y-3 pb-2">
            {SORT_OPTIONS.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={String(filters.sort || "") === option.value}
                  onChange={() => handleSortChange(option.value)}
                  className="h-4 w-4 accent-black dark:accent-white"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </Accordion>
      )
    }

    if (section === "shipping") {
      return (
        <Accordion
          key={section}
          title={title}
          open={open}
          onToggle={() => toggleSection(section)}
          count={sectionSelectedCount("shipping")}
        >
          <div className="space-y-3 pb-2">
            {shipping.map((opt) => (
              <CheckboxRow
                key={opt.value}
                id={`shipping-${opt.value}`}
                label={<span className="font-bold tracking-wide text-blue-600">PRIME</span>}
                count={opt.count}
                checked={isSelected("shipping", opt.value)}
                onCheckedChange={(c) => handleMultiToggle("shipping", opt.value, c)}
              />
            ))}
          </div>
        </Accordion>
      )
    }

    if (section === "size") {
      const field = "size"
      return (
        <Accordion
          key={section}
          title={title}
          open={open}
          onToggle={() => toggleSection(section)}
          count={sectionSelectedCount(field)}
        >
          <div className="grid grid-cols-3 gap-2 pb-2">
            {sizeOptions.map((size) => {
              const active = isSelected(field, size)
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleMultiToggle(field, size, !active)}
                  className={cn(
                    "border px-2 py-2.5 text-sm transition-colors",
                    active
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-neutral-300 hover:border-black dark:border-neutral-700 dark:hover:border-white"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </Accordion>
      )
    }

    if (section === "color") {
      return (
        <Accordion
          key={section}
          title={title}
          open={open}
          onToggle={() => toggleSection(section)}
          count={sectionSelectedCount("color")}
        >
          <div className="space-y-1 pb-2">
            {colors.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center justify-between gap-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected("color", opt.value)}
                    onCheckedChange={(c) =>
                      handleMultiToggle("color", opt.value, Boolean(c))
                    }
                  />
                  <span className="text-sm">{opt.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">[{opt.count}]</span>
                  <span
                    className="h-4 w-4 border border-neutral-300"
                    style={
                      opt.hex?.startsWith("linear")
                        ? { backgroundImage: opt.hex }
                        : { backgroundColor: opt.hex || "#ccc" }
                    }
                    title={opt.label}
                  />
                </div>
              </label>
            ))}
          </div>
        </Accordion>
      )
    }

    if (section === "price") {
      return (
        <Accordion key={section} title={title} open={open} onToggle={() => toggleSection(section)}>
          <div className="space-y-4 pb-4">
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <Slider
              value={priceRange}
              min={priceBounds.min}
              max={Math.max(priceBounds.max, priceBounds.min + 1)}
              step={1}
              onValueChange={(v) => setPriceRange([v[0], v[1]])}
              className="py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Minimum (USD)</label>
                <Input
                  type="number"
                  value={priceRange[0]}
                  min={priceBounds.min}
                  max={priceRange[1]}
                  onChange={(e) => {
                    const n = Number(e.target.value)
                    if (!Number.isFinite(n)) return
                    setPriceRange([Math.min(n, priceRange[1]), priceRange[1]])
                  }}
                  className="rounded-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Maximum (USD)</label>
                <Input
                  type="number"
                  value={priceRange[1]}
                  min={priceRange[0]}
                  max={priceBounds.max}
                  onChange={(e) => {
                    const n = Number(e.target.value)
                    if (!Number.isFinite(n)) return
                    setPriceRange([priceRange[0], Math.max(n, priceRange[0])])
                  }}
                  className="rounded-none"
                />
              </div>
            </div>
          </div>
        </Accordion>
      )
    }

    const field = fieldForSection(section)
    const options = facetOptionsFor(section)
    return (
      <FacetList
        key={section}
        title={title}
        open={open}
        onToggle={() => toggleSection(section)}
        options={options}
        field={field}
        selectedCount={sectionSelectedCount(field)}
        isSelected={isSelected}
        onToggleValue={handleMultiToggle}
        stubHint={STUB_SECTIONS.has(section)}
      />
    )
  }

  if (!isOpen || !mounted) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white text-black shadow-xl dark:bg-black dark:text-white">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-black">
          <h2 className="text-base font-bold uppercase tracking-wide">Filter & Sort</h2>
          <div className="flex items-center gap-4">
            {showClearAll && (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm underline underline-offset-2 hover:opacity-70"
              >
                Clear all
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {appliedChips.length > 0 && (
          <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
              Applied filters
            </p>
            <div className="flex flex-wrap gap-2">
              {appliedChips.map((chip) => (
                <button
                  key={`${chip.field}-${chip.value}`}
                  type="button"
                  onClick={() => removeChip(chip.field, chip.value)}
                  className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-2.5 py-1 text-sm dark:border-neutral-700 dark:bg-black"
                >
                  <span>{chip.label}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-28">
          {sectionOrder.map((section) => renderSection(section))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-black">
          <p className="mb-3 text-center text-sm text-neutral-600 dark:text-neutral-400">
            {liveCount} items found
          </p>
          <button
            type="button"
            onClick={applyFilters}
            className="flex w-full items-center justify-between bg-black px-4 py-3.5 text-sm font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <span>Show items</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  )
}

function Accordion({
  title,
  open,
  onToggle,
  count,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  count?: number
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-bold">
          {title}
          {count && count > 0 ? ` (${count})` : ""}
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && children}
    </div>
  )
}

function CheckboxRow({
  id,
  label,
  count,
  checked,
  onCheckedChange,
}: {
  id: string
  label: React.ReactNode
  count: number
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <div className="flex items-center gap-3">
        <Checkbox id={id} checked={checked} onCheckedChange={(c) => onCheckedChange(Boolean(c))} />
        <span className={cn("text-sm", checked && "font-bold")}>{label}</span>
      </div>
      <span className="text-sm text-neutral-500">[{count}]</span>
    </label>
  )
}

function FacetList({
  title,
  open,
  onToggle,
  options,
  field,
  selectedCount,
  isSelected,
  onToggleValue,
  stubHint,
}: {
  title: string
  open: boolean
  onToggle: () => void
  options: FacetOption[]
  field: string
  selectedCount: number
  isSelected: (field: string, value: string) => boolean
  onToggleValue: (field: string, value: string, checked: boolean) => void
  stubHint?: boolean
}) {
  return (
    <Accordion title={title} open={open} onToggle={onToggle} count={selectedCount}>
      <div className="space-y-1 pb-2">
        {stubHint && options.every((o) => o.count === 0) && (
          <p className="mb-2 text-xs text-neutral-400">
            Options shown for UI parity — data wiring comes with schema update.
          </p>
        )}
        {options.map((opt) => (
          <CheckboxRow
            key={opt.value}
            id={`${field}-${opt.value}`}
            label={opt.label}
            count={opt.count}
            checked={isSelected(field, opt.value)}
            onCheckedChange={(c) => onToggleValue(field, opt.value, c)}
          />
        ))}
      </div>
    </Accordion>
  )
}
