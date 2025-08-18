import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { localeOptions, SupportedLocale } from "@/lib/constants/localeOptions";
import { setLocale } from "@/store/localeSlice";

const HeaderNavbar = () => {
  const dispatch = useAppDispatch()
  const locale = useAppSelector((state) => state.locale.locale) || "en_US" // Mặc định là US English  
  const [showCountrySelect, setShowCountrySelect] = useState(false)
  const [country, setCountry] = useState<"US" | "VN">("US") // mặc định là US
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('country', country);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountrySelect(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  return (
    <div className="flex justify-end items-center text-xs text-gray-700 dark:text-white px-12 py-2 w-full">
      <Link href="/signup" className="hover:underline mr-3">sign up</Link>
      <Link href="/help" className="hover:underline mr-3">help</Link>
      <Link href="/orders" className="hover:underline mr-3">orders and returns</Link>
      <Link href="/gift-cards" className="hover:underline mr-3">gift cards</Link>
      <Link href="/join" className="hover:underline mr-3">join adiClub</Link>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowCountrySelect((prev) => !prev)}
          className="flex items-center"
        >
          {(() => {
            const activeLocale = localeOptions.find((opt) => opt.value === locale)
            return (
              <>
                <Image
                  src={activeLocale?.flag || "/flag/us-show.svg"}
                  alt={activeLocale?.label || "Country Flag"}
                  width={20}
                  height={14}
                />
              </>
            )
          })()}
        </button>

        {/* Dropdown */}
        {showCountrySelect && (
          <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-black shadow-xl border p-4 z-50">
            {localeOptions.map(({ value, label, flag }, index) => (
              <label key={`${value}-${index}`} className="flex items-center gap-2 mb-3">
                <input
                  type="radio"
                  name="country"
                  checked={locale === value}
                  onChange={() => {
                    dispatch(setLocale(value as SupportedLocale));
                    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`
                    localStorage.setItem("NEXT_LOCALE", value)
                    setCountry(value === "en_US" ? "US" : "VN") // Cập nhật country dựa trên locale
                    setShowCountrySelect(false)
                  }}
                />
                <Image src={flag} alt={label} width={24} height={16} />
                <span className="font-semibold">
                  {label}
                </span>
              </label>
            ))}

            <button
              onClick={() => setShowCountrySelect(false)}
              className="mt-2 w-full bg-black dark:bg-white text-white py-2 font-bold"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderNavbar
