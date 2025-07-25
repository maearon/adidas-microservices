import { Metadata } from "next";
import SearchResults from "./SearchResults";
import Breadcrumb from "@/components/Breadcrumb";

interface SearchPageProps {
  searchParams?: { q?: string };
}

// ✅ Fix generateMetadata: dùng destructuring đúng cách
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await Promise.resolve(searchParams || {});
  return {
    title: q ? `Search results for "${q}"` : "Search",
  };
}

// ✅ Component async: tránh lỗi nếu `searchParams` không tồn tại
const SearchPage = async ({
  searchParams,
}: SearchPageProps) => {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: q ? `Search for: "${q}"` : "Search",
              href: `/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
            },
          ]}
        />
        <div className="mb-[30px]" />

        <SearchResults query={q} />
      </div>
    </main>
  );
};

export default SearchPage;
