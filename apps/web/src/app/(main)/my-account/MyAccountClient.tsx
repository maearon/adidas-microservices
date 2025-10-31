"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import AccountHeader from "./AccountHeader"
import OrderHistory from "./order-history/page"
import Profile from "./profile/page"
import type { Session } from "@/lib/auth"
import DashboardPage from "@/app/(main)/dashboard/page"

interface MyAccountClientProps {
  session: Session | null;
}

export default function MyAccountClient({ session }: MyAccountClientProps) {
  const [activeTab, setActiveTab] = useState("FEED")

  const tabs = [
    { id: "FEED", label: "FEED" },
    { id: "ORDERS", label: "ORDERS" },
    { id: "ACCOUNT", label: "ACCOUNT" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header Section */}
      <div className="bg-[#F5F4E7] border-b border-[#D3D7DA]">
        <div className="container mx-auto w-full max-w-7xl px-4 py-8">
          <AccountHeader session={session} />

          {/* Tabs Navigation */}
          <div className="flex w-full justify-center space-x-8 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 font-medium ${
                  activeTab === tab.id ? "border-b-2 border-black text-black" : "text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto w-full max-w-7xl px-4 py-8">
        {activeTab === "FEED" && (
          <div className="space-y-8">
            {/* Personal Info */}
            <DashboardPage session={session} />

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
          <OrderHistory />
        )}

        {activeTab === "ACCOUNT" && (
          <Profile session={session} />
        )}
      </div>
    </div>
  )
}
