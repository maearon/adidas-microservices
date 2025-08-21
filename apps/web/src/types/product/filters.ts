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

export interface ProductQueryParams {
  gender?: string | string[];
  category?: string | string[];
  price_min?: number;
  price_max?: number;
  cursor?: string;
}
