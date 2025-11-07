"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import AddressAutocomplete from "./AddressAutocomplete"

// interface Address {
//   _id?: string
//   userId?: string
//   firstName: string
//   lastName: string
//   street: string
//   apartment?: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   phone: string
//   isDefault?: boolean
//   type?: "delivery" | "billing" | "both"
//   latitude?: number
//   longitude?: number
//   formattedAddress?: string
// }
import { Address } from "@/types/common/address"
import { useTheme } from "next-themes"

interface AddressModalProps {
  open: boolean
  onClose: () => void
  onSave: (address: Address) => Promise<void>
  address?: Address | null
  mode?: "add" | "edit"
}

export default function AddressModal({
  open,
  onClose,
  onSave,
  address,
  mode = "add",
}: AddressModalProps) {
  const [formData, setFormData] = useState<Address>({
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    isDefault: false,
    type: "delivery",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [addressSearchValue, setAddressSearchValue] = useState("")
  const { 
    // theme, 
    resolvedTheme 
  } = useTheme()

  useEffect(() => {
    if (open) {
      if (mode === "edit" && address) {
        setFormData({
          firstName: address.firstName || "",
          lastName: address.lastName || "",
          street: address.street || "",
          apartment: address.apartment || "",
          city: address.city || "",
          state: address.state || "",
          zipCode: address.zipCode || "",
          country: address.country || "US",
          phone: address.phone || "",
          isDefault: address.isDefault || false,
          type: address.type || "delivery",
          latitude: address.latitude,
          longitude: address.longitude,
          formattedAddress: address.formattedAddress || "",
        })
        setAddressSearchValue(address.formattedAddress || address.street || "")
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          street: "",
          apartment: "",
          city: "",
          state: "",
          zipCode: "",
          country: "US",
          phone: "",
          isDefault: false,
          type: "delivery",
        })
        setAddressSearchValue("")
      }
      setErrors({})
    }
  }, [open, address, mode])

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddressSelect = (selectedAddress: Address) => {
    setFormData((prev) => ({
      ...prev,
      street: selectedAddress.street || prev.street,
      city: selectedAddress.city || prev.city,
      state: selectedAddress.state || prev.state,
      zipCode: selectedAddress.zipCode || prev.zipCode,
      country: selectedAddress.country || prev.country,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      formattedAddress: selectedAddress.formattedAddress,
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.street) newErrors.street = "Street address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipCode) newErrors.zipCode = "Zip code is required"
    if (!formData.phone) newErrors.phone = "Phone number is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving address:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your delivery address information"
              : "Add a new delivery address for your orders"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <AddressAutocomplete
              value={addressSearchValue}
              onChange={setAddressSearchValue}
              onSelect={handleAddressSelect}
              placeholder="Find delivery address *"
              country={formData.country}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.apartment || ""}
              onChange={(e) => handleInputChange("apartment", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="City *"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="State *"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Zip Code *"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => handleInputChange("isDefault", !!checked)}
              />
              <label htmlFor="isDefault" className="text-sm">
                Set as default address
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              showArrow={false}
              pressEffect={true}
              shadowColorModeInWhiteTheme="black"
              theme={isDark ? "white" : "black"}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving}
              showArrow={false}
              pressEffect={true}
              shadowColorModeInWhiteTheme="black"
              theme={isDark ? "white" : "black"}
            >
              {isSaving ? "Saving..." : mode === "edit" ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

