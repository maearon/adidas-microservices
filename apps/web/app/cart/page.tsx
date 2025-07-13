"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, X, ChevronDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { removeFromCart, updateQuantity } from "@/store/cartSlice"
import { addToWishlist } from "@/store/wishlistSlice"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)

  // Function to remove item from cart
  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id))
  }

  // Function to move item to wishlist
  const handleMoveToWishlist = (item: any) => {
    // Add to wishlist
    dispatch(
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      }),
    )
    // Remove from cart
    dispatch(removeFromCart(item.id))
  }

  // Function to update item quantity
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.price.replace("$", "")) * item.quantity,
    0,
  )
  const salesTax = subtotal * 0.12 // Assuming 12% tax rate
  const total = subtotal + salesTax
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="flex-grow container mx-auto px-2 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">YOUR BAG IS EMPTY</h1>
            <p className="text-gray-600 mb-8">
              Once you add something to your bag, it will appear here. Ready to get started?
            </p>
            <Link href="/">
              <Button theme="black" shadow={true} pressEffect={true}>
                GET STARTED
              </Button>
            </Link>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  // Cart with items view
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-100 p-4 mb-6">
                <h2 className="font-bold">HI, MANH!</h2>
              </div>

              <h1 className="text-2xl font-bold mb-2">YOUR BAG</h1>
              <p className="text-gray-600 mb-4">
                TOTAL: ({totalItems} items) ${subtotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Items in your bag are not reserved — check out now to make them yours.
              </p>

              {/* Cart items */}
              {cartItems.map((item) => (
                <Card key={item.id} className="mb-4 border rounded-none">
                  <div className="flex p-4">
                    <div className="w-1/4 pr-4">
                      <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-auto" />
                    </div>
                    <div className="w-3/4 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.color}</p>
                          <p className="text-sm text-gray-600">SIZE: {item.size}</p>
                          {item.customization && (
                            <>
                              <p className="text-sm text-gray-600">NAME: {item.customization.name}</p>
                              <p className="text-sm text-gray-600">NUMBER: {item.customization.number}</p>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            ${(Number.parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                          </p>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-gray-500 hover:text-black">
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="relative">
                          <select
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value))}
                            className="appearance-none border border-gray-300 py-2 pl-4 pr-10 rounded"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-3 pointer-events-none" />
                        </div>
                        <button className="text-gray-600 hover:text-black" onClick={() => handleMoveToWishlist(item)}>
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Custom design notice */}
              <div className="bg-gray-100 p-4 mb-6 text-sm">
                <p>
                  We start working on your custom design right away. As a result, no changes can be made after order is
                  placed. Customized products can only be returned in case of manufacturing defects.
                </p>
              </div>

              {/* Payment options */}
              <div className="mt-12 border-t pt-6">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm">Pay over time in interest-free installments with Affirm, Klarna or Afterpay</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm">Free shipping with adiClub</p>
                </div>
              </div>
            </div>

            {/* Right column - Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <h2 className="text-lg font-bold mb-4">ORDER SUMMARY</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>{totalItems} Items</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax</span>
                    <span>${salesTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold border-t border-b py-4 mb-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Checkout buttons */}
                <Link href="/checkout">
                  <Button theme="black" shadow={true} pressEffect={true}>
                    CHECKOUT
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
