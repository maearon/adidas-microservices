"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { countryDisplayMap, localeOptions, SupportedLocale } from "@/lib/constants/localeOptions"
import { setLocale } from "@/store/localeSlice"
import Image from "next/image"
import { X } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: string) => void
}

export default function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const dispatch = useAppDispatch()
  const [selectedLocation, setSelectedLocation] = useState<SupportedLocale>(useSelector((s: RootState) => s.locale.locale) || "en_US")
  const t = useTranslations("location")

  // const locations = [
  //   {
  //     id: "vi_VN",
  //     name: "Vietnam",
  //     flag: "🇻🇳",
  //   },
  //   {
  //     id: "en_US",
  //     name: "United States",
  //     flag: "🇺🇸",
  //   },
  // ] as const;

  const handleLocationSelect = (locationId: SupportedLocale) => {
    setSelectedLocation(locationId);
  };

  const handleConfirm = () => {
    // Gọi callback được truyền vào props
    onLocationSelect(selectedLocation)

    // Lưu localStorage (dự phòng)
    if (typeof window !== "undefined") {
      localStorage.setItem("delivery-location", selectedLocation)
      document.cookie = `NEXT_LOCALE=${selectedLocation}; path=/; max-age=31536000`
      localStorage.setItem("NEXT_LOCALE", selectedLocation)
    }

    // Cập nhật locale vào Redux + cookie
    dispatch(setLocale(selectedLocation as SupportedLocale));

    onClose()
  }

  const handleViewAllLocations = () => {
    console.log("View all locations")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md p-0 bg-white dark:bg-black">
        <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
        {/* Close button - Square border style */}
        <div className="absolute bg-white dark:bg-black border border-black dark:border-white z-52 right-0 transform translate-x-[30%] translate-y-[-30%]">
          <button
            onClick={onClose}
            className="w-12 h-12 border border-border flex items-center 
            justify-center cursor-pointer transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="relative p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              {t?.pleaseChooseYour || "PLEASE CHOOSE YOUR"}
            </h2>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {t?.deliveryLocation || "DELIVERY LOCATION"}
            </h2>
          </div>

          {/* Location options */}
          <div className="space-y-4 mb-6">
            {localeOptions.map(({ value, label, flagShow }, index) => (
              <label key={`${value}-${index}`} className="flex items-center space-x-4 cursor-pointer group">
                <input
                  type="radio"
                  name="location"
                  value={value}
                  checked={selectedLocation === value}
                  onChange={() => handleLocationSelect(value)}
                  className="w-5 h-5 text-black dark:text-white border-2 border-gray-300 focus:ring-black focus:ring-2"
                />
                <span className="text-lg font-medium text-black dark:text-white group-hover:underline">
                  {countryDisplayMap[value]}
                </span>
                <span className="text-2xl ml-auto">
                  {/* {location.flag} */}
                  <Image src={flagShow} alt={label} width={24} height={16} />
                  {/* <Image
                    src={
                      localeOptions.find((o) => o.value === value)?.flagShow ||
                      "/flag/us-show.svg"
                    }
                    alt="flag"
                    width={24}
                    height={16}
                  /> */}
                </span>
              </label>
            ))}
          </div>

          {/* View all locations link */}
          <button
            onClick={handleViewAllLocations}
            className="text-base font-medium text-black underline hover:no-underline mb-8 block"
          >
            {t?.viewAllAvailableLocations || "VIEW ALL AVAILABLE LOCATIONS"}
          </button>

          {/* GO button */}
          <Button
            border
            pressEffect
            fullWidth={false}
            onClick={handleConfirm}
            className="w-full bg-black text-white hover:bg-gray-800 font-bold py-4 text-lg"
            theme="black"
            shadow
          >
            {t?.go || "GO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
