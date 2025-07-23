import { Metadata } from "next";
import SearchResults from "./SearchResults";
import Breadcrumb from "@/components/Breadcrumb";

interface SearchPageProps {
  searchParams?: { q?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const q = searchParams?.q || "";
  return {
    title: `Search results for "${q}"`,
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
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

export default SearchPage;
