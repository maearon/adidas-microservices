// src/hooks/useTranslations.ts
"use client"

import { useAppSelector } from "@/store/hooks"
import { selectLocale } from "@/store/localeSlice"
import { locales, Locale, Namespace } from "@/lib/locale"

const DEFAULT_LOCALE: Locale = "en_US"

export function useTranslations<N extends Namespace>(namespace: N) {
  let locale = useAppSelector(selectLocale) as Locale | undefined

  // fallback nếu locale không hợp lệ
  if (!locale || !locales[locale]) {
    locale = DEFAULT_LOCALE
  }

  // fallback cho namespace bị thiếu trong locale hiện tại
  return locales[locale][namespace] ?? locales[DEFAULT_LOCALE][namespace]
}
