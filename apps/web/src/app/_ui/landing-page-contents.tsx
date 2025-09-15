"use client";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";

// export const LandingPageContents = () => {

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen w-full">
//       This is the landing page
//       <Link href="/login">
//         <Button>
//           Login
//         </Button>
//       </Link>
//     </div>
//   );
// };
import ProductTabs from "@/components/product-tabs"
import PromoCarousel, { Slide } from "@/components/promo-carousel"
import { Button } from "@/components/ui/button"
import HeroBanner from "@/components/HeroBanner"
import HeroBannerSecond from "@/components/home/HeroBannerSecond"
import { useState, useEffect } from "react"
import PromoBanner from "@/components/home/PromoBanner"
import Image from "next/image"
import { NewArrivalProduct } from "@/types/product"
import { newArrivalProducts } from "@/data/fake-new-arrival-products"
import { mockSlides } from "@/data/mock-slides-data"
import { relatedResources } from "@/data/related-resources-data"
import HistoryView from "@/components/HistoryView"
import PageFooter from "@/components/page-footer"
import TileCard from "@/components/tile-card"
import ResourceCard from "@/components/resource-card"
import HeroBannerVideo from "@/components/home/HeroBannerVideo"
import { useTranslations } from "@/hooks/useTranslations";

export const LandingPageContents = () => {
  const heroT = useTranslations("hero")
  const homeT = useTranslations("home")
  const [newArrivalProductsTab, setNewArrivalProductsTab] = useState<NewArrivalProduct[]>([])

  useEffect(() => {
    try {
      setNewArrivalProductsTab(newArrivalProducts)
    } catch (err) {
      console.error("Failed to setNewArrivalProductsTab", err)
    }
  }, [])

  const popularCategories = ["ultraboost", "samba", "campus", "soccer", "gazelle", "spezial"]

  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <HeroBanner
        backgroundClassName="bg-hero"
        content={{
          title: heroT?.heroTitle ?? "A TRUE MIAMI ORIGINAL",
          description: heroT?.heroDesc ?? "Dream big and live blue in the iconic Inter Miami CF 2025 Third Jersey.",
          buttons: [
            {
              href: "/mls",
              buttonLabel: heroT?.shopNow ?? homeT?.shopNow ?? "SHOP NOW",
              border: false,
              shadow: true,
            },
          ],
        }}
      />
      
      <HeroBannerSecond />

      <HeroBannerVideo />

      <div className="mb-4"></div>

      {/* <PromoCarousel slides={mockSlides}/> */}
      <PromoCarousel
        items={mockSlides}
        renderItem={(slide, i) => (
          <TileCard tile={slide} index={i} />
        )}
      />

      <div className="mb-4"></div>
      
      {/* History Products Section */}
      <HistoryView
        title={
          <>
            {(homeT?.historyStillInterested || "STILL\nINTERESTED?").split("\n")[0]} <br className="xl:hidden" /> {(homeT?.historyStillInterested || "STILL\nINTERESTED?").split("\n")[1]}
          </>
        }
      />

      <div className="mb-4"></div>

      {/* Product Tabs Section */}
      <ProductTabs initialProductsByTab={{
        "new-arrivals": newArrivalProductsTab.map(p => p.product),
        "best-sellers": newArrivalProductsTab.map(p => p.product),
        "new-to-sale": newArrivalProductsTab.map(p => p.product),
      }} />

      <div className="mb-4"></div>

      {/* Prime Section */}
      <section className="bg-black text-white py-8 mb-0">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-0">
          <Image
            src="/assets/resource/Prime_logo_d_c8da1e6868.png"
            alt="Prime Logo"
            width={160}
            height={60}
            className="w-32 sm:w-32 md:w-32 h-auto pb-6"
          />

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide">
            {homeT?.primeFastFreeDelivery || "Fast, Free Delivery"}
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide pb-6">
            {homeT?.primeWithPrime || "with Prime at adidas"}
          </h3>
          <Button 
            href="/prime" 
            loading={false} 
            shadow
            className="bg-white text-black py-3 rounded-none font-semibold hover:bg-gray-100 transition-colors"
          >
            {homeT?.shopNow || "SHOP NOW"}
          </Button>
        </div>
      </section>

      <div className="mb-4"></div>

      {/* Popular Categories */}
      <section className="container mx-auto px-2 py-0">
        <h2 className="text-[32px] font-bold mb-4 text-foreground">{homeT?.popularRightNow || "Popular right now"}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
          {popularCategories.slice(0, 6).map((category, index) => (
            <Button
              shadow={false}
              key={`${category}-${index}`}
              variant="ghost"
              className="w-full justify-start text-left text-[44px] font-extrabold pb-10
                border-0 border-b border-border
                hover:shadow-[inset_0_-5px_0_0_black] dark:hover:shadow-[inset_0_-5px_0_0_white]
                text-foreground hover:text-foreground
                bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent
                rounded-none shadow-none transition-all duration-200"
              showArrow={false}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      <div className="mb-4"></div>

      {/* Related Resources Carousel */}
      <section className="container mx-auto px-2 py-0">
        <h4 className="text-[24px] font-bold mb-2">{homeT?.relatedResources || "RELATED RESOURCES"}</h4>
        {/* <PromoCarousel slides={relatedResources}/> */}
        <PromoCarousel
          items={relatedResources as Slide[]}
          renderItem={(slide, i) => (
            <ResourceCard resource={slide} index={i} />
          )}
        />
      </section>

      <div className="mb-4"></div>

      {/* Footer Categories */}
      <PageFooter currentPage="home" />

      {/* Desktop-only black section with white text and centered content */}
      <section className="block bg-black text-white pt-14 pb-16">
        <div className="container mx-auto px-8 text-center">
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-bold mb-8 uppercase inline-block px-4 pt-3 tracking-wide">
            {homeT?.blackSectionTitle || "SNEAKERS, ACTIVEWEAR AND SPORTING GOODS"}
          </h2>

          <div className="max-w-2xl mx-auto text-base sm:text-md leading-relaxed space-y-4 text-left">
            <p>{homeT?.blackSectionP1 || "Calling all athletes. Gear up for your favorite sport with adidas sneakers and activewear for men and women. From running to soccer and the gym to the trail, performance workout clothes and shoes keep you feeling your best. Find sport-specific sneakers to support your passion, and shop versatile activewear and accessories that support everyday comfort. adidas has you covered with world-class performance, quality and unmatched comfort to fit your style. Explore the full range of adidas gear today."}</p>
            <p>{homeT?.blackSectionP2 || "Founded on performance, adidas sporting goods equipment supports athletes at all levels. Men, women and kids will find their best form in sneakers and activewear made to perform under pressure. adidas sportswear breathes, manages sweat and helps support working muscles. Explore sport-specific clothes and gear for basketball, soccer, or the yoga studio. Runners will find a range of sneakers for training, racing and trail runs. Gym users will find tops, tees and tanks that support focused efforts with adidas CLIMACOOL to feel cool and dry."}</p>
            <p>{homeT?.blackSectionP3 || "Explore warm-ups featuring four-way stretch to support mobility. Find a new outdoor jacket that helps protect against wind and rain. Lace up new athletic shoes that energize every step with adidas Boost cushioning. With sizes and styles for all ages, we have sporting goods for the whole family. Dedicated training demands dedicated workout clothes. Experience the latest performance fabrics and sneaker technologies to get the most out of your next training session."}</p>
          </div>

          <div className="mt-12">
            <Image
              src="/logo-white.png"
              alt="Adidas Logo"
              width={80}  // match w-20 (Tailwind's 5rem = 80px)
              height={80} // pick a height that preserves aspect ratio
              className="mx-auto w-20"
              priority // optional if it's above the fold
            />
          </div>
        </div>
      </section>

    </div>
  )
}
