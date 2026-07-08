import { Product } from "../product/product"

/** 🔍 Query filters used in product search / filter sidebar */
export interface SearchFilters {
  query?: string
  category?: string | string[]
  brand?: string | string[]
  gender?: string | string[]
  sport?: string | string[]
  activity?: string | string[]
  collection?: string | string[]
  color?: string | string[]
  shipping?: string | string[]
  best_for?: string | string[]
  surface?: string | string[]
  width?: string | string[]
  min_price?: number
  max_price?: number
  /** Shoe size labels (e.g. "10", "10.5") — not page size */
  size?: string | string[]
  page?: number
  sort?: string
}

/** ✅ Standardized product search result */
export interface SearchResponse {
  products: Product[]
  total: number
  page: number
  size: number
}
