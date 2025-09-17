"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { setLocale } from "@/store/localeSlice"
import { localeOptions, SupportedLocale } from "@/lib/constants/localeOptions"
import { motion, AnimatePresence } from "framer-motion"

interface LocaleModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LocaleModal({ isOpen, onClose }: LocaleModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const currentLocale = useSelector((s: RootState) => s.locale.locale)

  const [step, setStep] = useState<"overview" | "select">("overview")

  useEffect(() => {
    if (isOpen) setStep("overview")
  }, [isOpen])

  const handleChangeLocale = (value: SupportedLocale) => {
    dispatch(setLocale(value))
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`
    localStorage.setItem("NEXT_LOCALE", value)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="fixed bottom-4 right-4 w-[95vw] sm:w-[320px] max-h-[90vh] 
                   overflow-y-auto bg-white dark:bg-black p-0 rounded-xl 
                   border shadow-lg"
      >
        <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center 
                     rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          {step === "overview" && (
            <motion.div
              key="overview"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              <h2 className="text-xl font-bold mb-4">Language / Country</h2>
              <button
                className="w-full flex items-center justify-between border p-4 rounded-md"
                onClick={() => setStep("select")}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      localeOptions.find((opt) => opt.value === currentLocale)?.flag ||
                      "/flag/us.svg"
                    }
                    alt="flag"
                    width={24}
                    height={16}
                  />
                  <span>
                    {localeOptions.find((opt) => opt.value === currentLocale)?.label}
                  </span>
                </div>
                <span className="text-gray-400">Change</span>
              </button>
            </motion.div>
          )}

          {step === "select" && (
            <motion.div
              key="select"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8 space-y-4"
            >
              <button
                onClick={() => setStep("overview")}
                className="mb-2 text-sm text-gray-500 hover:underline"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold mb-4">Select Language</h2>
              <div className="space-y-2">
                {localeOptions.map((opt) => {
                  const isSelected = opt.value === currentLocale
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleChangeLocale(opt.value as SupportedLocale)}
                      className={`w-full flex items-center justify-between p-3 border rounded-md ${
                        isSelected ? "border-black font-semibold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Image src={opt.flag} alt={opt.label} width={24} height={16} />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-black rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
