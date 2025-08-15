// src/lib/locale.ts
import heroEn from "@/locales/en-US/hero.json"
import heroVi from "@/locales/vi-VN/hero.json"
import headerEn from "@/locales/en-US/header.json"
import headerVi from "@/locales/vi-VN/header.json"

export const locales = {
  "en-US": {
    hero: heroEn,
    header: headerEn,
  },
  "vi-VN": {
    hero: heroVi,
    header: headerVi,
  },
} as const

export type Locale = keyof typeof locales
export type Namespace = keyof typeof locales[Locale]
export type TranslationKey<N extends Namespace> = keyof typeof locales[Locale][N]
