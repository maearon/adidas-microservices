// src/hooks/useTranslations.ts
"use client"

import { useAppSelector } from "@/store/hooks"
import { selectLocale } from "@/store/localeSlice"
import { locales, Locale, Namespace } from "@/lib/locale"

export function useTranslations<N extends Namespace>(namespace: N) {
  const locale = useAppSelector(selectLocale) as Locale
  return locales[locale][namespace]
}
