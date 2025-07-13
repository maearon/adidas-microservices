"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { BaseButton } from "@/components/ui/base-button"

export default function HeroBannerVideo() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loopCount, setLoopCount] = useState(0)

  const MAX_LOOP_COUNT = 2 // ✅ Số lần lặp video rồi dừng hẳn

  // Xử lý tự play khi load
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => setIsPlaying(false))
    }

    const handleEnded = () => {
      setLoopCount((prev) => {
        const newCount = prev + 1
        if (newCount >= MAX_LOOP_COUNT) {
          video?.pause()
          setIsPlaying(false)
        } else {
          video?.play()
        }
        return newCount
      })
    }

    video?.addEventListener("ended", handleEnded)
    return () => {
      video?.removeEventListener("ended", handleEnded)
    }
  }, [])

  // Toggle video play/pause
  const handleToggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <section className="relative h-[80vh] mb-10 overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
        playsInline
        preload="auto"
      >
        <source
          src="/assets/videos/global_superstar_originals_fw25_launch_hp_banner_hero_1_d_888c420cb5.mp4"
          type="video/mp4"
          media="(min-width: 1024px)"
        />
        <source
          src="/assets/videos/global_superstar_originals_fw25_launch_hp_banner_hero_1_m_d995f0eb96.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <source
          src="/assets/videos/global_superstar_originals_fw25_launch_hp_banner_hero_1_t_950d8ded70.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause button */}
      <button
        onClick={handleToggle}
        className="absolute top-5 right-5 z-10 bg-white/70 hover:bg-white text-black rounded-full p-2 transition"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 md:px-3 lg:px-10 xl:px-20 h-full flex items-end pb-11 text-white">
        <div className="max-w-md">
          {/* Title */}
          <h1 className="inline-block bg-white text-black text-base sm:text-lg md:text-xl font-bold px-1.5 py-0.5 mb-2 tracking-tight">
            PAST, PRESENT, FUTURE
          </h1>

          {/* Description */}
          <p className="inline-block bg-white text-black text-xs sm:text-sm px-1.5 py-0.5 mb-4 leading-snug">
            Explore the Superstar, now updated for the next generation.
          </p>

          {/* CTA Buttons */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "SHOP WOMEN", href: "/women-superstar" },
              { label: "SHOP MEN", href: "/men-superstar" },
              { label: "SHOP KIDS", href: "/kids-superstar" },
            ].map(({ label, href }) => (
              <BaseButton
                key={label}
                size="sm"
                variant="outline"
                onClick={() => router.push(href)}
                className="border border-black text-black font-bold px-2 py-1 text-[11px] sm:text-xs rounded-none hover:bg-gray-100 transition w-full"
              >
                {label} <span aria-hidden className="px-2 md:px-2">→</span>
              </BaseButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
