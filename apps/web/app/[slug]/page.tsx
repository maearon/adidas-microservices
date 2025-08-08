import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import Breadcrumb from "@/components/Breadcrumb";
import { getBreadcrumbTrail } from "@/utils/breadcrumb";
import { Metadata } from "next";
import { formatSlugTitle } from "@/utils/category-config.auto";

interface CategoryPageProps {
  params: {
    slug?: string;
  };
  searchParams?: {
    page?: string;
    sort?: string;
    gender?: string;
    category?: string;
    activity?: string;
    product_type?: string;
    size?: string;
    color?: string;
    material?: string;
    brand?: string;
    model?: string;
    collection?: string;
    min_price?: string;
    max_price?: string;
    shipping?: string;
  };
}

// ✅ Sử dụng await đúng cách trong generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params || {});
  const pageTitle = formatSlugTitle(slug);
  return {
    title: pageTitle,
  };
}

// ✅ Sử dụng await đúng cách trong component
const CategoryPage = async ({
  params,
  searchParams,
}: CategoryPageProps) => {
  const { slug } = await Promise.resolve(params || {});

  if (!slug) notFound();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={getBreadcrumbTrail(slug)} />
        <div className="mb-[30px]"></div>

        <CategoryPageClient
          params={{ slug }}
          searchParams={searchParams}
          query={encodeURIComponent("a")}
        />
      </div>
    </main>
  );
};

export default CategoryPage;
