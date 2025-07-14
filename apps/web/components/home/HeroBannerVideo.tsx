"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroBannerVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loopCount, setLoopCount] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  const MAX_LOOP_COUNT: number | "forever" = "forever"
  const SLOW_RATE = 0.125 // chậm 8x

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = SLOW_RATE
    if (MAX_LOOP_COUNT === "forever") video.loop = true

    video.play()
      .then(() => setIsPlaying(!video.paused))
      .catch(() => setIsPlaying(false))

    if (MAX_LOOP_COUNT !== "forever") {
      const handleEnded = () => {
        setLoopCount((prev) => {
          const newCount = prev + 1
          if (newCount >= MAX_LOOP_COUNT) {
            video.pause()
            setIsPlaying(false)
          } else {
            video.currentTime = 0
            video.playbackRate = SLOW_RATE
            video.play()
          }
          return newCount
        })
      }
      video.addEventListener("ended", handleEnded)
      return () => video.removeEventListener("ended", handleEnded)
    }
  }, [MAX_LOOP_COUNT])

  const handleToggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.playbackRate = SLOW_RATE
      video.play().then(() => setIsPlaying(true))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <section className="relative h-[80vh] overflow-hidden bg-white">
      {/* Video nền */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
        muted
        playsInline
        preload="auto"
        loop={MAX_LOOP_COUNT === "forever" ? true : undefined}
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

      {/* Nút play/pause */}
      <Button
        onClick={handleToggle}
        size="icon"
        variant="ghost"
        shadow={false}
        fullWidth={false}
        showArrow={false}
        className="absolute top-5 right-5 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 transition"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </Button>

      {/* Nội dung overlay */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11 text-white">
        <div className="w-full max-w-md text-left">
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Tiêu đề */}
            <h1 className="bg-white text-black text-lg sm:text-xl font-extrabold px-1.5 py-0.5 w-fit tracking-tight uppercase">
              SUPERSTAR
            </h1>

            {/* Mô tả */}
            <p className="bg-white text-black text-xs sm:text-sm px-1.5 py-0.5 w-fit leading-snug">
              Because icons wear the original icon.
            </p>

            {/* Các nút CTA */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-2 pt-1">
              {[
                { label: "MEN'S SUPERSTAR", href: "/men-superstar" },
                { label: "WOMEN'S SUPERSTAR", href: "/women-superstar" },
                { label: "KIDS' SUPERSTAR", href: "/kids-superstar" },
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
                  className="border border-black text-black font-bold px-2 py-1 text-xs rounded-none hover:bg-gray-100 transition w-auto h-9"
                >
                  {label}
                </Button>
              ))}

              {/* Nút WATCH VIDEO */}
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
