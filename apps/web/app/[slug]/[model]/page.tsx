// app/[slug]/[model]/page.tsx

import { notFound } from "next/navigation";
import ProductDetailPageClient from "./ProductDetailPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";

interface ProductDetailPageProps {
  params?: { slug?: string, model?: string };
}

export function generateMetadata({ params }: ProductDetailPageProps): Metadata {
  const pageTitle = formatSlugTitle(params?.slug || "Product Detail");
  return {
    title: pageTitle,
  };
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  if (!params?.model) notFound();
  return <ProductDetailPageClient 
  params={{ slug: "f50-messi-elite-firm-ground-cleats", model: "JP55933"}} 
  />
}

export default ProductDetailPage;
