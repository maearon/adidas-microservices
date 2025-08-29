"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

interface Props {
  onNavigate: (page: "home" | "men") => void
}

export default function MenPage({ onNavigate }: Props) {
  const categoryTiles = [
    { title: "SNEAKERS", image: "/placeholder.png?height=200&width=300" },
    { title: "TOPS", image: "/placeholder.png?height=200&width=300" },
    { title: "HOODIES & SWEATSHIRTS", image: "/placeholder.png?height=200&width=300" },
    { title: "PANTS", image: "/placeholder.png?height=200&width=300" },
  ]

  const promoTiles = [
    {
      title: "SAMBA",
      description: "Retro cool. Timeless as ever.",
      image: "/placeholder.png?height=250&width=300",
      cta: "SHOP NOW",
    },
    {
      title: "DROPSET 3",
      description: "Rooted in Strength.",
      image: "/placeholder.png?height=250&width=300",
      cta: "SHOP NOW",
    },
    {
      title: "CRAFT LITE SHORTS",
      description: "Engineered to elevate your game.",
      image: "/placeholder.png?height=250&width=300",
      cta: "SHOP NOW",
    },
    {
      title: "ULTRABOOST 22",
      description: "Step it forward with feel-good gear. #1 supportive shoe made for runners by you.",
      image: "/placeholder.png?height=250&width=300",
      cta: "SHOP NOW",
    },
  ]

  const topPicks = [
    { id: 1, name: "Samba OG Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
    { id: 2, name: "Ultraboost 1.0 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
    { id: 3, name: "Ultraboost 1.0 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
    { id: 4, name: "Gazelle Indoor Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200">
        {/* Top bar */}
        <div className="bg-black text-white text-xs py-1 text-center">FREE STANDARD SHIPPING WITH ADICLUB</div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="text-2xl font-bold">adidas</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button className="text-base font-medium hover:underline">SHOES</button>
              <button
                className="text-base font-medium hover:underline border-b-2 border-border"
                onClick={() => onNavigate("men")}
              >
                MEN
              </button>
              <button className="text-base font-medium hover:underline">WOMEN</button>
              <button className="text-base font-medium hover:underline">KIDS</button>
              <button className="text-base font-medium hover:underline">SALE</button>
              <button className="text-base font-medium hover:underline">NEW & TRENDING</button>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Input placeholder="Search" className="w-48" />
                <Search className="h-5 w-5" />
              </div>
              <User className="h-5 w-5 cursor-pointer" />
              <Heart className="h-5 w-5 cursor-pointer" />
              <ShoppingBag className="h-5 w-5 cursor-pointer" />
              <Menu className="h-5 w-5 cursor-pointer sm:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 h-full">
          {/* Left panel */}
          <div
            className="relative bg-cover bg-center"
            style={{ backgroundImage: "url('/placeholder.png?height=400&width=400')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-8 left-8 text-background">
              <h2 className="text-2xl font-bold mb-2">ADIZERO EVO SL</h2>
              <p className="text-base mb-4">Fast feels. For the speed of the city.</p>
              <Button variant="outline" className="bg-background text-background hover:bg-gray-100">
                SHOP NOW
              </Button>
            </div>
          </div>

          {/* Center panel */}
          <div
            className="relative bg-cover bg-center"
            style={{ backgroundImage: "url('/placeholder.png?height=400&width=400')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          {/* Right panel */}
          <div
            className="relative bg-cover bg-center"
            style={{ backgroundImage: "url('/placeholder.png?height=400&width=400')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="container mx-auto px-2 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryTiles.map((category, index) => (
            <Card
              key={index}
              className="relative overflow-hidden h-48 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${category.image}')` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>
              <CardContent className="relative h-full flex items-end p-6">
                <h3 className="text-background font-bold text-lg">{category.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Promo Tiles */}
      <section className="container mx-auto px-2 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoTiles.map((tile, index) => (
            <Card key={index} className="relative overflow-hidden h-80">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${tile.image}')` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <CardContent className="relative h-full flex flex-col justify-end p-6 text-background">
                <h3 className="font-bold text-xl mb-2">{tile.title}</h3>
                <p className="text-base mb-4">{tile.description}</p>
                <Button variant="outline" size="sm" className="w-fit bg-background text-background hover:bg-gray-100">
                  {tile.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Picks */}
      <section className="container mx-auto px-2 py-4">
        <h2 className="text-2xl font-bold mb-4">TOP PICKS FOR YOU</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topPicks.map((product) => (
            <Card key={product.id} className="border-none shadow-none">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  {/* <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  /> */}
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    fill // need relative
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-64 object-cover"
                  />
                  <Heart className="absolute top-4 right-4 h-5 w-5 cursor-pointer" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <p className="font-bold">{formatPrice(product?.price)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Men's Description */}
      <section className="container mx-auto px-2 py-4 text-center">
        <h2 className="text-3xl font-bold mb-6">MEN&apos;S SNEAKERS AND WORKOUT CLOTHES</h2>
        <div className="max-w-4xl mx-auto text-gray-600 dark:text-white space-y-4">
          <p>
            Ambitious, effortless and creative. Casual fits, street-proud and perform your best in men&apos;s shoes and
            apparel that support your passion and define your style. Whether you&apos;re training for a marathon, playing
            pickup basketball or just hanging out with friends, adidas men&apos;s clothing and shoes are designed to keep you
            comfortable, so you feel confident and ready to take on whatever comes your way.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">MEN&apos;S CLOTHING</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Hoodies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Sweatshirts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Jackets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shorts
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">MEN&apos;S SHOES</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Lifestyle Sneakers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    High Top Sneakers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Classic Sneakers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    All White Sneakers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">MEN&apos;S ACCESSORIES</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Bags
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Socks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Hats
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Headphones
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">MEN&apos;S COLLECTIONS</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Soccer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Loungewear
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Training & Gym
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Men&apos;s Originals
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Footer */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">adidas</div>
          <p className="text-xs text-gray-500">© 2024 adidas America, Inc.</p>
        </div>
      </div>
    </div>
  )
}
