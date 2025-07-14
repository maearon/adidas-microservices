"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function HeroBannerSecond() {
  const router = useRouter()
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative h-[80vh] bg-hero-women bg-cover bg-top text-white mb-10">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11">
        <div className="max-w-md">
          {/* Tiêu đề */}
          <h1 className="inline-block bg-white text-black text-base sm:text-lg font-bold px-1.5 py-0.5 mb-2 tracking-tight uppercase">
            PAST, PRESENT, FUTURE
          </h1>

          {/* Mô tả */}
          <p className="inline-block bg-white text-black text-xs sm:text-sm px-1.5 py-0.5 mb-4 leading-snug">
            Explore the Superstar, now updated for the next generation.
          </p>

          {/* Các nút CTA */}
          <div className="flex flex-wrap items-start gap-2">
            {[
              { label: "SHOP WOMEN", href: "/women-superstar" },
              { label: "SHOP MEN", href: "/men-superstar" },
              { label: "SHOP KIDS", href: "/kids-superstar" },
            ].map(({ label, href }) => (
              <Button
                key={label}
                theme="white"
                size="sm"
                border
                shadow={false}
                fullWidth={false}
                variant="outline"
                href={href}
                showArrow
                className="border border-black text-black font-bold px-2 py-1 text-[11px] sm:text-xs rounded-none hover:bg-gray-100 transition w-auto h-9"
              >
                {label}
              </Button>
            ))}

            {/* WATCH VIDEO */}
            <Button
              theme="white"
              size="sm"
              border
              shadow={false}
              fullWidth={false}
              variant="outline"
              showArrow={false}
              onClick={() => setShowVideo(true)}
              className="border border-black text-black font-bold px-2 py-1 text-[11px] sm:text-xs rounded-none hover:bg-gray-100 transition w-auto h-9 inline-flex items-center gap-1"
            >
              <Play className="h-3.5 w-3.5" />
              WATCH VIDEO
            </Button>
          </div>
        </div>
      </div>

      {/* Modal video YouTube */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-2xl"
            >
              ✕
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/q_7I5ilVax4?si=iqVV3NY5j_cPBe77&autoplay=1"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
