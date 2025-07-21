"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function HeroBannerSecond() {
  const router = useRouter()
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative h-[83vh] bg-hero-women bg-cover bg-top text-white">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11 text-white">
        <div className="w-full max-w-md text-left">
          <div className="flex flex-col gap-2 sm:gap-3">
          {/* Tiêu đề */}
          <h1 className="bg-white text-black text-lg sm:text-xl font-extrabold px-1.5 py-0.5 w-fit tracking-tight uppercase">
            PAST, PRESENT, FUTURE
          </h1>

          {/* Mô tả */}
          <p className="bg-white text-black text-xs sm:text-sm px-1.5 py-0.5 w-fit leading-snug">
            Explore the Superstar, now updated for the next generation.
          </p>

          {/* Các nút CTA */}
          {/* Overlay nội dung */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11 text-white">
            <div className="w-full max-w-md text-left">
              <div className="flex flex-col gap-2 sm:gap-3">
                <h1 className="bg-white text-black text-lg sm:text-xl font-extrabold px-1.5 py-0.5 w-fit tracking-tight uppercase">
                  SUPERSTAR
                </h1>
                <p className="bg-white text-black text-xs sm:text-sm px-1.5 py-0.5 w-fit leading-snug">
                  Because icons wear the original icon.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-2 pt-1">
                  {[
                    { label: "MEN", href: "/men-superstar" },
                    { label: "WOMEN", href: "/women-superstar" },
                    { label: "KIDS", href: "/kids-superstar" },
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
                      className="bg-white text-black py-1 border border-black rounded-none font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {label}
                    </Button>
                  ))}
                  <Button
                    theme="white"
                    size="sm"
                    border
                    shadow={false}
                    fullWidth={false}
                    variant="outline"
                    showArrow={false}
                    onClick={() => setShowVideo(true)}
                    className="border border-black text-black font-bold px-2 py-1 text-xs rounded-none hover:bg-gray-100 transition w-auto h-9 inline-flex items-center gap-1"
                  >
                    <Play className="h-3.5 w-3.5" />
                    WATCH VIDEO
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
                src="https://www.youtube.com/embed/j_DH0d9S7tw?si=cTB-Rtn3JGdEsWf5"
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
