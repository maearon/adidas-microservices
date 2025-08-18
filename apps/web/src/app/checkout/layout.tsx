import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Providers } from "@/components/providers"
import CheckoutHeader from "@/app/checkout/checkout-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Checkout - Adidas",
  description: "Complete your adidas purchase",
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <CheckoutHeader />
            {children}
            <CheckoutFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}

function CheckoutFooter() {
  return (
    <footer className="bg-gray-800 text-background py-6 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center text-base">
          <div className="flex items-center space-x-4">
            <span>📞 Questions? 1-800-982-9337</span>
            <span>|</span>
            <span>💬 8AM ET - 11PM ET, 7 days a week</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-base mt-4">
          <div className="flex items-center space-x-4">
            <span>Your Privacy Choices</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-4 bg-blue-600 rounded"></div>
              <span>✗</span>
            </div>
            <span>|</span>
            <a href="#" className="hover:underline">
              Privacy Statement
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Terms and Conditions
            </a>
          </div>
          <div className="text-gray-400">© 2025 adidas America Inc.</div>
        </div>
      </div>
    </footer>
  )
}
