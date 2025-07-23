import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient"
import Breadcrumb from "@/components/Breadcrumb";
import { getBreadcrumbTrail } from "@/utils/breadcrumb";

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams?: {
    page?: string
    sort?: string
    gender?: string
    category?: string
    activity?: string
    product_type?: string
    size?: string
    color?: string
    material?: string
    brand?: string
    model?: string
    collection?: string
    min_price?: string
    max_price?: string
    shipping?: string
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  if (!params?.slug) notFound();
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={getBreadcrumbTrail(params.slug)}/>

        <CategoryPageClient 
          params={params} 
          searchParams={searchParams} 
          query={encodeURIComponent("a")}
        />
      </div>
    </main>
  );
}
