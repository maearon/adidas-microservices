"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import AdidasLogo from "@/components/adidas-logo"
import { useToast } from "@/components/ui/use-toast"

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [rating, setRating] = React.useState<number | null>(null)
  const { toast } = useToast()

  const togglePanel = () => setIsOpen(!isOpen)

  const handleSubmit = () => {
    // TODO: send to backend
    console.log("Feedback rating:", rating)
    setIsOpen(false)
    setRating(null)
    toast({
      title: "😊",
      description: "Thank you for feedback!",
    })
  }

  return (
    <>
      {/* Fixed FEEDBACK button - sát lề phải */}
      <button
        onClick={togglePanel}
        className={cn(
          "fixed right-0 top-1/2 z-50 -translate-y-1/2",
          "bg-gray-200 hover:bg-gray-300 transition-colors",
          "px-2 py-6 text-xs font-bold tracking-wider",
          "border-l border-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
        )}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        FEEDBACK
      </button>

      {/* Sliding panel from right */}
      <div
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-96 bg-white shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
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
              <h2 className="text-2xl font-bold">YOUR EXPERIENCE</h2>

              <div className="space-y-2">
                <a href="#" className="inline-block text-sm font-medium underline hover:no-underline">
                  GET HELP
                </a>
              </div>

              <p className="text-sm leading-relaxed">
                Don't hold back. Good or bad - <span className="font-semibold">tell it like it is</span>.
              </p>

              <div className="space-y-4">
                <p className="text-sm font-medium">
                  How likely are you to recommend <span className="font-bold">adidas.com</span> to a friend?{" "}
                  <span className="text-red-500">*</span>
                </p>

                {/* Rating scale */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Very unlikely</span>
                    <span>Very likely</span>
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
                  "w-full py-3 px-6 text-sm font-bold text-white",
                  "bg-black hover:bg-gray-800 disabled:bg-gray-300",
                  "disabled:cursor-not-allowed transition-colors",
                  "flex items-center justify-center space-x-2",
                )}
              >
                <span>NEXT</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6">
            <p className="text-center text-xs text-gray-500">
              Protected by reCAPTCHA:{" "}
              <a href="#" className="underline hover:no-underline">
                Privacy
              </a>{" "}
              &{" "}
              <a href="#" className="underline hover:no-underline">
                Terms
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={togglePanel} />}
    </>
  )
}
