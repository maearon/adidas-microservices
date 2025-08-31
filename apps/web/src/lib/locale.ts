// src/lib/locale.ts
import headerNavbarEn from "@/locales/en_US/headerNavbar.json"
import headerNavbarVi from "@/locales/vi_VN/headerNavbar.json"
import heroEn from "@/locales/en_US/hero.json"
import heroVi from "@/locales/vi_VN/hero.json"
import secondHeroEn from "@/locales/en_US/secondHero.json"
import secondHeroVi from "@/locales/vi_VN/secondHero.json"
import videoHeroEn from "@/locales/en_US/videoHero.json"
import videoHeroVi from "@/locales/vi_VN/videoHero.json"
import navbarEn from "@/locales/en_US/navbar.json"
import navbarVi from "@/locales/vi_VN/navbar.json"
import commonEn from "@/locales/en_US/common.json"
import commonVi from "@/locales/vi_VN/common.json"
import authEn from "@/locales/en_US/auth.json"
import authVi from "@/locales/vi_VN/auth.json"
import navigationEn from "@/locales/en_US/navigation.json"
import navigationVi from "@/locales/vi_VN/navigation.json"
import topbarEn from "@/locales/en_US/topbar.json"
import topbarVi from "@/locales/vi_VN/topbar.json"
import locationEn from "@/locales/en_US/location.json"
import locationVi from "@/locales/vi_VN/location.json"
import feedbackEn from "@/locales/en_US/feedback.json"
import feedbackVi from "@/locales/vi_VN/feedback.json"
import accountEn from "@/locales/en_US/account.json"
import accountVi from "@/locales/vi_VN/account.json"
import productEn from "@/locales/en_US/product.json"
import productVi from "@/locales/vi_VN/product.json"
import mobileEn from "@/locales/en_US/mobile.json"
import mobileVi from "@/locales/vi_VN/mobile.json"
import footerEn from "@/locales/en_US/footer.json"
import footerVi from "@/locales/vi_VN/footer.json"

export const locales = {
  "en_US": {
    navbar: navbarEn,
    headerNavbar: headerNavbarEn,
    hero: heroEn,
    secondHero: secondHeroEn,
    videoHero: videoHeroEn,
    common: commonEn,
    auth: authEn,
    navigation: navigationEn,
    topbar: topbarEn,
    location: locationEn,
    feedback: feedbackEn,
    account: accountEn,
    product: productEn,
    mobile: mobileEn,
    footer: footerEn,
  },
  "vi_VN": {
    navbar: navbarVi,
    headerNavbar: headerNavbarVi,
    hero: heroVi,
    secondHero: secondHeroVi,
    videoHero: videoHeroVi,
    common: commonVi,
    auth: authVi,
    navigation: navigationVi,
    topbar: topbarVi,
    location: locationVi,
    feedback: feedbackVi,
    account: accountVi,
    product: productVi,
    mobile: mobileVi,
    footer: footerVi,
  },
} as const

export type Locale = keyof typeof locales
export type Namespace = keyof typeof locales[Locale]
export type TranslationKey<N extends Namespace> = keyof typeof locales[Locale][N]
