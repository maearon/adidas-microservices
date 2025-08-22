"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Pause, Play, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function HeroBannerVideo() {
  const pathname = usePathname()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [loopCount, setLoopCount] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const MAX_LOOP_COUNT: number | "forever" = "forever" // chỉnh nếu muốn loop giới hạn
  const SLOW_RATE = 1 // phát chậm

  // Callback khi video kết thúc
  const handleEnded = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    setLoopCount((prev) => {
      const newCount = prev + 1
      if (MAX_LOOP_COUNT !== "forever" && newCount >= MAX_LOOP_COUNT) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.currentTime = 0
        video.playbackRate = SLOW_RATE
        video.play().catch(() => setIsPlaying(false))
      }
      return newCount
    })
  }, [MAX_LOOP_COUNT])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = SLOW_RATE

    video.play()
      .then(() => setIsPlaying(!video.paused))
      .catch(() => setIsPlaying(false))

    // Luôn nghe ended, kể cả forever
    video.addEventListener("ended", handleEnded)
    return () => video.removeEventListener("ended", handleEnded)
  }, [handleEnded])

  // Pause khi mở modal
  useEffect(() => {
    const video = videoRef.current
    if (video && showVideo) {
      video.pause()
      setIsPlaying(false)
    }
  }, [showVideo])

  const handleToggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.playbackRate = SLOW_RATE
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // 🔹 Video sources tách riêng
  const DESKTOP_VIDEO =
    "/assets/videos/global_superstar_originals_fw25_launch_hp_banner_hero_1_d_888c420cb5.mp4"
  const MEDIUM_VIDEO =
    "/assets/videos/global_superstar_originals_fw25_launch_hp_banner_hero_1_m_d995f0eb96.mp4"
  const MOBILE_VIDEO =
    "/assets/videos/global_superstar_originals_fw25_launch_hp_banner_hero_1_t_950d8ded70.mp4"
  // const DESKTOP_VIDEO =
  //   "/assets/videos/SƠN TÙNG M-TP _ THERE'S NO ONE AT ALL _ OFFICIAL MUSIC VIDEO.mp4"
  // const MEDIUM_VIDEO =
  //   "/assets/videos/SƠN TÙNG M-TP _ THERE'S NO ONE AT ALL _ OFFICIAL MUSIC VIDEO.mp4"
  // const MOBILE_VIDEO =
  //   "/assets/videos/SƠN TÙNG M-TP _ THERE'S NO ONE AT ALL _ OFFICIAL MUSIC VIDEO.mp4"

  return (
    <section className="relative h-[83vh] overflow-hidden bg-white">
      {/* Video nền */}
      <video
        key={pathname}
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted={isMuted}
        playsInline
        preload="auto"
      >
        <source
          src={DESKTOP_VIDEO}
          type="video/mp4"
          media="(min-width: 1280px)"
        />
        <source
          src={MEDIUM_VIDEO}
          type="video/mp4"
          media="(min-width: 1024px)"
        />
        <source
          src={MOBILE_VIDEO}
          type="video/mp4"
          media="(max-width: 768px)"
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
        aria-label={isPlaying ? "Pause video" : "Play video"}
        className="absolute top-5 right-16 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 transition"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </Button>

      {/* Nút mute/unmute */}
      <Button
        onClick={toggleMute}
        size="icon"
        variant="ghost"
        shadow={false}
        fullWidth={false}
        showArrow={false}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute top-5 right-5 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 transition"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </Button>

      {/* Loop counter */}
      <div className="absolute top-16 right-5 z-20 text-xs text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
        {MAX_LOOP_COUNT !== "forever"
          ? <>🔁 Played: {loopCount} / {MAX_LOOP_COUNT}</>
          : <>🔁 Played: {loopCount} / ∞</>}
      </div>

      {/* Overlay nội dung */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11 text-white">
        <div className="w-full max-w-md text-left">
          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="bg-white text-black text-lg sm:text-xl font-extrabold px-1.5 py-0.5 w-fit tracking-tight uppercase">
              SUPERSTAR
            </h1>
            <p className="bg-white text-black text-xs sm:text-base px-1.5 py-0.5 w-fit leading-snug">
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
                  sizeClass="h-8 px-3"
                  className="bg-white text-black py-1 border border-black rounded-none font-semibold hover:bg-gray-100 transition-colors"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal YouTube video */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-2xl"
              aria-label="Close video modal"
            >
              ✕
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/q_7I5ilVax4?autoplay=1"
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
