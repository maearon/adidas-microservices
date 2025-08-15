// hooks/useUrlFilters.ts
"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";

// ======================
// Types
// ======================

// Filters UI: có thể là string, number, string[] hoặc number[]
export type Filters = Record<string, string | number | string[] | number[]>;

// Strict type API
export interface ProductQuery {
  slug: string;
  page?: number;
  per_page?: number;
  sort?: string;
  gender?: string[];
  category?: string[];
  activity?: string[];
  sport?: string[];
  product_type?: string[];
  size?: string[];
  color?: string[];
  material?: string[];
  brand?: string[];
  model?: string[];
  collection?: string[];
  min_price?: number;
  max_price?: number;
  shipping?: string;
}

// ======================
// Helpers
// ======================

// Chuyển giá trị thành array<string> an toàn
function toArray(val: unknown): string[] | undefined {
  if (val === undefined || val === null) return undefined;
  return Array.isArray(val) ? (val as string[]) : [String(val)];
}

// Parse URLSearchParams thành Filters
function parseUrlFilters(searchParams: URLSearchParams): Filters {
  const filters: Filters = {};

  searchParams.forEach((value, key) => {
    if (filters[key] !== undefined) {
      const prev = filters[key];
      filters[key] = Array.isArray(prev)
        ? [...(prev as string[]), value]
        : [String(prev), value];
    } else {
      filters[key] = value;
    }
  });

  // Chuyển các giá trị numeric
  const numericKeys: (keyof Filters)[] = ["min_price", "max_price", "page", "per_page"];
  numericKeys.forEach((key) => {
    const val = filters[key];
    if (val !== undefined) {
      if (Array.isArray(val)) {
        filters[key] = val.map((v) => Number(v));
      } else {
        filters[key] = Number(val);
      }
    }
  });

  return filters;
}

// Map Filters UI → ProductQuery API
export function filtersToQuery(filters: Filters, slug: string): ProductQuery {
  return {
    slug,
    page: filters.page as number | undefined,
    per_page: filters.per_page as number | undefined,
    sort: filters.sort as string | undefined,
    gender: toArray(filters.gender),
    category: toArray(filters.category),
    activity: toArray(filters.activity),
    sport: toArray(filters.sport),
    product_type: toArray(filters.product_type),
    size: toArray(filters.size),
    color: toArray(filters.color),
    material: toArray(filters.material),
    brand: toArray(filters.brand),
    model: toArray(filters.model),
    collection: toArray(filters.collection),
    min_price: filters.min_price as number | undefined,
    max_price: filters.max_price as number | undefined,
    shipping: filters.shipping as string | undefined,
  };
}

// ======================
// Hook chính
// ======================

export function useUrlFilters(slug: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse filters từ URL
  const filters = useMemo<Filters>(() => {
    return parseUrlFilters(searchParams);
  }, [searchParams]);

  // Chuyển sang ProductQuery để gọi API
  const query = useMemo<ProductQuery>(() => filtersToQuery(filters, slug), [filters, slug]);

  // Cập nhật filters → update URL
  const setFilters = useCallback(
    (newFilters: Filters, replaceHistory = true) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // ép tất cả value thành string
          Array.from(new Set(value.map(String))).forEach((v) => params.append(key, v));
        } else if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      const url = `?${params.toString()}`;
      if (replaceHistory) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [router]
  );

  return { filters, query, setFilters };
}
