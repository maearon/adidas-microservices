"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/useTranslations"
// import { X } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const t = useTranslations("feedback")

  const handleSubmit = async () => {
    if (rating === null) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Auto close after 2 seconds
    setTimeout(() => {
      onClose()
      setIsSubmitted(false)
      setRating(null)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-0 bg-white border-0 shadow-2xl">
          <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">{t?.thankYou || "Thank You!"}</h2>
            <p className="text-gray-600 dark:text-white">{t?.feedbackSubmitted || "Your feedback has been submitted successfully."}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-white border-0 shadow-2xl">
        <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
        <div className="relative">
          {/* Close button */}
          {/* <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-white" />
          </button> */}

          <div className="p-8">
            {/* Adidas Logo */}
            <div className="flex justify-center mb-6">
              <svg className="h-8 w-12" viewBox="0 0 69 32" fill="currentColor">
                <path d="M8.5 32L0 13.5h5.5L12 26.5 18.5 13.5H24L15.5 32H8.5zM69 13.5v5H45.5v3H69v5H45.5v5.5H69V32H40v-18.5H69zM34.5 13.5L27 32h-6.5l7.5-18.5H34.5z" />
              </svg>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black mb-4">{t?.yourExperience || "YOUR EXPERIENCE"}</h2>

              <div className="mb-6">
                <button className="text-black underline hover:no-underline transition-all">{t?.getHelp || "GET HELP"}</button>
              </div>

              <p className="text-gray-800 mb-2">
                {t?.tellItLikeItIs || "Don't hold back. Good or bad - tell it like it is."}
              </p>
            </div>

            {/* Rating Question */}
            <div className="mb-8">
              <p className="text-gray-800 mb-4">
                {t?.howLikelyRecommend || "How likely are you to recommend adidas.com to a friend?"}{" "}
                <span className="text-red-500">*</span>
              </p>

              {/* Rating Scale */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-600 dark:text-white">{t?.veryUnlikely || "Very unlikely"}</span>
                  <span className="text-base text-gray-600 dark:text-white">{t?.veryLikely || "Very likely"}</span>
                </div>

                <div className="flex justify-between items-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <button
                        onClick={() => setRating(value)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          rating === value ? "bg-black border-black" : "bg-white border-gray-300 hover:border-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-600 dark:text-white mt-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-start">
              <Button
                onClick={handleSubmit}
                disabled={rating === null || isSubmitting}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3 font-medium disabled:opacity-50"
              >
                {isSubmitting ? (t?.submitting || "SUBMITTING...") : (t?.next || "NEXT →")}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                {t?.protectedByRecaptcha || "Protected by reCAPTCHA:"}{" "}
                <a href="#" className="underline">
                  {t?.privacy || "Privacy"}
                </a>{" "}
                &{" "}
                <a href="#" className="underline">
                  {t?.terms || "Terms"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
