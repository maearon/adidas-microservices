"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface AddressSuggestion {
  formattedAddress: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  latitude?: number
  longitude?: number
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (address: AddressSuggestion) => void
  placeholder?: string
  country?: string
  className?: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Find delivery address *",
  country = "US",
  className = "",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/v1/addresses/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, country }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.addresses || [])
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error searching addresses:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(newValue)
    }, 300)
  }

  const handleSelect = (address: AddressSuggestion) => {
    onChange(address.formattedAddress)
    onSelect(address)
    setShowSuggestions(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder={placeholder}
          className="pr-10"
        />
        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading && (
            <div className="p-3 text-sm text-gray-500">Searching...</div>
          )}
          {suggestions.map((address, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(address)}
              className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="font-medium text-sm">{address.formattedAddress}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {address.city}, {address.state} {address.zipCode}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

