import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import ProductDetailPageClient from "./ProductDetailPageClient";
import { formatSlugTitle } from "@/utils/category-config.auto";
import Loading from "@/components/loading";

interface ProductDetailPageProps {
  params?: { slug?: string; model?: string };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const pageTitle = formatSlugTitle(params?.slug || "Product Detail");
  return {
    title: pageTitle,
  };
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  if (!params?.model) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<Loading />}>
        <ProductDetailPageClient
          params={{
            slug: params.slug || "default-slug",
            model: params.model,
          }}
        />
      </Suspense>
    </div>
  );
};

export default ProductDetailPage;
