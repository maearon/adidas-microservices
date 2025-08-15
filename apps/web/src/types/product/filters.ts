/** 📦 Product list query filters */
export interface ProductFilters {
  slug?: string;
  q?: string;
  gender?: string;
  category?: string;
  sport?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  page?: number;
  per_page?: number;
  limit?: number;
}
