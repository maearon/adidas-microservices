/** 📦 Product list query filters */
export interface ProductFilters {
  slug?: string
  q?: string
  cursor?: string
  gender?: string | string[]
  category?: string | string[]
  sport?: string | string[]
  activity?: string | string[]
  product_type?: string | string[]
  brand?: string | string[]
  material?: string | string[]
  collection?: string | string[]
  franchise?: string | string[]
  min_price?: number | string
  max_price?: number | string
  size?: string | string[]
  color?: string | string[]
  shipping?: string | string[]
  sort?: string
  /** Soft stubs — accepted by API, no DB columns yet */
  best_for?: string | string[]
  surface?: string | string[]
  width?: string | string[]
  page?: number
  per_page?: number
  limit?: number
}

export interface FacetOption {
  value: string
  label: string
  count: number
  hex?: string
}

export interface FilterOptionsResponse {
  gender: FacetOption[]
  category: FacetOption[]
  sport: FacetOption[]
  activity: FacetOption[]
  collection: FacetOption[]
  material: FacetOption[]
  brand: FacetOption[]
  colors: FacetOption[]
  sizes: FacetOption[]
  shipping: FacetOption[]
  best_for: FacetOption[]
  surface: FacetOption[]
  width: FacetOption[]
  features?: FacetOption[]
  age?: FacetOption[]
  price_range: { min: number; max: number }
  total_count: number
}

export interface ProductQueryParams {
  gender?: string | string[]
  category?: string | string[]
  price_min?: number
  price_max?: number
  cursor?: string
}
