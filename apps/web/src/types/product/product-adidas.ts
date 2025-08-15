// 📁 @types/product-adidas.ts

import { BreadcrumbItem } from "../bread-crumb/bread-crumb"
import { Product } from "./product";

//
export interface LastVisitedProduct {
  product: Product;
  timestamp: number;
  url: string;
}

export interface NewArrivalProduct {
  product: Product;
  timestamp: number;
  url: string;
}

export interface ProductData {
  id: string;
  model_number: string;
  base_model_number: string;
  product_type: string;
  sport?: string;
  display_name: string;
  name: string;
  price: string;
  compare_at_price?: string;
  variant_code?: string;
  price_information: PriceInfo[];
  pricing_information: {
    currentPrice: number;
    standard_price: number;
    standard_price_no_vat: number;
  };
  thumbnail: string;
  image_url: string;
  image: string;
  description?: string;
  attribute_list?: {
    brand?: string;
    color?: string;
    gender?: string;
    sale?: boolean;
    // mở rộng tùy vào project
  };
  breadcrumb_list?: BreadcrumbItem[];
  product_description?: {
    title?: string;
    text?: string;
    subtitle?: string;
  };
  links?: {
    self: {
      href: string;
    };
  };
  variation_list?: ProductVariation[];
  view_list?: ProductAsset[];
  url?: string;
}

export interface PriceInfo {
  value: number;
  value_no_vat: number;
  type: string;
}

export interface ProductVariation {
  sku: string;
  size: string;
}

export interface ProductAsset {
  type: string;
  image_url: string;
  view?: string;
  source?: string;
}
