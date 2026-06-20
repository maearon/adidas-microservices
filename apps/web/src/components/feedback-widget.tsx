"use client"

import * as React from "react"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import AdidasLogo from "@/components/adidas-logo"
import { toast } from "react-toastify"
import { useTranslations } from "@/hooks/useTranslations"

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
}: {
  onClick: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(FEEDBACK_TAB_CLASS, className)}
      style={FEEDBACK_TAB_STYLE}
    >
      {label}
    </button>
  )
}

export default function FeedbackWidget() {
  const t = useTranslations("feedback")
  const [isClosed, setIsClosed] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [rating, setRating] = React.useState<number | null>(null)
  const [improvement, setImprovement] = React.useState("")

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
    if (isOpen) setIsClosed(true)
  }

  const handleSubmit = () => {
    console.log("Feedback rating:", rating, "improvement:", improvement)
    setIsOpen(false)
    setIsClosed(true)
    setRating(null)
    setImprovement("")
    toast("Thank you for feedback!")
  }

  if (isClosed) return null

  const feedbackLabel = t?.feedback || "FEEDBACK"

  return (
    <>
      {!isOpen && (
        <FeedbackTab
          onClick={togglePanel}
          label={feedbackLabel}
          className="fixed right-0 top-1/2 z-[60] -translate-y-1/2"
        />
      )}

      <div
        className={cn(
          "fixed z-[70] flex h-svh min-h-svh bg-white transition-transform duration-700 ease-in-out dark:bg-black",
          "inset-y-0 right-0 w-full max-w-[calc(100vw-0px)] sm:max-w-[calc(28rem+3.25rem)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <FeedbackTab
          onClick={togglePanel}
          label={feedbackLabel}
          className={cn("self-center", !isOpen && "pointer-events-none opacity-0")}
        />

        <div className="flex h-svh min-h-0 min-w-0 flex-1 flex-col bg-white shadow-2xl dark:bg-black sm:max-w-md sm:w-[28rem]">
          <div className="flex shrink-0 items-center justify-between border-b p-6">
            <AdidasLogo />
            <button
              type="button"
              onClick={togglePanel}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-900"
              aria-label="Close feedback"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                {t?.yourExperience || "YOUR EXPERIENCE"}
              </h2>

              <a
                href="#"
                className="inline-block text-base font-medium underline hover:no-underline"
              >
                {t?.getHelp || "GET HELP"}
              </a>

              <p className="text-base leading-relaxed">
                {t?.tellItLikeItIs ||
                  "Don't hold back. Good or bad - tell it like it is."}
              </p>

              <div className="space-y-4">
                <p className="text-base font-medium">
                  {t?.howLikelyRecommend ||
                    "How likely are you to recommend adidas.com to a friend?"}{" "}
                  <span className="text-red-500">*</span>
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>{t?.veryUnlikely || "Very unlikely"}</span>
                    <span>{t?.veryLikely || "Very likely"}</span>
                  </div>

                  <div className="flex justify-between gap-1">
                    {Array.from({ length: 11 }, (_, i) => (
                      <label
                        key={i}
                        className="flex cursor-pointer flex-col items-center space-y-1"
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
                  "inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-white transition-colors",
                  "bg-black hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:disabled:bg-gray-600",
                )}
              >
                <span>{t?.nextLabel ?? "NEXT"}</span>
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>

          <div className="shrink-0 border-t p-6">
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

      {isOpen && (
        <div
          className="fixed inset-0 z-[65] bg-black/50"
          onClick={togglePanel}
          aria-hidden
        />
      )}
    </>
  )
}
