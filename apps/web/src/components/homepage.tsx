"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Props {
  onNavigate: (page: "home" | "men") => void
}

export default function Homepage({ onNavigate }: Props) {
  const products = [
    {
      id: 1,
      name: "Real Madrid 24/25 Home Authentic Jersey",
      price: "$130",
      image: "/placeholder.png?height=300&width=250",
      category: "Soccer",
    },
    {
      id: 2,
      name: "Real Madrid 24/25 Home Jersey",
      price: "$90",
      image: "/placeholder.png?height=300&width=250",
      category: "Soccer",
    },
    {
      id: 3,
      name: "Samba OG Shoes",
      price: "$100",
      image: "/placeholder.png?height=300&width=250",
      category: "Originals",
    },
    {
      id: 4,
      name: "Gazelle Shoes",
      price: "$100",
      image: "/placeholder.png?height=300&width=250",
      category: "Originals",
    },
  ]

  const promoTiles = [
    {
      title: "SUPERSTAR",
      subtitle: "PAST, PRESENT, FUTURE",
      description: "Explore the Superstar, now updated for the next generation.",
      image: "/placeholder.png?height=200&width=300",
      cta: "SHOP NOW",
    },
    {
      title: "ULTRABOOST",
      subtitle: "ULTRABOOST 22",
      description: "Step it forward with feel-good gear. #1 supportive experience on Adidas to you.",
      image: "/placeholder.png?height=200&width=300",
      cta: "SHOP NOW",
    },
    {
      title: "PLAY YOUR FASTEST",
      subtitle: "",
      description: "Ultraboost 5 tennis shoes. Made for speed.",
      image: "/placeholder.png?height=200&width=300",
      cta: "SHOP NOW",
    },
    {
      title: "EMBRACE IT",
      subtitle: "",
      description: "Believe in Strength.",
      image: "/placeholder.png?height=200&width=300",
      cta: "SHOP NOW",
    },
  ]

  const popularCategories = ["ultraboost", "samba", "campus", "soccer", "gazelle", "spezial"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200">
        {/* Top bar */}
        <div className="bg-black text-white text-xs py-1 text-center">GET HELP WITH YOUR ORDER - HELP</div>

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
              <button className="text-base font-medium hover:underline cursor-pointer" onClick={() => onNavigate("men")}>
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/placeholder.png?height=400&width=1200')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="text-foreground">
            <h1 className="text-4xl font-bold mb-2">ADIZERO EVO SL</h1>
            <p className="text-lg mb-4">Fast feels. For the speed of the city.</p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="bg-background text-background hover:bg-gray-100"
                onClick={() => onNavigate("men")}
              >
                SHOP MEN
              </Button>
              <Button variant="outline" className="bg-background text-background hover:bg-gray-100">
                SHOP WOMEN
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-2 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <Badge variant="secondary">New Arrivals</Badge>
            <Badge variant="outline">Best Sellers</Badge>
          </div>
          <Button variant="link" className="text-base">
            VIEW ALL
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="border-none shadow-none">
              <CardContent className="p-0">
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <Heart className="absolute top-4 right-4 h-5 w-5 cursor-pointer" />
                </div>
                <div>
                  <p className="text-base text-gray-600 dark:text-white mb-1">{product.category}</p>
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <p className="font-bold">{formatPrice(product?.price)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Promo Tiles */}
      <section className="container mx-auto px-2 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoTiles.map((tile, index) => (
            <Card key={index} className="relative overflow-hidden h-64">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${tile.image}')`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <CardContent className="relative h-full flex flex-col justify-end p-6 text-foreground">
                <h3 className="font-bold text-lg mb-1">{tile.title}</h3>
                {tile.subtitle && <p className="text-base mb-2">{tile.subtitle}</p>}
                <p className="text-base mb-4">{tile.description}</p>
                <Button variant="outline" size="sm" className="w-fit bg-background text-background hover:bg-gray-100">
                  {tile.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-2 py-4">
        <h2 className="text-2xl font-bold mb-4">Popular right now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((category, index) => (
            <Button key={index} variant="outline" className="h-12 text-lg font-medium hover:bg-gray-50">
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">PRODUCTS</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Shoes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Clothing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Accessories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    New Arrivals
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">SPORTS</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Soccer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Running
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Basketball
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Training
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">COLLECTIONS</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Ultraboost
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Superstar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Gazelle
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Samba
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-base">
                <li>
                  <a href="#" className="hover:underline">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Size Guide
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
          <p className="text-base text-gray-400">SNEAKERS, ACTIVEWEAR AND SPORTING GOODS</p>
        </div>
      </div>
    </div>
  )
}
