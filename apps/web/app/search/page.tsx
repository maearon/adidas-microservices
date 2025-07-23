import { Metadata } from "next";
import SearchResults from "./SearchResults";
import Breadcrumb from "@/components/Breadcrumb";

interface PageProps {
  searchParams?: { q?: string };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const q = searchParams?.q || "";
  return {
    title: `Search results for "${q}"`,
  };
}

export default function Page({ searchParams }: PageProps) {
  const q = searchParams?.q || "";

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[]}/>

        <SearchResults query={encodeURIComponent(q)} />
      </div>
    </main>
  );
}
