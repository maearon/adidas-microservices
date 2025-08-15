import { Product } from "../product/product";

// 📦 SearchFilters: filter params sent to search APIs
export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  gender?: string;
  sport?: string;
  min_price?: number;
  max_price?: number;
  size?: number;
  page?: number;
  sort?: string;
}

// 📦 SearchResponse: product search result from search engine
export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
}

// Search-related types

// TODO: Add code here...

// 📁 @types/search.ts

/** 🔍 Query filters used in product search */
export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  gender?: string;
  sport?: string;
  min_price?: number;
  max_price?: number;
  size?: number;
  page?: number;
  sort?: string;
}

/** ✅ Standardized product search result */
export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
}
