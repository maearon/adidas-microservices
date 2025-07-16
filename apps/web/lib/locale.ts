import en from "@/locales/en/hero.json"
import vi from "@/locales/vi/hero.json"

const locales = {
  en,
  vi,
  "united-states": en,
  "vietnam": vi,
}

export function getTranslations(locale: string, namespace: "hero") {
  return locales[locale as keyof typeof locales]
}
