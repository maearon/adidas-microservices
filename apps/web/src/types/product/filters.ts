/** 📦 Product list query filters */
export interface ProductFilters {
  slug?: string;
  q?: string;
  gender?: string | string[];
  category?: string | string[];
  sport?: string | string[];
  brand?: string | string[];
  min_price?: number;
  max_price?: number;
  size?: string | string[];
  color?: string | string[];
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
