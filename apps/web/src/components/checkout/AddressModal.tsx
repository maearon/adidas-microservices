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
import AddressAutocomplete, { AddressSuggestion } from "./AddressAutocomplete"
import { Address } from "@/types/common/address"
import { useTheme } from "next-themes"
import { X } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

interface AddressModalProps {
  open: boolean
  onClose: () => void
  onSave: (address: Address) => Promise<void>
  address?: Address | null
  mode?: "add" | "edit"
  country?: string | null
}

export default function AddressModal({
  open,
  onClose,
  onSave,
  address,
  mode = "add",
  country = "US",
}: AddressModalProps) {
  const t = useTranslations("commerce")
  const addr = t?.address
  const validation = addr?.validation
  const [formData, setFormData] = useState<Address>({
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: country || "US",
    phone: "",
    isDefault: false,
    type: "delivery",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [addressSearchValue, setAddressSearchValue] = useState("")
  const { resolvedTheme } = useTheme()

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
          country: country || "US",
          phone: "",
          isDefault: false,
          type: "delivery",
        })
        setAddressSearchValue("")
      }
      setErrors({})
    }
  }, [open, address, mode, country])

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

  const handleAddressSelect = (selectedAddress: AddressSuggestion) => {
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
    if (!formData.firstName) {
      newErrors.firstName = validation?.firstNameRequired ?? "First name is required"
    }
    if (!formData.lastName) {
      newErrors.lastName = validation?.lastNameRequired ?? "Last name is required"
    }
    if (!formData.street) {
      newErrors.street = validation?.streetRequired ?? "Street address is required"
    }
    if (!formData.city) {
      newErrors.city = validation?.cityRequired ?? "City is required"
    }
    if (!formData.state) {
      newErrors.state = validation?.stateRequired ?? "State is required"
    }
    if (!formData.zipCode) {
      newErrors.zipCode = validation?.zipCodeRequired ?? "Zip code is required"
    }
    if (!formData.phone) {
      newErrors.phone = validation?.phoneRequired ?? "Phone number is required"
    }

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
      <DialogContent
        className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-visible bg-white dark:bg-black rounded-none"
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? (addr?.editTitle ?? "Edit Address")
              : (addr?.addTitle ?? "Add New Address")}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? (addr?.editDescription ?? "Update your delivery address information")
              : (addr?.addDescription ?? "Add a new delivery address for your orders")}
          </DialogDescription>
        </DialogHeader>
        <div className="absolute bg-white dark:bg-black border border-black dark:border-white z-50 right-0 transform translate-x-[30%] translate-y-[-30%]">
          <button
            onClick={onClose}
            className="w-12 h-12 border border-border flex items-center 
            justify-center cursor-pointer transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder={addr?.firstName ?? "First Name *"}
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
                placeholder={addr?.lastName ?? "Last Name *"}
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
              placeholder={addr?.findAddress ?? "Find delivery address *"}
              country={formData.country}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>

          <div>
            <Input
              placeholder={addr?.apartment ?? "Apartment, suite, etc. (optional)"}
              value={formData.apartment || ""}
              onChange={(e) => handleInputChange("apartment", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder={addr?.city ?? "City *"}
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
                placeholder={addr?.state ?? "State *"}
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
                placeholder={addr?.zipCode ?? "Zip Code *"}
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
                placeholder={addr?.phoneNumber ?? "Phone Number *"}
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
                {addr?.setDefault ?? "Set as default address"}
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
              {addr?.cancel ?? "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              showArrow={false}
              pressEffect={true}
              shadowColorModeInWhiteTheme="black"
              theme={isDark ? "white" : "black"}
            >
              {isSaving
                ? (addr?.saving ?? "Saving...")
                : mode === "edit"
                  ? (addr?.update ?? "Update Address")
                  : (addr?.add ?? "Add Address")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
