"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

interface ImageLightboxProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
  productName: string
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  productName,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const t = useTranslations("product")

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          if (currentIndex > 0) onNavigate(currentIndex - 1)
          break
        case "ArrowRight":
          if (currentIndex < images.length - 1) onNavigate(currentIndex + 1)
          break
        case "=":
        case "+":
          e.preventDefault()
          handleZoomIn()
          break
        case "-":
          e.preventDefault()
          handleZoomOut()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, images.length, onClose, onNavigate])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (zoom === 1) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart, zoom],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const getImageCursor = () => {
    if (zoom === 1) {
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' strokeWidth='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3Cpath d='M11 8v6'/%3E%3Cpath d='M8 11h6'/%3E%3C/svg%3E") 12 12, zoom-in`
    } else if (isDragging) {
      return "grabbing"
    } else {
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' strokeWidth='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3Cpath d='M8 11h6'/%3E%3C/svg%3E") 12 12, zoom-out`
    }
  }

  if (!isOpen) return null

  const getInstructionText = () => {
    const clickAction = zoom === 1 ? (t?.clickToZoomIn || "Click to zoom in") : (t?.clickToZoomOut || "Click to zoom out")
    const dragAction = zoom > 1 ? ` • ${t?.dragToPan || "Drag to pan"} • ` : " • "
    const escAction = t?.escToClose || "ESC to close"
    
    return `${clickAction}${dragAction}${escAction}`
  }

  return (
    <div className="fixed inset-0 bg-[#ECEFF1] z-1000 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-none flex items-center justify-center transition-colors"
      >
        <X size={24} className="text-black" />
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-none flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={24} className="text-black" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-none flex items-center justify-center transition-colors"
        >
          <ChevronRight size={24} className="text-black" />
        </button>
      )}

      {/* Image Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            cursor: getImageCursor(),
          }}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
        {/* <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${productName} - Image ${currentIndex + 1}`}
          fill // need relative
          sizes="(max-width: 768px) 100vw, 50vw"
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            cursor: getImageCursor(),
          }}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          draggable={false}
        /> */}
      </div>

      {/* Instructions */}
      {/* <div className="absolute bottom-4 right-4 flex gap-2"> */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-100 px-4 py-2 rounded-none text-base text-background"> */}
      <div className="absolute bottom-4 left-4 bg-white text-black px-3 py-2 rounded-none text-base">
        {getInstructionText()}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-none text-base">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
      {/* <div className="absolute bottom-4 right-4 flex gap-2"> */}
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`w-12 h-12 border-2 rounded-none overflow-hidden ${
              index === currentIndex ? "border-black" : "border-gray-300"
            }`}
          >
            <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            {/* <Image
              src={image || "/placeholder.svg"}
              alt=""
              fill // need relative
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            /> */}
          </button>
        ))}
        {/* {images.length > 5 && (
          <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-none flex items-center justify-center text-xs text-background">
            +{images.length - 5}
          </div>
        )} */}
      </div>
    </div>
  )
}
