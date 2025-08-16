// src/lib/locale.ts
import heroEn from "@/locales/en_US/hero.json"
import heroVi from "@/locales/vi_VN/hero.json"
import headerEn from "@/locales/en_US/header.json"
import headerVi from "@/locales/vi_VN/header.json"

export const locales = {
  "en_US": {
    hero: heroEn,
    header: headerEn,
  },
  "vi_VN": {
    hero: heroVi,
    header: headerVi,
  },
} as const

export type Locale = keyof typeof locales
export type Namespace = keyof typeof locales[Locale]
export type TranslationKey<N extends Namespace> = keyof typeof locales[Locale][N]
