import { Product } from "@/types/product";

export function mapProductDataToSimpleProduct(productData: any): Product {
  return {
    id: String(productData.id),
    name: productData.name,
    sport: productData.sport || '',
    model_number: productData.model_number,
    price: productData.variants[0].price || productData.price || 0,
    variants: [productData.variants[0]]?.map((v: any) => ({
      variant_code: v.variant_code,
      avatar_url: v?.avatar_url ||
        v?.image_urls?.[0] ||
        productData.main_image_url ||
        "/placeholder.png",
      hover_url: v?.hover_url ||
        v?.image_urls?.[2] ||
        productData.hover_image_url ||
        "/placeholder.png",
      image_urls: v?.images ?? [],
    })) || [],
    main_image_url: productData?.variants[0]?.avatar_url ||
        productData?.variants[0]?.image_urls?.[0] ||
        productData.main_image_url ||
        "/placeholder.png",
    hover_image_url: productData?.variants[0]?.hover_url ||
        productData?.variants[0]?.image_urls?.[2] ||
        productData.hover_image_url ||
        "/placeholder.png",
  };
}
