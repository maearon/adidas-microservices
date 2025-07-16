"use client"

import LocationModal from "./location-modal"
import FeedbackModal from "./feedback-modal"
import { useLocationModal } from "@/hooks/useLocationModal"
import { useFeedbackModal } from "@/hooks/useFeedbackModal"

/**
 * Provider để render LocationModal dựa vào trạng thái mở/đóng được quản lý bên ngoài.
 */
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

/**
 * Provider để render FeedbackModal với trạng thái riêng.
 */
export function FeedbackModalProvider() {
  const { isOpen, closeModal } = useFeedbackModal()

  return (
    <FeedbackModal
      isOpen={isOpen}
      onClose={closeModal}
    />
  )
}
