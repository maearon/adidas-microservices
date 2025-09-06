import { Product } from "@/types/product";
import { formatPrice } from "../utils";

export function mapProductDataToProduct(productData: any): Product {
  return {
    id: String(productData.id),
    tags: productData.tags || [],
    title: productData.name,
    name: productData.name,
    description: productData.description_p || '',
    description_h5: productData.description_h5 || '',
    specifications: productData.specifications || '',
    care: productData.care || '',
    gender: productData.gender || '',
    franchise: productData.franchise || '',
    product_type: productData.product_type || '',
    brand: productData.brand || '',
    category: productData.category || '',
    sport: productData.sport || '',
    currencyId: 'USD',
    currencyFormat: '$',
    isFreeShipping: true,
    price: Number(formatPrice(productData?.variants[0]?.price).replace("$", ""))
    ||  Number(formatPrice(productData?.price).replace("$", "")) || 0,
    compare_at_price: Number(formatPrice(productData?.variants[0]?.compare_at_price).replace("$", "")) 
    || Number(formatPrice(productData?.compare_at_price).replace("$", "")) || 0,
    installments: 4,
    created_at: productData.created_at?.toString() || '',
    updated_at: productData.updated_at?.toString() || '',
    main_image_url: productData.main_image_url || '',
    hover_image_url: productData.hover_image_url || '',
    availableSizes: productData.variants?.[0]?.sizes || [],
    collection: '',
    badge: '',
    variants: productData.variants?.map((v: any) => ({
      id: String(v.id),
      color: v.color,
      price: v.price,
      compare_at_price: v?.compare_at_price,
      variant_code: v.variant_code,
      stock: v.stock,
      sizes: v.sizes || [],
      avatar_url: v?.avatar_url ||
        v?.image_urls?.[0] ||
        productData.main_image_url ||
        "/placeholder.png",
      hover_url: v?.hover_url ||
        v?.image_urls?.[2] ||
        productData.hover_image_url ||
        "/placeholder.png",
      image_urls: [],
    })) || [],
    slug: productData.slug || '',
    reviews_count: 0,
    average_rating: 0
  };
}
