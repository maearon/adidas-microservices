"use client"

import HeroBanner from "@/components/HeroBanner"
import ProductCarousel from "@/components/product-carousel"
import { useEffect, useState } from "react"
import { NewArrivalProduct, Product } from "@/types/product"
import HistoryView from "@/components/HistoryView"
import PageFooter from "@/components/page-footer"
import TileCard from "@/components/tile-card"
import PromoCarousel, { Slide } from "@/components/promo-carousel"
import { newArrivalProducts } from "@/data/fake-new-arrival-products"

export default function WomenPage() {
  const [newArrivalProductsTab, setNewArrivalProductsTab] = useState<NewArrivalProduct[]>([])

  useEffect(() => {
    try {
      setNewArrivalProductsTab(newArrivalProducts)
    } catch (err) {
      console.error("Failed to setNewArrivalProductsTab", err)
    }
  }, [])

  const categoryTiles = [
    { title: "SNEAKERS", image: "/assets/women/samba-og-shoes.jpg?height=200&width=300", href: "/men-shoes" },
    { title: "TOPS", image: "/assets/women/adicolor-classic-firebird-loose-track-top.jpg?height=200&width=300", href: "/men-tops" },
    { title: "PANTS & TIGHTS", image: "/assets/women/tricot-3-stripes-track-pants.jpg?height=200&width=300", href: "/men-hoodies" },
    { title: "MATCHING SETS", image: "/assets/women/adidas-by-stella-mccartney-truecasuals-terry-short.jpg?height=200&width=300", href: "/men-pants" },
  ]

  const promoTiles: Slide[] = [
    {
      title: "ADIZERO EVO SL",
      description: "Feel fast. In all aspects of life.",
      image: "/assets/women/running_fw25_adizero_w_card_launch_d_daa2410a01.jpeg",
      href: "/products/adizero-evo-sl",
    },
    {
      title: "CAMPUS",
      description: "Street classic to keep you moving in style.",
      image: "/assets/women/originals_fw25_taekwondo_card_sustain_d_12978e639b.jpg",
      href: "/products/campus",
    },
    {
      title: "REAL MADRID 25/26 HOME JERSEY",
      description: "Bring the Bernabéu Stadium to them.",
      image: "/assets/women/global_sparkfusion_football_fw25_launch_glp_catlp_navigation_card_teaser_1_d_5e18383848.jpg",
      href: "/products/real-madrid-25-26",
    },
    {
      title: "DROPSET 3",
      description: "Rooted in Strength.",
      image: "/assets/women/global_dropset_training_fw25_launch_fglp_navigation_card_teaser_2_d_587e6e1970.jpg",
      href: "/products/dropset-3",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <HeroBanner
        backgroundClassName="bg-hero-women"
        content={{
          title: "PAST, PRESENT, FUTURE",
          description: "Explore the Superstar, now updated for the next generation.",
          buttons: [
            { 
              href: "/women-superstar", 
              buttonLabel: "SHOP NOW",
              border: false,
              shadow: true,
            }
          ],
        }}
      />

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

      {/* Promo Tiles */}
      <PromoCarousel
        items={promoTiles}
        renderItem={(slide, i) => (
          <TileCard tile={slide} index={i} />
        )}
      />

      <section className="container mx-auto px-2">
        <h2 className="text-xl font-bold mb-4">TOP PICKS FOR YOU</h2>

        <ProductCarousel
          products={newArrivalProductsTab.map(p => p.product) as Product[]}
        />
      </section>


      {/* Men's Description */}
      <section className="container mx-auto px-2 py-8 text-center">
        <div className="container mx-auto px-8 text-center">
          <h2 className="max-w-[400px] text-2xl sm:text-3xl font-bold mb-8 uppercase inline-block px-4 pt-3 tracking-wide">
          Women&apos;s Sneakers and Workout Clothes</h2>
        <div className="max-w-4xl mx-auto text-base sm:text-md leading-relaxed space-y-4">
          <p>
            Look great. Feel great. Perform great. Keep your workout on track with women&apos;s sneakers that support focused training with a supportive fit and a cushioned midsole. Designed for performance and comfort, our women&apos;s workout clothes and shoes support athletes and training at every level. Experience adidas technologies that support cool, dry comfort through intense workouts. Put your fitness first with adidas women&apos;s workout shoes and running clothes that breathe, manage sweat and help you realize your fitness goals.
          </p>
        </div>
        </div>
      </section>

      <HistoryView
        title={
          <>
            RECENTLY VIEWED ITEMS
          </>
        }
        showIndicatorsInProductCarousel={true}
      />

      <PageFooter currentPage="women" />
    </div>
  )
}
