"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import MenFooter from "@/components/page-footer"
import HeroBanner from "@/components/HeroBanner"
import ProductCarousel from "@/components/product-carousel"
import { useEffect, useState } from "react"
import { newArrivalProducts } from "@/data/fake-new-arrival-products"
import { Product } from "@/types/product"
import HistoryView from "@/components/HistoryView"
import PageFooter from "@/components/page-footer"
import TileCard from "@/components/tile-card"
import PromoCarousel, { Slide } from "@/components/promo-carousel"

export default function WomenPage() {
  const [newArrivalProductsTab, setNewArrivalProductsTab] = useState<Product[]>([])

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

  // const topPicks = [
  //   { id: 1, name: "Samba OG Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
  //   { id: 2, name: "Ultraboost 1.0 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
  //   { id: 3, name: "Ultraboost 22 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
  //   { id: 4, name: "Gazelle Indoor Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
  // ]

  const recentlyViewed = [
    {
      id: 1,
      name: "Real Madrid 23/24 Home Authentic Jersey",
      price: "$130",
      image: "/placeholder.png?height=300&width=250",
    },
    { id: 2, name: "Essentials Hoodie", price: "$65", image: "/placeholder.png?height=300&width=250" },
    { id: 3, name: "Adizero EVO SL Shoes", price: "$130", image: "/placeholder.png?height=300&width=250" },
    { id: 4, name: "Adizero F50 FG Shoes", price: "$280", image: "/placeholder.png?height=300&width=250" },
  ]

  const menCategories = {
    "MEN'S CLOTHINGgggg": ["T-shirts", "Hoodies", "Sweatshirts", "Jackets", "Pants & Joggers", "Shorts"],
    "MEN'S SHOES": ["Shoes", "High Top Sneakers", "Low Top Sneakers", "Slip On Sneakers", "All White Sneakers"],
    "MEN'S ACCESSORIES": ["Men's Accessories", "Men's Socks", "Men's Bags", "Men's Hats", "Men's Headphones"],
    "MEN'S COLLECTIONS": [
      "Men's Running",
      "Men's Soccer",
      "Men's Loungewear",
      "Men's Training & Gym",
      "Men's Originals",
    ],
  }

  return (
    <div className="min-h-screen bg-white">
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
              <div className="w-[160px] h-[160px] bg-white mb-4 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-black text-sm font-bold underline uppercase text-center">
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

      {/* Top Picks */}
      {/* <section className="container mx-auto px-2 py-12">
        <h2 className="text-xl font-bold mb-8">TOP PICKS FOR YOU</h2>
        <div className="grid grid-cols-4 gap-6">
          {topPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}
      {/* Top Picks */}
      {/* Top Picks */}
      <section className="container mx-auto px-2">
        <h2 className="text-xl font-bold mb-8">TOP PICKS FOR YOU</h2>

        <ProductCarousel
          products={newArrivalProductsTab}
        />
      </section>


      {/* Men's Description */}
      <section className="container mx-auto px-2 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">Women's Sneakers and Workout Clothes</h2>
        <div className="max-w-4xl mx-auto text-gray-700 text-sm leading-relaxed space-y-4">
          <p>
            Look great. Feel great. Perform great. Keep your workout on track with women's sneakers that support focused training with a supportive fit and a cushioned midsole. Designed for performance and comfort, our women's workout clothes and shoes support athletes and training at every level. Experience adidas technologies that support cool, dry comfort through intense workouts. Put your fitness first with adidas women's workout shoes and running clothes that breathe, manage sweat and help you realize your fitness goals.
          </p>
        </div>
      </section>

      {/* Recently Viewed */}
      {/* <section className="container mx-auto px-2 py-12">
        <h2 className="text-xl font-bold mb-8">RECENTLY VIEWED ITEMS</h2>
        <div className="grid grid-cols-4 gap-6">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}
      <HistoryView
        title={
          <>
            RECENTLY VIEWED ITEMS
          </>
        }
        showIndicatorsInProductCarousel={true}
      />

      {/* Men's Categories Footer */}
      {/* <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {Object.entries(menCategories).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-bold mb-4 text-sm">{category}</h3>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-sm text-gray-600 hover:underline">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <Footer /> */}
      <PageFooter currentPage="women" />
    </div>
  )
}
