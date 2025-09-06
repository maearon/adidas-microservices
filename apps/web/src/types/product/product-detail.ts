// types/product/product-detail.ts

export interface Highlight {
  title: string;
  text: string;
}

export interface ProductDetails {
  soldOutSizes: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  description: string;
  details: string[];
  highlights: Highlight[];
  sizeGuide: string;
  breadcrumb: string;
  sizes: string[];
}
