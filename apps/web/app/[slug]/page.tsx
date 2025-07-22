import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient"
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-2 text-sm hover:underline">
            <ArrowLeft size={16} />
            BACK
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/" className="text-sm hover:underline">
            Home
          </Link>
        </div>

        <CategoryPageClient 
          params={params} 
          searchParams={searchParams} 
          query={encodeURIComponent("a")}
        />
      </div>
    </main>
  );
}
