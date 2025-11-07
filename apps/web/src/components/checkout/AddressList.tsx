"use client"

import { useState, useEffect } from "react"
import { BaseButton } from "@/components/ui/base-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Plus } from "lucide-react"
import AddressModal from "./AddressModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// interface Address {
//   _id: string
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
//   formattedAddress?: string
// }
import { Address } from "@/types/common/address"
import { useTheme } from "next-themes"
import FullScreenLoader from "@/components/ui/FullScreenLoader"

interface AddressListProps {
  selectedAddress: Address | null
  onSelectAddress: (address: Address) => void
}

export default function AddressList({ selectedAddress, onSelectAddress }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const { 
    // theme, 
    resolvedTheme 
  } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const response = await fetch("/api/v1/addresses")
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
        // Auto-select default address if available
        const defaultAddress = data.addresses?.find((addr: Address) => addr.isDefault)
        if (defaultAddress && !selectedAddress) {
          onSelectAddress(defaultAddress)
        }
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async (addressData: Address) => {
    try {
      if (editingAddress?._id) {
        // Update existing address
        const response = await fetch(`/api/v1/addresses/${editingAddress._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressData),
        })
        if (response.ok) {
          await loadAddresses()
          setModalOpen(false)
          setEditingAddress(null)
        }
      } else {
        // Create new address
        const response = await fetch("/api/v1/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressData),
        })
        if (response.ok) {
          const data = await response.json()
          await loadAddresses()
          setModalOpen(false)
          // Auto-select newly created address
          if (data.address) {
            onSelectAddress(data.address)
          }
        }
      }
    } catch (error) {
      console.error("Error saving address:", error)
      throw error
    }
  }

  const handleDelete = async () => {
    if (!addressToDelete) return

    try {
      const response = await fetch(`/api/v1/addresses/${addressToDelete}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await loadAddresses()
        // Clear selection if deleted address was selected
        if (selectedAddress?._id === addressToDelete) {
          onSelectAddress(null as any)
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error)
    } finally {
      setDeleteDialogOpen(false)
      setAddressToDelete(null)
    }
  }

  const openEditModal = (address: Address) => {
    setEditingAddress(address)
    setModalOpen(true)
  }

  const openAddModal = () => {
    setEditingAddress(null)
    setModalOpen(true)
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading addresses...</div>
  }

  if (!hasMounted || loading) return <FullScreenLoader />
  
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <>
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-sm text-gray-500 mb-4">
            No saved addresses. Add one to get started.
          </div>
        ) : (
          addresses.map((address) => (
            <Card
              key={address._id}
              className={`cursor-pointer border-2 transition-all ${
                selectedAddress?._id === address._id
                  ? "border-black dark:border-white"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onSelectAddress(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {address.firstName} {address.lastName}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {address.formattedAddress || `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {address.phone}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(address)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </BaseButton>
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAddressToDelete(address._id)
                        setDeleteDialogOpen(true)
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </BaseButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <Button
          variant="outline"
          onClick={openAddModal}
          className="w-full"
          showArrow={false}
          pressEffect={true}
          shadowColorModeInWhiteTheme="black"
          theme={isDark ? "white" : "black"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <AddressModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingAddress(null)
        }}
        onSave={handleSaveAddress}
        address={editingAddress}
        mode={editingAddress ? "edit" : "add"}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

