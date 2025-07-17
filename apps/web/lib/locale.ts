// locale.server.ts — chỉ dùng ở server
import heroEn from "@/locales/en-US/hero.json"
import heroVi from "@/locales/vi-VN/hero.json"
import headerEn from "@/locales/en-US/header.json"
import headerVi from "@/locales/vi-VN/header.json"
import { cookies } from 'next/headers'

const locales = {
  "en-US": {
    hero: heroEn,
    header: headerEn,
  },
  "vi-VN": {
    hero: heroVi,
    header: headerVi,
  },
}

type Locale = keyof typeof locales
type Namespace = keyof typeof locales["en-US"]

export function getTranslations(locale: Locale, namespace: Namespace) {
  return locales[locale][namespace]
}  

export function getLocaleFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get('NEXT_LOCALE')?.value ?? 'en-US'
}
