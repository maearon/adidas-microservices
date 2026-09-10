"use client";

import { useEffect, useState } from "react";

import { locales, Locale, Namespace } from "@/lib/locale";
import { useAppSelector } from "@/store/hooks";
import { selectLocale } from "@/store/localeSlice";

const DEFAULT_LOCALE: Locale = "en_US";

function deepMerge<T>(base: T, overlay: T): T {
  if (!overlay) return base;
  if (typeof base !== "object" || base === null) return overlay ?? base;
  if (typeof overlay !== "object" || overlay === null) return overlay;
  if (Array.isArray(overlay)) return overlay;

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(overlay as Record<string, unknown>)) {
    const prev = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMerge(prev, value);
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out as T;
}

/** Locale safe for SSR/hydration — uses server-synced store after mount. */
export function useHydrationSafeLocale(): Locale {
  const localeFromStore = useAppSelector(selectLocale) as Locale | undefined;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && localeFromStore && locales[localeFromStore]
    ? localeFromStore
    : DEFAULT_LOCALE;
}

export function useTranslations<N extends Namespace>(namespace: N) {
  const locale = useHydrationSafeLocale();

  const base = locales[DEFAULT_LOCALE][namespace];
  const current = locales[locale][namespace] ?? base;
  return deepMerge(base, current);
}
