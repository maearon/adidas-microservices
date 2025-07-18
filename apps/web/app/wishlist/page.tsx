"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Navbar"
import Footer from "@/components/footer"
import WishButton from "@/components/wish-button"

export default function WishlistPage() {
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const handleAddToBag = (item: any) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        color: "Default",
        size: "M",
      }),
    )
  }

  // Empty wishlist view
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="flex-grow container mx-auto px-2 py-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">MY WISHLIST</h1>
            <p className="text-gray-600 mb-2">0 ITEMS</p>
            <p className="text-gray-600 mb-4">
              You haven't saved any items to your wishlist yet. Start shopping and add your favorite items to your
              wishlist.
            </p>

            {/* App promotion section */}
            <div className="bg-gray-100 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Get more from your wishlist through the app</h2>
              <ul className="space-y-3 mb-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Instant notifications on items on sale or low in stock
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  Share your wishlist with friends and family
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                  See which wishlist items are eligible for a voucher
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold mb-2">Scan to download the adidas app</p>
                </div>
                <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center">
                  <span className="text-xs">QR CODE</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  // Wishlist with items view
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto px-2 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">MY WISHLIST</h1>
          <p className="text-gray-600 mb-4">{wishlistItems.length} ITEMS</p>

          {/* Wishlist items grid */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="relative mb-4">
                    <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 right-4">
                      <WishButton item={item} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold">{item.price}</p>
                    <h3 className="text-sm text-gray-700">{item.name}</h3>
                    <Button
                      className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={() => handleAddToBag(item)}
                    >
                      ADD TO BAG
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* App promotion section */}
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Get more from your wishlist through the app</h2>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                Instant notifications on items on sale or low in stock
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                Share your wishlist with friends and family
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                See which wishlist items are eligible for a voucher
              </li>
            </ul>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold mb-2">Scan to download the adidas app</p>
              </div>
              <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center">
                <span className="text-xs">QR CODE</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
