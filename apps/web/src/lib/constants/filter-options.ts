import type { FacetOption } from "@/types/product/filters"

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
  { value: "Green", label: "Green", count: 0, hex: "#16a34a" },
  { value: "Beige", label: "Beige", count: 0, hex: "#d2b48c" },
  { value: "Yellow", label: "Yellow", count: 0, hex: "#eab308" },
  { value: "Brown", label: "Brown", count: 0, hex: "#92400e" },
  { value: "Silver", label: "Silver", count: 0, hex: "#c0c0c0" },
  { value: "Purple", label: "Purple", count: 0, hex: "#7c3aed" },
  { value: "Orange", label: "Orange", count: 0, hex: "#ea580c" },
  { value: "Pink", label: "Pink", count: 0, hex: "#ec4899" },
  { value: "Turquoise", label: "Turquoise", count: 0, hex: "#14b8a6" },
]

/** Stub until DB column exists */
export const BEST_FOR_OPTIONS: FacetOption[] = [
  { value: "Race", label: "Race", count: 0 },
  { value: "Everyday", label: "Everyday", count: 0 },
  { value: "Walking", label: "Walking", count: 0 },
  { value: "Marathon", label: "Marathon", count: 0 },
  { value: "Rugged Terrain", label: "Rugged Terrain", count: 0 },
]

export const DEFAULT_COLLECTION_OPTIONS: FacetOption[] = [
  { value: "Zenboost", label: "Zenboost", count: 0 },
  { value: "adizero", label: "adizero", count: 0 },
  { value: "RunFalcon", label: "RunFalcon", count: 0 },
  { value: "Supernova", label: "Supernova", count: 0 },
  { value: "Hyperboost", label: "Hyperboost", count: 0 },
  { value: "Duramo", label: "Duramo", count: 0 },
  { value: "ultraboost", label: "ultraboost", count: 0 },
  { value: "samba", label: "samba", count: 0 },
  { value: "gazelle", label: "gazelle", count: 0 },
  { value: "superstar", label: "superstar", count: 0 },
  { value: "adicolor", label: "adicolor", count: 0 },
  { value: "terrex", label: "terrex", count: 0 },
]

/** Stub until DB column exists */
export const SURFACE_OPTIONS: FacetOption[] = [
  { value: "Road", label: "Road", count: 0 },
  { value: "Treadmill", label: "Treadmill", count: 0 },
  { value: "Trail", label: "Trail", count: 0 },
  { value: "Track", label: "Track", count: 0 },
]

/** Stub until DB column exists */
export const WIDTH_OPTIONS: FacetOption[] = [
  { value: "Medium", label: "Medium", count: 0 },
  { value: "Wide", label: "Wide", count: 0 },
]

export const DEFAULT_SPORT_OPTIONS: FacetOption[] = [
  { value: "Running", label: "Running", count: 0 },
  { value: "Soccer", label: "Soccer", count: 0 },
  { value: "Golf", label: "Golf", count: 0 },
  { value: "Football", label: "Football", count: 0 },
  { value: "Hiking", label: "Hiking", count: 0 },
  { value: "Basketball", label: "Basketball", count: 0 },
  { value: "Weightlifting", label: "Weightlifting", count: 0 },
  { value: "Workout", label: "Workout", count: 0 },
  { value: "Cycling", label: "Cycling", count: 0 },
  { value: "Tennis", label: "Tennis", count: 0 },
  { value: "Baseball", label: "Baseball", count: 0 },
  { value: "Volleyball", label: "Volleyball", count: 0 },
  { value: "Trail Running", label: "Trail Running", count: 0 },
  { value: "Lifestyle", label: "Lifestyle", count: 0 },
  { value: "Motorsport", label: "Motorsport", count: 0 },
  { value: "Softball", label: "Softball", count: 0 },
  { value: "Climbing", label: "Climbing", count: 0 },
  { value: "Mountain Biking", label: "Mountain Biking", count: 0 },
  { value: "Track & Field", label: "Track & Field", count: 0 },
  { value: "Boxing", label: "Boxing", count: 0 },
  { value: "Cricket", label: "Cricket", count: 0 },
  { value: "HIIT", label: "HIIT", count: 0 },
  { value: "Swim", label: "Swim", count: 0 },
  { value: "Yoga", label: "Yoga", count: 0 },
  { value: "Rugby", label: "Rugby", count: 0 },
  { value: "Futsal", label: "Futsal", count: 0 },
  { value: "Skateboarding", label: "Skateboarding", count: 0 },
]

export const FILTER_SECTION_ORDER = [
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
] as const

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

export function normalizeFilterValue(value: string): string {
  return value.trim()
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (value === undefined || value === null || value === "") return []
  return [String(value)]
}
