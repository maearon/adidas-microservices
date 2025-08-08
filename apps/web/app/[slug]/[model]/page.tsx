import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import ProductDetailPageClient from "./ProductDetailPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";
import Loading from "@/components/loading";

interface ProductDetailPageProps {
  params: { slug?: string; model?: string };
}

// ✅ generateMetadata must be async with awaited `params`
export async function generateMetadata(
  props: { params: { slug?: string } }
): Promise<Metadata> {
  const { slug } = await Promise.resolve(props.params || {});
  const pageTitle = formatSlugTitle(slug || "Product Detail");
  return {
    title: pageTitle,
  };
}

// ✅ Main page function must await `params`
const ProductDetailPage = async (props: ProductDetailPageProps) => {
  const { slug, model } = await Promise.resolve(props.params || {});

  if (!slug || !model) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <ProductDetailPageClient
          params={{
            slug,
            model,
          }}
        />
      </Suspense>
    </div>
  );
};

export default ProductDetailPage;
