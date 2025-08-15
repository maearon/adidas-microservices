"use client"

import { Button } from "@/components/ui/button"

export default function HeroBannerThreePanel() {
  return (
    <section className="relative h-[500px] bg-gray-100 overflow-hidden">
      {/* Hero Section - Three Panel Layout */}
      <div className="grid grid-cols-3 h-full">
          {/* Left panel */}
          <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.png?height=500&width=400')" }}
          >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-2xl font-bold mb-2">ADIZERO EVO SL</h2>
              <p className="text-base mb-4">Fast feels. For the speed of the city.</p>
              <Button variant="outline" className="bg-white text-black hover:bg-gray-100 font-bold">
              SHOP NOW →
              </Button>
          </div>
          </div>

          {/* Center panel */}
          <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.png?height=500&width=400')" }}
          >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>

          {/* Right panel */}
          <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.png?height=500&width=400')" }}
          >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
      </div>
    </section>
  )
}
