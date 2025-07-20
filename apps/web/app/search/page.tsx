import { Metadata } from "next";
import SearchResults from "./SearchResults"
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: `Search results for "${q}"`,
  };
}

export default function Page({ searchParams: { q } }: PageProps) {
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
        {/* <Breadcrumb items={[{ label: "Home", href: "/" }]} /> */}

        <SearchResults query={encodeURIComponent(q)} />
      </div>
    </main>
  );
}
