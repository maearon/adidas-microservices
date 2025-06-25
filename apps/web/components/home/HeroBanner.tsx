"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

export default function HeroBanner() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative h-[70vh] bg-gradient-to-r from-black to-gray-800 text-white">
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/lib/originals_fw25_tatemcraesuperstar_bnr_sustain_d_9bf87fca6e.jpg?height=800&width=1200')",
        }}
      />

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">IMPOSSIBLE IS NOTHING</h1>
            <p className="text-xl mb-8">
              Khám phá bộ sưu tập mới nhất từ adidas. Giày dép, quần áo và phụ kiện thể thao chính hãng.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Mua ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-black hover:text-white"
                onClick={() => setShowVideo(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                Xem video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-4xl w-full mx-4">
            <button onClick={() => setShowVideo(false)} className="absolute -top-12 right-0 text-white text-2xl">
              ✕
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/A6ARaYK1UUQ?si=PWa6JjaJoW6AaMtS&autoplay=1"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
