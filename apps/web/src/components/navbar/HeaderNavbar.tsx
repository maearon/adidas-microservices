import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { countryLabelsByUiLocale, localeOptions, SupportedLocale } from "@/lib/constants/localeOptions";
import { setLocale } from "@/store/localeSlice";
import { useTranslations } from "@/hooks/useTranslations"

const HeaderNavbar = ({ onCloseMegaMenu }: { onCloseMegaMenu?: () => void }) => {
  const t = useTranslations("headerNavbar")
  const dispatch = useAppDispatch()
  const locale = useAppSelector((state) => state.locale.locale)
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

  const activeLocale = localeOptions.find((opt) => opt.value === locale)
  const countryLabels = countryLabelsByUiLocale[locale] ?? countryLabelsByUiLocale.en_US
  
  return (
    <div
      className="relative z-[60] flex w-full items-center justify-end px-12 py-2 text-xs text-gray-700 dark:text-white"
      onMouseEnter={onCloseMegaMenu}
    >
      <Link href="/sign-up" className="hover:underline mr-3">{t?.registerLink ?? "sign up"}</Link>
      <Link href="/help" className="hover:underline mr-3">{t?.helpLink ?? "help"}</Link>
      <Link href="/orders" className="hover:underline mr-3">{t?.ordersAndReturnsLink ?? "orders and returns"}</Link>
      <Link href="/gift-cards" className="hover:underline mr-3">{t?.giftCardsLink ?? "gift cards"}</Link>
      <Link href="/join" className="hover:underline mr-3">{t?.joinAdiClubLink ?? "join adiClub"}</Link>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            onCloseMegaMenu?.()
            setShowCountrySelect((prev) => !prev)
          }}
          className="flex items-center"
          type="button"
        >
          {(() => {
            return (
              <>
                <Image
                  src={activeLocale?.flagShow || "/flag/us-show.svg"}
                  alt={activeLocale?.label || "Country Flag"}
                  width={24}
                  height={16}
                />
              </>
            )
          })()}
        </button>

        {/* Dropdown */}
        {showCountrySelect && (
          <div className="absolute right-0 z-[70] mt-2 w-60 border bg-white p-4 shadow-xl dark:border-white dark:bg-black">
            <p className="mb-4 text-[16px] leading-snug text-black dark:text-white">
              {t?.chooseYourCountry ?? "Choose your country"}
            </p>
            {localeOptions.map(({ value, flag }, index) => (
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
                <Image src={flag} alt={countryLabels[value]} width={24} height={16} />
                <span className="font-semibold">
                  {countryLabels[value]}
                </span>
              </label>
            ))}

            <button
              onClick={() => setShowCountrySelect(false)}
              className="mt-2 w-full bg-black py-2 font-bold text-white dark:bg-white dark:text-black"
            >
              {t?.save ?? "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderNavbar
