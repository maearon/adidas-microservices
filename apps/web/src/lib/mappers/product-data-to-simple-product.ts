import { Product } from "@/types/product";

export function mapProductDataToSimpleProduct(productData: any): Product {
  return {
    id: String(productData.id),
    name: productData.name,
    sport: productData.sport || '',
    model_number: productData.model_number,
    price: productData.variants[0].price || productData.price || 0,
    compare_at_price: productData.variants[0].compare_at_price || productData.compare_at_price || 0,
    variants: [productData.variants[0]]?.map((v: any) => ({
      variant_code: v.variant_code,
      avatar_url: v?.avatar_url ||
        v?.image_urls?.[0] ||
        productData.main_image_url ||
        "/placeholder.png",
    })) || [],
    main_image_url: productData?.variants[0]?.avatar_url ||
        productData?.variants[0]?.image_urls?.[0] ||
        productData.main_image_url ||
        "/placeholder.png",
  };
}
