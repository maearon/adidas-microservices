"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronDown, ChevronUp, Heart } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import { toggleWishlist } from "@/store/wishlistSlice"
import Header from "@/components/Navbar"
import Footer from "@/components/footer"
import WishButton from "@/components/wish-button"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { ProductDetails } from "@/types/product/product"
import javaService from "@/api/services/javaService"

// Mock product data - in real app this would come from API
const getProductById = (id: string) => {
  const products = {
    "1": {
      id: 1,
      name: "OWN THE RUN SHORTS",
      price: "$18",
      originalPrice: "$30",
      discount: "-40%",
      rating: 4.5,
      reviewCount: 1247,
      images: [
        "/placeholder.png?height=600&width=400",
        "/placeholder.png?height=600&width=400",
        "/placeholder.png?height=600&width=400",
        "/placeholder.png?height=600&width=400",
      ],
      colors: [
        { name: "Medium Grey Heather", color: "bg-gray-400", selected: true },
        { name: "Black", color: "bg-black" },
        { name: "Navy", color: "bg-blue-900" },
        { name: "White", color: "bg-white border" },
        { name: "Red", color: "bg-red-600" },
        { name: "Green", color: "bg-green-600" },
        { name: "Blue", color: "bg-blue-600" },
        { name: "Yellow", color: "bg-yellow-400" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      features: ["Get delivery dates", "Free shipping with adiClub", "Free 30 day returns"],
      description: "These versatile running shorts are designed for comfort and performance during your workouts.",
      details: "Made with recycled materials as part of our commitment to help end plastic waste.",
      care: "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
      sizeGuide: "Regular fit. Inseam: 5 inches.",
    },
    // Add more products as needed
  }

  return products[id as keyof typeof products] || products["1"]
}

const ProductDetailPage = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const [page] = useState(1)
  const productRails = getProductById(params.id as string)
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sizeError, setSizeError] = useState("")

  const [expandedSections, setExpandedSections] = useState({
    reviews: false,
    description: false,
    details: false,
    care: false,
    sizeStyle: false,
  })

  useEffect(() => {
    const id = params?.id as string
    if (!id) return
    javaService.getProduct(id, { page })
      .then(response => {
        setProduct(response.data)
        setSelectedColor(response.data.variants?.[0]?.color || "")
      })
      .catch(console.error)
  }, [params?.id, page])

  const handleAddToBag = () => {
    if (!selectedSize || !product) {
      setSizeError("Please select your size")
      return
    }

    setSizeError("") // Clear error if size is selected
    dispatch(
      addToCart({
        id: product.id,
        name: product.name ?? "",
        price: (product.variants?.[0]?.price?.toString() ?? "0"),
        image: product.variants?.[0]?.images?.[0] || "/placeholder.png",
        color: selectedColor,
        size: selectedSize,
      })
    )
  }

  const handleToggleWishlist = () => {
    if (!product) return
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.name ?? "",
        price: (product.variants?.[0]?.price?.toString() ?? "0"),
        image: product.variants?.[0]?.images?.[0] || "/placeholder.png",
      })
    )
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSizeError("") // Clear error when size is selected
  }

  const relatedProducts = [
    { id: 2, name: "Own The Run Tee", price: "$25", image: "/placeholder.png?height=200&width=200" },
    { id: 3, name: "Run For The Oceans Jacket", price: "$85", image: "/placeholder.png?height=200&width=200" },
    { id: 4, name: "Adizero Running Shoes", price: "$130", image: "/placeholder.png?height=200&width=200" },
    { id: 5, name: "AEROREADY Socks 3-Pair", price: "$18", image: "/placeholder.png?height=200&width=200" },
  ]

  const youMayLike = [
    { id: 6, name: "Run It 3-Stripes Shorts", price: "$25", image: "/placeholder.png?height=200&width=200" },
    {
      id: 7,
      name: "Designed for Training Workout Shorts",
      price: "$35",
      image: "/placeholder.png?height=200&width=200",
    },
    { id: 8, name: "Speed Split 2-in-1 Shorts", price: "$45", image: "/placeholder.png?height=200&width=200" },
    {
      id: 9,
      name: "Ultimate Running Reflective 2-in-1 Shorts",
      price: "$55",
      image: "/placeholder.png?height=200&width=200",
    },
  ]

  if (!product) return <FullScreenLoader />

  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-base text-gray-600 mb-6">
          <span>← Back / Home / Men</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100">
              <img
                src={product.variants?.[currentImageIndex]?.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.variants?.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-gray-100 border-2 ${
                    currentImageIndex === index ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={variant?.images?.[0] || "/placeholder.png"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              SHOW MORE ↓
            </Button>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(productRails.rating) ? "fill-black text-black" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-base">({productRails.reviewCount})</span>
            </div>

            {/* Product Name and Price */}
            <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">{product.variants[0].price}</span>
                {product.variants[0].originalprice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">{product.variants[0].originalprice}</span>
                    <Badge variant="destructive">{productRails.discount}</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Member Benefits */}
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-bold text-base mb-2">
                💳 Popular with guests who bought this product in the last 30 days
              </p>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-bold mb-3">Colors</h3>
              <div className="grid grid-cols-8 gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(variant.color ?? "")}
                    className={`w-12 h-12 rounded border-2 ${
                      selectedColor === variant.color ? "border-black" : "border-gray-300"
                    }`}
                  >
                    <div className={`w-full h-full rounded ${
                      productRails.colors?.find((c) => c.name === variant.color)?.color || ""
                    }`}></div>
                  </button>
                ))}
              </div>
              <p className="text-base text-gray-600 mt-2">Grey Mel / White Melange</p>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold mb-3">Sizes</h3>
                <button className="text-base underline">Size guide</button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.variants?.[0]?.size?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`py-3 border text-center font-medium ${
                      selectedSize === size ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && <p className="text-red-600 text-base mt-2 font-medium">{sizeError}</p>}
              <button className="text-base underline mt-2">Size is too big? We recommend ordering one size down</button>
            </div>

            {/* Add to Bag */}
            <div className="space-y-4">
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-bold"
                onClick={handleAddToBag}
              >
                ADD TO BAG →
              </Button>

              <div className="flex items-center justify-center space-x-4 text-base">
                <span>Size too big? Try going</span>
                <button className="underline font-bold">one size down</button>
                <span>for the best fit.</span>
                <button className="underline">Learn more</button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {productRails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-base">
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Wishlist Button */}
            <button onClick={handleToggleWishlist} className="flex items-center space-x-2 text-base hover:underline">
              <Heart size={16} className={isWishlisted ? "fill-black text-black" : "text-gray-600"} />
              <span>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
            </button>
           </div>
        </div>

        {/* Expandable Sections */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {/* Reviews */}
          <div className="border-b">
            <button
              onClick={() => toggleSection("reviews")}
              className="w-full flex justify-between items-center py-4 text-left font-bold"
            >
              <span>Reviews ({productRails.reviewCount})</span>
              {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.reviews && (
              <div className="pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{productRails.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(productRails.rating) ? "fill-black text-black" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">Customer reviews and ratings would appear here.</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border-b">
            <button
              onClick={() => toggleSection("description")}
              className="w-full flex justify-between items-center py-4 text-left font-bold"
            >
              <span>Description</span>
              {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.description && (
              <div className="pb-4">
                <p className="text-gray-600">{productRails.description}</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="border-b">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex justify-between items-center py-4 text-left font-bold"
            >
              <span>Details</span>
              {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.details && (
              <div className="pb-4">
                <p className="text-gray-600">{productRails.details}</p>
              </div>
            )}
          </div>

          {/* Care */}
          <div className="border-b">
            <button
              onClick={() => toggleSection("care")}
              className="w-full flex justify-between items-center py-4 text-left font-bold"
            >
              <span>Care</span>
              {expandedSections.care ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.care && (
              <div className="pb-4">
                <p className="text-gray-600">{product.care}</p>
              </div>
            )}
          </div>

          {/* Size & Style */}
          <div className="border-b">
            <button
              onClick={() => toggleSection("sizeStyle")}
              className="w-full flex justify-between items-center py-4 text-left font-bold"
            >
              <span>Size & style</span>
              {expandedSections.sizeStyle ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.sizeStyle && (
              <div className="pb-4">
                <p className="text-gray-600">{productRails.sizeGuide}</p>
              </div>
            )}
          </div>
        </div>

        {/* Complete the Look */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">COMPLETE THE LOOK</h2>
          <div className="grid grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Card key={item.id} className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="relative mb-4">
                    <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-48 object-cover" />
                    <WishButton item={item} className="absolute top-4 right-4" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">{item.price}</p>
                    <h3 className="text-base text-gray-700">{item.name}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* You May Also Like */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-4 gap-6">
            {youMayLike.map((item) => (
              <Card key={item.id} className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="relative mb-4">
                    <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-48 object-cover" />
                    <WishButton item={item} className="absolute top-4 right-4" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">{item.price}</p>
                    <h3 className="text-base text-gray-700">{item.name}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  )
}

export default ProductDetailPage;
