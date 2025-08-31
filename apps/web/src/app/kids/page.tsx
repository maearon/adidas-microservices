"use client"

import KidsPromoCarousel from "@/app/kids/KidsPromoCarousel"
import HeroBanner from "@/components/HeroBanner"
import ProductCarousel from "@/components/product-carousel"
import HistoryView from "@/components/HistoryView"
import PageFooter from "@/components/page-footer"
import { Slide } from "@/components/promo-carousel"
import { newArrivalProducts as newArrivalProductsTab } from "@/data/fake-new-arrival-products"
import { Product } from "@/types/product"
import { useTranslations } from "@/hooks/useTranslations"

// app/kids/page.tsx
export const metadata = {
  title: "👕Kids' Sneakers and Activewear | adidas US👕",
  description: "Shop the latest kids' shoes, clothing, and accessories at adidas US.",
};

export default function KidsPage() {
  const t = useTranslations("categoryPages")
  
  const categoryTiles = [
    { title: t?.categoryTiles?.youthTeens || "YOUTH AND TEENS", image: "/assets/kids/samba-og-shoes-kids.png?height=200&width=300", href: "/men-shoes" },
    { title: t?.categoryTiles?.children || "CHILDREN", image: "/assets/kids/samba-og-shoes-kids.png?height=200&width=300", href: "/men-tops" },
    { title: t?.categoryTiles?.infantsToddlers || "INFANTS & TODDLERS", image: "/assets/kids/vl-court-3.0-shoes-kids.jpg?height=200&width=300", href: "/men-hoodies" },
    { title: t?.categoryTiles?.allKids || "ALL KIDS", image: "/assets/kids/samba-og-shoes-kids.jpg?height=200&width=300", href: "/men-pants" },
  ]

  const promoTiles: Slide[] = [
    {
      title: t?.promoTiles?.newArrivals?.title || "NEW ARRIVALS",
      description: t?.promoTiles?.newArrivals?.description || "",
      image: "/assets/kids/ss25_ccrd_kids_glp_new_1_d_2baaccada6.jpg",
      href: "/products/adizero-evo-sl",
    },
    {
      title: t?.promoTiles?.lifestyle?.title || "LIFESTYLE",
      description: t?.promoTiles?.lifestyle?.description || "",
      image: "/assets/kids/ss25_ccrd_kids_glp_lifestyle_2_d_7ac0b03fc1.jpg",
      href: "/products/campus",
    },
    {
      title: t?.promoTiles?.shoes?.title || "SHOES",
      description: t?.promoTiles?.shoes?.description || "",
      image: "/assets/kids/ss25_ccrd_kids_glp_shoes_3_d_a07b81c4b0.jpg",
      href: "/products/real-madrid-25-26",
    },
    {
      title: t?.promoTiles?.familyMatching?.title || "FAMILY MATCHING",
      description: t?.promoTiles?.familyMatching?.description || "",
      image: "/assets/kids/ss25_ccrd_kids_glp_fammatch_4_d_8cd85b7184.jpg",
      href: "/products/dropset-3",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <HeroBanner
        backgroundClassName="bg-hero-kids"
        content={{
          title: t?.kidsHero?.title || "WE ARE SO BACK",
          description: t?.kidsHero?.description || "Get their back to school looks down this year with tracksuits, sneakers, and more.",
          buttons: [
            { 
              href: "/kids-back_to_schools", 
              buttonLabel: t?.kidsHero?.shopNow || "SHOP NOW",
              border: false,
              shadow: true,
            }
          ],
        }}
      />
      <div className="mb-4"></div>
      
      {/* Promo Tiles */}
      <KidsPromoCarousel items={promoTiles} />

      {/* Category Tiles */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryTiles.map((category, index) => (
            <a
              key={index}
              href={category.href}
              className="flex flex-col items-center bg-[#EAEEEF] p-4 pt-0 hover:shadow-lg transition"
            >
              {/* Image block */}
              <div className="w-[160px] h-[160px] bg-background mb-4 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-background text-base font-bold underline uppercase text-center">
                {category.title}
              </h3>
            </a>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-2">
        <h2 className="text-xl font-bold mb-4">{t?.topPicks || "TOP PICKS FOR YOU"}</h2>

        <ProductCarousel
          products={newArrivalProductsTab.map(p => p.product) as Product[]}
        />
      </section>

      <section className="container mx-auto px-2 py-8 text-center">
        <div className="container mx-auto px-8 text-center">
          <h2 className="max-w-[400px] text-2xl sm:text-3xl font-bold mb-8 uppercase inline-block px-4 pt-3 tracking-wide">
          {t?.descriptions?.kids?.title || "Kids&apos; Shoes and Activewear"}</h2>
        <div className="max-w-4xl mx-auto text-base sm:text-md leading-relaxed space-y-4">
          <p>
            {t?.descriptions?.kids?.paragraph1 || "Aspiring sports stars and busy kids deserve the best. Explore kids&apos; sneakers and sportswear for active girls and boys. Fulfill their sports dreams with matching kids&apos; activewear and warm-ups that fit and feel great from the classroom to the playground, the gym, and home. Enjoy the best selection of comfy kids&apos; clothes and sneakers to keep your young athlete excited to exercise and play their best. Discover the latest trends and heritage adidas styles in kids&apos; athletic clothes, sneakers, cleats and accessories."}
          </p>
        </div>
        </div>
      </section>

      <HistoryView
        title={
          <>
            {t?.recentlyViewed || "RECENTLY VIEWED ITEMS"}
          </>
        }
        showIndicatorsInProductCarousel={true}
      />

      <PageFooter currentPage="kids" />
    </div>
  )
}
