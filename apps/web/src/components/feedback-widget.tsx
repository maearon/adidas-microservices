"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import AdidasLogo from "@/components/adidas-logo"
import { 
  // ToastContainer, 
  toast 
} from 'react-toastify'
import { useTranslations } from "@/hooks/useTranslations"

export default function FeedbackWidget() {
  const t = useTranslations("feedback");
  const [isClosed, setIsClosed] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [rating, setRating] = React.useState<number | null>(null)

  const togglePanel = () => { 
    setIsOpen(!isOpen); 

    if (isOpen) {
      setIsClosed(true) 
    }
  }

  const handleSubmit = () => {
    // TODO: send to backend
    console.log("Feedback rating:", rating)
    setIsOpen(false)
    setIsClosed(true)
    setRating(null)
    // toast("😊Thank you for feedback!")
    toast("Thank you for feedback!")
  }

  if (isClosed) return null

  return (
    <>
      {/* Fixed FEEDBACK button - sát lề phải */}
      <button
        onClick={togglePanel}
        className={cn(
          "fixed right-0 top-1/2 z-40 -translate-y-1/2 rotate-180",
          "bg-[#EBEBEB] text-[#616363] border border-[#616363] transition-colors",
          "px-3 sm:px-6 py-1 sm:py-2 text-base font-extrabold tracking-wider",
        )}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        {t?.feedback || "FEEDBACK"}
      </button>

      {/* Sliding panel from right */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-96 bg-white dark:bg-black shadow-2xl",
          "transition-all duration-700 ease-in-out",
          "will-change-transform transform-style-3d backface-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel content */}
        <div className="flex h-full flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center space-x-3">
              {/* Adidas logo */}
              {/* <div className="h-8 w-12 bg-black" /> */}
              <AdidasLogo />
            </div>
            <button onClick={togglePanel} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{t?.yourExperience || "YOUR EXPERIENCE"}</h2>

              <div className="space-y-2">
                <a href="#" className="inline-block text-base font-medium underline hover:no-underline">
                  {t?.getHelp || "GET HELP"}
                </a>
              </div>

              <p className="text-base leading-relaxed">
                {/* Don&apos;t hold back. Good or bad - <span className="font-semibold">tell it like it is</span>. */}
                {t?.tellItLikeItIs || "Don't hold back. Good or bad - tell it like it is."}
              </p>

              <div className="space-y-4">
                <p className="text-base font-medium">
                  {/* How likely are you to recommend <span className="font-bold">adidas.com</span> to a friend?{" "} */}
                  {t?.howLikelyRecommend || "How likely are you to recommend adidas.com to a friend?"}{" "}
                  <span className="text-red-500">*</span>
                </p>

                {/* Rating scale */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-white">
                    <span>{t?.veryUnlikely || "Very unlikely"}</span>
                    <span>{t?.veryLikely || "Very likely"}</span>
                  </div>

                  <div className="flex justify-between">
                    {Array.from({ length: 11 }, (_, i) => (
                      <label key={i} className="flex flex-col items-center space-y-1">
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

              <button
                onClick={handleSubmit}
                disabled={rating === null}
                className={cn(
                  "w-full py-3 px-6 text-base font-bold text-white dark:text-black",
                  "bg-black dark:bg-white hover:bg-gray-800 disabled:bg-gray-300",
                  "disabled:cursor-not-allowed transition-colors",
                  "flex items-center justify-center space-x-2",
                )}
              >
                <span>{t?.next || "NEXT →"}</span>
                {/* <span>→</span> */}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6">
            <p className="text-center text-xs text-gray-500">
              {/* Protected by reCAPTCHA:{" "} */}
              {t?.protectedByRecaptcha || "Protected by reCAPTCHA:"}{" "}
              <a href="#" className="underline hover:no-underline">
                {/* Privacy */}
                {t?.privacy || "Privacy"}
              </a>{" "}
              &{" "}
              <a href="#" className="underline hover:no-underline">
                {/* Terms */}
                {t?.terms || "Terms"}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.5)]" onClick={togglePanel} />}
    </>
  )
}
