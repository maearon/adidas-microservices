"use client"

import * as React from "react"
import { ArrowRight, X } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import AdidasLogo from "@/components/adidas-logo"
import { toast } from "react-toastify"
import { useTranslations } from "@/hooks/useTranslations"
import { Z } from "@/lib/z-index"

const FEEDBACK_TAB_CLASS =
  "shrink-0 rotate-180 border border-[#616363] bg-[#EBEBEB] px-6 py-2 text-base font-extrabold tracking-wider text-[#616363] transition-colors hover:bg-[#e0e0e0]"

const FEEDBACK_TAB_STYLE: React.CSSProperties = {
  writingMode: "vertical-rl",
  textOrientation: "mixed",
}

function FeedbackTab({
  onClick,
  label,
  className,
  style,
}: {
  onClick: () => void
  label: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(FEEDBACK_TAB_CLASS, className)}
      style={{ ...FEEDBACK_TAB_STYLE, ...style }}
    >
      {label}
    </button>
  )
}

export default function FeedbackWidget() {
  const t = useTranslations("feedback")
  const [mounted, setMounted] = React.useState(false)
  const [isClosed, setIsClosed] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [rating, setRating] = React.useState<number | null>(null)
  const [improvement, setImprovement] = React.useState("")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const openPanel = () => setIsOpen(true)
  const closePanel = () => setIsOpen(false)

  const handleSubmit = () => {
    console.log("Feedback rating:", rating, "improvement:", improvement)
    setRating(null)
    setImprovement("")
    setIsOpen(false)
    setIsClosed(true)
    toast("Thank you for feedback!")
  }

  if (isClosed) return null

  const feedbackLabel = t?.feedback || "FEEDBACK"

  const panel = (
    <>
      <div
        className="fixed inset-0 bg-black/50"
        style={{ zIndex: Z.feedbackBackdrop }}
        onClick={closePanel}
        aria-hidden
      />

      <div
        className="fixed inset-y-0 right-0 flex h-svh min-h-svh"
        style={{ zIndex: Z.feedbackPanel }}
      >
        <FeedbackTab
          onClick={closePanel}
          label={feedbackLabel}
          className="hidden self-center sm:flex"
        />

        <div className="flex h-svh min-h-0 w-full flex-col bg-white shadow-2xl dark:bg-black sm:w-[448px]">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6">
            <AdidasLogo />
            <button
              type="button"
              onClick={closePanel}
              className="p-1"
              aria-label="Close feedback"
            >
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-normal">
                {t?.yourExperience || "YOUR EXPERIENCE"}
              </h2>

              <a
                href="#"
                className="inline-block text-base font-medium underline underline-offset-2 hover:no-underline"
              >
                {t?.getHelp || "GET HELP"}
              </a>

              <p className="text-base leading-relaxed">
                {t?.tellItLikeItIs ||
                  "Don't hold back. Good or bad - tell it like it is."}
              </p>

              <div className="space-y-4">
                <p className="text-base font-medium leading-snug">
                  {t?.howLikelyRecommend ||
                    "How likely are you to recommend adidas.com to a friend?"}{" "}
                  <span className="text-red-500">*</span>
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>{t?.veryUnlikely || "Very unlikely"}</span>
                    <span>{t?.veryLikely || "Very likely"}</span>
                  </div>

                  <div className="flex justify-between gap-0.5 sm:gap-1">
                    {Array.from({ length: 11 }, (_, i) => (
                      <label
                        key={i}
                        className="flex cursor-pointer flex-col items-center gap-1"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={i}
                          checked={rating === i}
                          onChange={() => setRating(i)}
                          className="h-4 w-4 cursor-pointer accent-black"
                        />
                        <span className="text-xs font-medium">{i}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="feedback-improvement"
                  className="block text-base leading-relaxed"
                >
                  {t?.improvementQuestion ||
                    "What is one thing adidas could improve to better support moments like this?"}
                </label>
                <textarea
                  id="feedback-improvement"
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  rows={5}
                  className="w-full resize-y border border-gray-300 bg-white p-3 text-base text-black outline-none focus:border-black dark:border-gray-600 dark:bg-black dark:text-white dark:focus:border-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === null}
                className={cn(
                  "inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide transition-colors",
                  rating === null
                    ? "cursor-not-allowed bg-[#767677] text-white"
                    : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
                )}
              >
                <span>{t?.nextLabel ?? "NEXT"}</span>
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6">
            <p className="text-center text-xs text-gray-500">
              {t?.protectedByRecaptcha || "Protected by reCAPTCHA:"}{" "}
              <a href="#" className="underline hover:no-underline">
                {t?.privacy || "Privacy"}
              </a>{" "}
              &{" "}
              <a href="#" className="underline hover:no-underline">
                {t?.terms || "Terms"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {!isOpen && (
        <FeedbackTab
          onClick={openPanel}
          label={feedbackLabel}
          className="fixed right-0 top-1/2 -translate-y-1/2"
          style={{ zIndex: Z.feedbackTab }}
        />
      )}

      {isOpen && mounted && createPortal(panel, document.body)}
    </>
  )
}
