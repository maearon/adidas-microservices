import type { FacetOption } from "@/types/product/filters"

export type FilterSectionKey =
  | "sort"
  | "shipping"
  | "gender"
  | "age"
  | "size"
  | "category"
  | "color"
  | "best_for"
  | "sport"
  | "activity"
  | "collection"
  | "features"
  | "brand"
  | "surface"
  | "width"
  | "price"

export type FilterPreset = "plp" | "search"

export const SORT_OPTIONS = [
  { value: "price_low_high", label: "Price (low - high)" },
  { value: "newest", label: "Newest" },
  { value: "top_sellers", label: "Top Sellers" },
  { value: "price_high_low", label: "Price (high - low)" },
] as const

export const DEFAULT_SIZE_OPTIONS = [
  "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
  "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5",
  "12", "12.5", "13", "13.5", "14", "14.5", "15", "16",
]

/** Mixed labels like Adidas search size grid */
export const SEARCH_SIZE_OPTIONS = [
  "2", "2T", "2XS", "3", "3T", "3XS", "4", "4T", "5", "5T",
  "6", "6T", "6X", "7", "7T", "8", "10", "12", "14", "16",
  "18", "20", "S", "M", "L", "XL", "2XL", "3XL", "4XL",
]

export const DEFAULT_GENDER_OPTIONS: FacetOption[] = [
  { value: "Men", label: "Men", count: 0 },
  { value: "Women", label: "Women", count: 0 },
  { value: "Unisex", label: "Unisex", count: 0 },
  { value: "Kids", label: "Kids", count: 0 },
]

export const DEFAULT_CATEGORY_OPTIONS: FacetOption[] = [
  { value: "Clothing", label: "Clothing", count: 0 },
  { value: "Shoes", label: "Shoes", count: 0 },
  { value: "Accessories", label: "Accessories", count: 0 },
]

export const DEFAULT_COLOR_OPTIONS: FacetOption[] = [
  { value: "Black", label: "Black", count: 0, hex: "#000000" },
  { value: "White", label: "White", count: 0, hex: "#FFFFFF" },
  { value: "Grey", label: "Grey", count: 0, hex: "#808080" },
  { value: "Blue", label: "Blue", count: 0, hex: "#2563eb" },
  { value: "Red", label: "Red", count: 0, hex: "#dc2626" },
  { value: "Brown", label: "Brown", count: 0, hex: "#92400e" },
  { value: "Purple", label: "Purple", count: 0, hex: "#7c3aed" },
  { value: "Burgundy", label: "Burgundy", count: 0, hex: "#7f1d1d" },
  { value: "Green", label: "Green", count: 0, hex: "#16a34a" },
  { value: "Pink", label: "Pink", count: 0, hex: "#ec4899" },
  { value: "Beige", label: "Beige", count: 0, hex: "#d2b48c" },
  { value: "Yellow", label: "Yellow", count: 0, hex: "#eab308" },
  { value: "Multi", label: "Multi", count: 0, hex: "linear-gradient(135deg,#ef4444,#3b82f6,#22c55e)" },
  { value: "Orange", label: "Orange", count: 0, hex: "#ea580c" },
  { value: "Silver", label: "Silver", count: 0, hex: "#c0c0c0" },
  { value: "Multicolor", label: "Multicolor", count: 0, hex: "linear-gradient(135deg,#f59e0b,#a855f7,#06b6d4)" },
]

export const BEST_FOR_OPTIONS: FacetOption[] = [
  { value: "Race", label: "Race", count: 0 },
  { value: "Everyday", label: "Everyday", count: 0 },
  { value: "Walking", label: "Walking", count: 0 },
  { value: "Marathon", label: "Marathon", count: 0 },
  { value: "Rugged Terrain", label: "Rugged Terrain", count: 0 },
]

export const DEFAULT_COLLECTION_OPTIONS: FacetOption[] = [
  { value: "adicolor", label: "adicolor", count: 0 },
  { value: "Ultimate365", label: "Ultimate365", count: 0 },
  { value: "Racket Sports", label: "Racket Sports", count: 0 },
  { value: "Clima", label: "Clima", count: 0 },
  { value: "ALL SZN", label: "ALL SZN", count: 0 },
  { value: "Ballerina", label: "Ballerina", count: 0 },
  { value: "Tiro", label: "Tiro", count: 0 },
  { value: "Adibreak", label: "Adibreak", count: 0 },
  { value: "Firebird", label: "Firebird", count: 0 },
  { value: "Adi365", label: "Adi365", count: 0 },
  { value: "F50", label: "F50", count: 0 },
  { value: "Future Icons", label: "Future Icons", count: 0 },
  { value: "Hyperglam", label: "Hyperglam", count: 0 },
  { value: "RDY", label: "RDY", count: 0 },
  { value: "Y2K", label: "Y2K", count: 0 },
  { value: "ultraboost", label: "ultraboost", count: 0 },
  { value: "adizero", label: "adizero", count: 0 },
  { value: "samba", label: "samba", count: 0 },
  { value: "gazelle", label: "gazelle", count: 0 },
  { value: "superstar", label: "superstar", count: 0 },
  { value: "terrex", label: "terrex", count: 0 },
]

export const SURFACE_OPTIONS: FacetOption[] = [
  { value: "Road", label: "Road", count: 0 },
  { value: "Treadmill", label: "Treadmill", count: 0 },
  { value: "Trail", label: "Trail", count: 0 },
  { value: "Track", label: "Track", count: 0 },
]

export const WIDTH_OPTIONS: FacetOption[] = [
  { value: "Medium", label: "Medium", count: 0 },
  { value: "Wide", label: "Wide", count: 0 },
]

export const DEFAULT_SPORT_OPTIONS: FacetOption[] = [
  { value: "Lifestyle", label: "Lifestyle", count: 0 },
  { value: "Golf", label: "Golf", count: 0 },
  { value: "Tennis", label: "Tennis", count: 0 },
  { value: "Workout", label: "Workout", count: 0 },
  { value: "Weightlifting", label: "Weightlifting", count: 0 },
  { value: "Running", label: "Running", count: 0 },
  { value: "Soccer", label: "Soccer", count: 0 },
  { value: "Dance", label: "Dance", count: 0 },
  { value: "HIIT", label: "HIIT", count: 0 },
  { value: "Motorsport", label: "Motorsport", count: 0 },
  { value: "Football", label: "Football", count: 0 },
  { value: "Hiking", label: "Hiking", count: 0 },
  { value: "Basketball", label: "Basketball", count: 0 },
  { value: "Baseball", label: "Baseball", count: 0 },
  { value: "Volleyball", label: "Volleyball", count: 0 },
  { value: "Cycling", label: "Cycling", count: 0 },
  { value: "Yoga", label: "Yoga", count: 0 },
  { value: "Swim", label: "Swim", count: 0 },
]

/** Age → stored as activity kids ranges until dedicated column exists */
export const AGE_OPTIONS: FacetOption[] = [
  { value: "youth_teens", label: "Youth (Age 8 - 16)", count: 0 },
  { value: "children", label: "Children (Age 4 - 8)", count: 0 },
  { value: "babies_toddlers", label: "Babies & Toddlers (Age 0 - 4)", count: 0 },
]

export const DEFAULT_ACTIVITY_OPTIONS: FacetOption[] = [
  { value: "Casual", label: "Casual", count: 0 },
  { value: "Athletic", label: "Athletic", count: 0 },
  { value: "Outdoor", label: "Outdoor", count: 0 },
  { value: "Indoor", label: "Indoor", count: 0 },
  { value: "Gym", label: "Gym", count: 0 },
  { value: "Training", label: "Training", count: 0 },
]

/** Stub feature tags */
export const FEATURES_OPTIONS: FacetOption[] = [
  { value: "Quick Dry", label: "Quick Dry", count: 0 },
  { value: "Moisture Wicking", label: "Moisture Wicking", count: 0 },
  { value: "Stretch", label: "Stretch", count: 0 },
  { value: "Lightweight", label: "Lightweight", count: 0 },
  { value: "Breathable", label: "Breathable", count: 0 },
]

export const DEFAULT_BRAND_OPTIONS: FacetOption[] = [
  { value: "Originals", label: "Originals", count: 0 },
  { value: "Performance", label: "Performance", count: 0 },
  { value: "Sportswear", label: "Sportswear", count: 0 },
  { value: "Y-3", label: "Y-3", count: 0 },
  { value: "adidas by Stella McCartney", label: "adidas by Stella McCartney", count: 0 },
]

/** PLP / category listing */
export const PLP_SECTION_ORDER: FilterSectionKey[] = [
  "sort",
  "shipping",
  "size",
  "gender",
  "category",
  "color",
  "best_for",
  "collection",
  "surface",
  "width",
  "price",
  "sport",
]

/** Search results — from Adidas search screenshots */
export const SEARCH_SECTION_ORDER: FilterSectionKey[] = [
  "sort",
  "shipping",
  "gender",
  "age",
  "size",
  "color",
  "sport",
  "activity",
  "collection",
  "features",
  "brand",
  "price",
]

export const DEFAULT_EXPANDED: Record<FilterPreset, Partial<Record<FilterSectionKey, boolean>>> = {
  plp: { sort: true, shipping: true },
  search: { sort: true, shipping: true },
}

export function getSectionOrder(preset: FilterPreset): FilterSectionKey[] {
  return preset === "search" ? SEARCH_SECTION_ORDER : PLP_SECTION_ORDER
}

export function mergeFacetOptions(
  defaults: FacetOption[],
  fromApi?: FacetOption[] | null
): FacetOption[] {
  if (!fromApi?.length) return defaults.map((d) => ({ ...d }))

  const byLower = new Map(
    fromApi.map((o) => [o.value.toLowerCase(), o] as const)
  )

  const merged = defaults.map((d) => {
    const hit = byLower.get(d.value.toLowerCase())
    if (!hit) return { ...d }
    byLower.delete(d.value.toLowerCase())
    return {
      ...d,
      value: hit.value,
      label: hit.label || d.label,
      count: hit.count,
      hex: hit.hex || d.hex,
    }
  })

  for (const remaining of byLower.values()) {
    merged.push({ ...remaining })
  }

  return merged
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (value === undefined || value === null || value === "") return []
  return [String(value)]
}

export const STUB_SECTIONS = new Set<FilterSectionKey>([
  "best_for",
  "surface",
  "width",
  "features",
  "age",
])
