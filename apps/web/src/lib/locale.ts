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

export const locales = {
  "en_US": {
    navbar: navbarEn,
    headerNavbar: headerNavbarEn,
    hero: heroEn,
    secondHero: secondHeroEn,
    videoHero: videoHeroEn,
  },
  "vi_VN": {
    navbar: navbarVi,
    headerNavbar: headerNavbarVi,
    hero: heroVi,
    secondHero: secondHeroVi,
    videoHero: videoHeroVi,
  },
} as const

export type Locale = keyof typeof locales
export type Namespace = keyof typeof locales[Locale]
export type TranslationKey<N extends Namespace> = keyof typeof locales[Locale][N]
