"use client"

import LocationModal from "./location-modal"
import { useLocationModal } from "@/hooks/useLocationModal"

export function LocationModalProvider() {
  const { isOpen, closeModal, selectLocation } = useLocationModal()

  return (
    <LocationModal
      isOpen={isOpen}
      onClose={closeModal}
      onLocationSelect={selectLocation}
    />
  )
}
