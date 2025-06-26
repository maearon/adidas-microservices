// 📁 @types/product-adidas.ts

import { Breadcrumb } from "../bread-crumb/bread-crumb"

//
export interface LastVisitedProduct {
  product: ProductData;
  timestamp: number;
  url: string;
}

export interface ProductData {
  id: string;
  model_number: string;
  base_model_number: string;
  product_type: string;
  display_name: string;
  name: string;
  price: string;
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
  breadcrumb_list?: Breadcrumb[];
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
