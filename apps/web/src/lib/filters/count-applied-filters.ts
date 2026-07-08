import { asStringArray } from "@/lib/constants/filter-options"

const SKIP_KEYS = new Set([
  "sort",
  "slug",
  "page",
  "query",
  "q",
  "cursor",
  "limit",
  "per_page",
  "include_facets",
])

/** Count Adidas-style applied filter selections (each value = 1). Sort excluded. */
export function countAppliedFilters(
  filters: Record<string, unknown> | null | undefined
): number {
  if (!filters) return 0

  let count = 0
  let priceCounted = false

  for (const [key, value] of Object.entries(filters)) {
    if (SKIP_KEYS.has(key) || value === undefined || value === null || value === "") {
      continue
    }

    if (key === "min_price" || key === "max_price") {
      if (!priceCounted) {
        count += 1
        priceCounted = true
      }
      continue
    }

    if (Array.isArray(value)) {
      count += value.length
    } else {
      count += asStringArray(value).length || 1
    }
  }

  return count
}
