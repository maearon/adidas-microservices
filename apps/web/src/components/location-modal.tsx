"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { SupportedLocale } from "@/lib/constants/localeOptions"
import { setLocale } from "@/store/localeSlice"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: string) => void
}

export default function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const dispatch = useAppDispatch()
  const [selectedLocation, setSelectedLocation] = useState<SupportedLocale>("vi_VN");

  const locations = [
    {
      id: "vi_VN",
      name: "Vietnam",
      flag: "🇻🇳",
    },
    {
      id: "en_US",
      name: "United States",
      flag: "🇺🇸",
    },
  ] as const;

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
      <DialogContent className="sm:max-w-md p-0 bg-white">
        <div className="relative p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">PLEASE CHOOSE YOUR</h2>
            <h2 className="text-2xl font-bold text-black">DELIVERY LOCATION</h2>
          </div>

          {/* Location options */}
          <div className="space-y-4 mb-6">
            {locations.map((location) => (
              <label key={location.id} className="flex items-center space-x-4 cursor-pointer group">
                <input
                  type="radio"
                  name="location"
                  value={location.id}
                  checked={selectedLocation === location.id}
                  onChange={() => handleLocationSelect(location.id)}
                  className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-black focus:ring-2"
                />
                <span className="text-lg font-medium text-black group-hover:underline">{location.name}</span>
                <span className="text-2xl ml-auto">{location.flag}</span>
              </label>
            ))}
          </div>

          {/* View all locations link */}
          <button
            onClick={handleViewAllLocations}
            className="text-base font-medium text-black underline hover:no-underline mb-8 block"
          >
            VIEW ALL AVAILABLE LOCATIONS
          </button>

          {/* GO button */}
          <Button
            pressEffect
            fullWidth={false}
            onClick={handleConfirm}
            className="w-full bg-black text-white hover:bg-gray-800 font-bold py-4 text-lg"
            theme="black"
            shadow
          >
            GO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
