import Loading from "@/components/loading";
import { Metadata } from "next";
import { Suspense } from "react";
import KidsPageClient from "./KidsPageClient";

// app/kids/page.tsx
// ✅ generateMetadata must be async with awaited `params`
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "👕Kids' Sneakers and Activewear | adidas US👕",
    description: "Shop the latest kids' shoes, clothing, and accessories at adidas US.",
  };
}

// ✅ Main page function must await `params`
const KidsPage = async () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <KidsPageClient />
      </Suspense>
    </>
  );
};

export default KidsPage;
