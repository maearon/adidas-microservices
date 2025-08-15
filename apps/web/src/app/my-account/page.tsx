"use client"

import { useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { selectUser } from "@/store/sessionSlice"
import Link from "next/link"
import { Heart } from "lucide-react"

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState("FEED")
  const userData = useAppSelector(selectUser)

  const tabs = [
    { id: "FEED", label: "FEED" },
    { id: "ORDERS", label: "ORDERS" },
    { id: "ACCOUNT", label: "ACCOUNT" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header Section */}
      <div className="bg-white dark:bg-black border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">HI {userData.value?.name?.toUpperCase() || "MANH"}</h1>
              <div className="flex items-center mt-2">
                <span className="text-base text-gray-600 dark:text-white mr-2">👑</span>
                <span className="text-base text-gray-600 dark:text-white">0 points to spend</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">adiclub</div>
              <div className="text-base">LEVEL 1</div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-8 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 font-medium ${
                  activeTab === tab.id ? "border-b-2 border-border text-black dark:text-white" : "text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "FEED" && (
          <div className="space-y-8">
            {/* Your Vouchers */}
            <div className="bg-white dark:bg-black rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">YOUR VOUCHERS</h2>
              <p className="text-gray-600 dark:text-white mb-2">You don&apos;t have any vouchers currently.</p>
              <p className="text-gray-600 dark:text-white mb-4">
                You currently don&apos;t have enough adiClub points to unlock discount vouchers.
              </p>
              <Link href="#" className="text-background underline font-medium">
                HOW TO EARN MORE POINTS
              </Link>
            </div>

            {/* More of What You Love */}
            <div className="bg-white dark:bg-black rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">MORE OF WHAT YOU LOVE</h2>
              <p className="text-gray-600 dark:text-white mb-6">
                We&apos;ve collected some of our favourite products based on your preferences and purchases.
              </p>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="group cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=300&width=300`}
                        alt="Product"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="font-medium mb-1">Product Name</h3>
                    <p className="text-gray-600 dark:text-white text-base mb-2">Category</p>
                    <p className="font-bold">$120.00</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ORDERS" && (
          <div className="bg-white dark:bg-black rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">NO ORDERS YET</h2>
            <p className="text-gray-600 dark:text-white mb-6">Once you place an order, it will appear here.</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition"
            >
              START SHOPPING
            </Link>
          </div>
        )}

        {activeTab === "ACCOUNT" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-black rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">ACCOUNT OVERVIEW</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-4">PERSONAL INFORMATION</h3>
                  <Link
                    href="/my-account/profile"
                    className="text-black dark:text-white hover:underline flex items-center justify-between p-3 border rounded"
                  >
                    <span>Edit your personal details</span>
                    <span>→</span>
                  </Link>
                </div>
                <div>
                  <h3 className="font-bold mb-4">ADDRESS BOOK</h3>
                  <Link
                    href="/my-account/addresses"
                    className="text-black dark:text-white hover:underline flex items-center justify-between p-3 border rounded"
                  >
                    <span>Manage your addresses</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">PREFERENCES</h2>
              <div className="space-y-3">
                <Link
                  href="/my-account/preferences"
                  className="flex items-center justify-between p-3 border rounded hover:bg-white dark:hover:bg-black"
                >
                  <span>Communication preferences</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/my-account/size-profile"
                  className="flex items-center justify-between p-3 border rounded hover:bg-white dark:hover:bg-black"
                >
                  <span>Size profile</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
