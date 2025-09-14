"use client"

import { useAppSelector } from "@/store/hooks"
import { selectUser } from "@/store/sessionSlice"
import { Facebook, Instagram, Twitter, Youtube, Music, MapPin, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import CcpaIcon from "../icons/CcpaIcon"
import { Button } from "../ui/button";
import { localeDisplayMap, localeOptions } from "@/lib/constants/localeOptions"
import { useEffect, useState } from "react"
import { footerSectionsData, mobileFooterSectionsData } from "@/data/footer-sections"
import type { Session } from "@/lib/auth"
import { useTranslations } from "@/hooks/useTranslations"
import LocaleModal from "@/components/footer/LocaleModal"
import LocationModal from "@/components//location-modal"
import { useLocationModal } from "@/hooks/useLocationModal"
import { normalizeLocale } from "@/lib/utils";

interface FooterClientProps {
  session: Session | null;
}

export default function FooterClient({ session }: FooterClientProps) {
  const [mounted, setMounted] = useState(false)
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false)
  const { selectLocation } = useLocationModal()
  const t = useTranslations("footer")
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const locale = useAppSelector((state) => state.locale.locale) || normalizeLocale(navigator.language) // Mặc định là US English
  const { value: user } = useAppSelector(selectUser)
  const cartItemsCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )

  const footerSections = footerSectionsData.map(section => ({
    title: (t?.[section.sectionKey as keyof typeof t] as string) || section.sectionKey,
    items: section.items,
  }))

  const mobileFooterSections = mobileFooterSectionsData.map(section => ({
    title: section.sectionKey === "yourBag"
      ? `${t?.yourBag || "Your bag"} (${cartItemsCount})`
      : (t?.[section.sectionKey as keyof typeof t] as string) || section.sectionKey,
    items: section.items,
  }))

  const socialIcons = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/adidas" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/adidas" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/adidas" },
    { name: "Pinterest", icon: MapPin, href: "https://pinterest.com/adidas" },
    { name: "TikTok", icon: Music, href: "https://tiktok.com/@adidas" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/adidas" },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Mobile Opinion Section */}
      {/* <section className="sm:hidden bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-bold mb-2">YOUR OPINION COUNTS</h2>
          <p className="text-base text-gray-600 dark:text-white mb-6">We strive to serve you better and appreciate your feedback</p>
        </div>
      </section> */}

      {/* Opinion Section with Back to Top */}
      <section className="sm:hidden bg-gray-100 text-base text-black py-4">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold uppercase tracking-normal leading-snug mb-2">
            {t?.yourOpinionCounts || "YOUR OPINION COUNTS"}
          </h3>
          <p className="text-sm mb-1">{t?.striveToServe || "We strive to serve you better and appreciate your feedback"}</p>
          <div id="qualtrics-feedback-footer">
            <a className="QSILink SI_9tTOmGSj82LsgBL_Link underline underline-offset-2" href="javascript:void(0);">
              {t?.qualtricsFeedback || "Please fill out this short survey"}
            </a>
          </div>
        </div>
      </section>

      {/* Back to Top button (mobile) */}
      <section className="sm:hidden bg-white border-none py-4">
        <div className="px-4 flex justify-center">
                      <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-base font-normal tracking-wide leading-tight break-words text-black"
            >
              <ChevronUp className="h-6 w-6" />
              <span className="ml-2">
                {t?.backToTop || "Back to top"}
              </span>
            </button>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-[#007cc3] text-white py-6 hidden sm:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
            <h3 className="text-2xl font-extrabold tracking-wide">
              {t?.joinAdiClubGet15Off || "JOIN OUR ADICLUB & GET 15% OFF"}
            </h3>
            <Button
              border={false}
              href="/sign-up"
              pressEffect={true}
              className="bg-white text-black py-3 rounded-none font-semibold hover:bg-gray-100 transition-colors"
            >
              {t?.signUpForFree || "SIGN UP FOR FREE"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-black text-white md:py-8">
        <div className="container mx-auto">
          
          {/* Desktop Footer */}
          <div className="hidden md:grid grid-cols-6 gap-8 pl-14 sm:pl-14 md:pl-14 lg:pl-14 xl:pl-20 2xl:pl-20 2xl:px-20">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-bold mb-4 text-base">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index}>
                      {item.key === "_divider" ? (
                        <div className="h-2"></div>
                      ) : (
                        <a href={item.href || "#"} className="text-base text-gray-300 hover:text-white hover:underline">
                          {(t?.[item.key as keyof typeof t] as string) || item.fallback || item.key}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Follow Us Column */}
            <div>
              <h3 className="font-bold mb-4 text-base">{t?.followUs || "FOLLOW US"}</h3>
              <div className="space-y-3">
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent size={16} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="sm:hidden py-6 space-y-6 bg-black text-white">

            {/* Hàng 1: 2 tiêu đề căn giữa cột */}
            <div className="grid grid-cols-2">
              <div className="flex justify-center">
                <Link
                  href={session?.user?.email ? "/my-account" : "/sign-in"}
                  className="font-bold text-base"
                >
                  {session?.user?.email ? (t?.myAccount || "My Account") : (t?.login || "Login")}
                </Link>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/cart"
                  className="font-bold text-base"
                >
                  {t?.yourBag || "Your bag"} ({cartItemsCount})
                </Link>
              </div>
            </div>

            {/* Hàng 2: CTA không có padding ngang */}
            {/* Bottom CTA */}
            <div className="bg-[#007cc3] text-white py-6 block sm:hidden">
              <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
                              <h3 className="text-2xl font-extrabold tracking-wide">
              {t?.joinAdiClubGet15Off || "JOIN OUR ADICLUB & GET 15% OFF"}
            </h3>
            <Button
              border={false}
              href="/sign-up"
              pressEffect={true}
              className="bg-white text-black py-3 rounded-none font-semibold hover:bg-gray-100 transition-colors"
            >
              {t?.signUpForFree || "SIGN UP FOR FREE"}
            </Button>
                </div>
              </div>
            </div>

            {/* Hàng 3: 2 cột nội dung có padding ngang */}
            <div className="grid grid-cols-2 gap-4 pl-14 sm:pl-14 md:pl-14 lg:pl-14 xl:pl-20 2xl:pl-20 2xl:px-20">
              <ul className="space-y-2">
                {mobileFooterSections[0].items.map((item, index) => (
                  <li key={index}>
                    <a href={item.href || "#"} className="text-base text-gray-300 hover:text-white">
                      {(t?.[item.key as keyof typeof t] as string) || item.fallback || item.key}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {mobileFooterSections[1].items.map((item, index) => (
                  <li key={index}>
                    <a href={item.href || "#"} className="text-base text-gray-300 hover:text-white">
                      {(t?.[item.key as keyof typeof t] as string) || item.fallback || item.key}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </footer>

      {/* Bottom Footer */}
      <div className="bg-black text-white py-6 border-t border-gray-700">
        <div className="container mx-auto pl-14 sm:pl-14 md:pl-14 lg:pl-14 xl:pl-20 2xl:pl-20 2xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-base">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <span>{t?.yourPrivacyChoices || "Your Privacy Choices"}</span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-5">
                    <CcpaIcon className="w-full h-full" />
                  </div>
                </div>
              </div>
              <span className="hidden md:inline text-gray-400">|</span>
              <a href={"/privacy-policy"} className="hover:underline text-gray-300">
                {t?.privacyPolicy || "Privacy Policy"}
              </a>
              <span className="hidden md:inline text-gray-400">|</span>
              <a href={"/terms"} className="hover:underline text-gray-300">
                {t?.termsAndConditions || "Terms and Conditions"}
              </a>
            </div>

            {/* Country Selector */}
            {/* {mounted && (
              <div className="flex items-center gap-2 text-base">
                <Image
                  src={localeOptions.find(country => country.value === locale)?.flag || "/flag/us.svg"}
                  alt={`${localeDisplayMap[locale]} Flag`}
                  width={24}
                  height={16}
                  className="inline-block"
                />
                <span>{localeDisplayMap[locale]}</span>
              </div>
            )} */}
            {/* Country Selector */}
            {mounted && (
              <>
                <button
                  onClick={() => setIsLocaleModalOpen(true)}
                  className="flex items-center gap-2 text-base hover:underline"
                >
                  <Image
                    src={localeOptions.find(country => country.value === locale)?.flag || "/flag/us.svg"}
                    alt={`${localeDisplayMap[locale]} Flag`}
                    width={24}
                    height={16}
                    className="inline-block"
                  />
                  <span>{localeDisplayMap[locale]}</span>
                </button>

                <LocationModal
                  isOpen={isLocaleModalOpen}
                  onClose={() => setIsLocaleModalOpen(false)}
                  onLocationSelect={selectLocation}
                />
              </>
            )}
          </div>

          <div className="mt-4 text-center md:text-left">
            <div className="text-gray-400 text-base">{t?.copyright || "© 2025 adidas America, Inc."}</div>
          </div>
        </div>
      </div>
    </>
  )
}
