import { headers } from "next/headers";

import type { SupportedLocale } from "@/lib/constants/localeOptions";
import { localeOptions } from "@/lib/constants/localeOptions";

const CRAWLER_UA =
  /Googlebot|Google-InspectionTool|GoogleOther|Storebot-Google|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot/i;

/** ISO 3166-1 alpha-2 → locale (server IP geo, no browser prompt). */
const COUNTRY_LOCALE: Partial<Record<string, SupportedLocale>> = {
  VN: "vi_VN",
  US: "en_US",
  GB: "en_US",
  AU: "en_US",
  CA: "en_US",
  NZ: "en_US",
  IE: "en_US",
  SG: "en_US",
};

function isSupportedLocale(value: string): value is SupportedLocale {
  return localeOptions.some((option) => option.value === value);
}

/** Vercel / Cloudflare inject country from client IP — silent, no user prompt. */
function getCountryCodeFromHeaders(headersList: Headers): string | null {
  const raw =
    headersList.get("x-vercel-ip-country") ??
    headersList.get("cf-ipcountry");

  if (!raw) return null;

  const code = raw.trim().toUpperCase();
  if (!code || code === "XX" || code === "T1") return null;

  return code;
}

function localeFromCountryCode(countryCode: string): SupportedLocale | null {
  return COUNTRY_LOCALE[countryCode] ?? null;
}

/** Accept-Language + IP country. vi in Accept-Language wins; otherwise IP hints VN/en. */
function resolveLocaleFromSignals(
  acceptLanguage: string,
  countryCode: string | null,
): SupportedLocale | null {
  const lower = acceptLanguage.toLowerCase();

  if (/\bvi\b/.test(lower)) return "vi_VN";

  if (countryCode) {
    const fromCountry = localeFromCountryCode(countryCode);
    if (fromCountry) return fromCountry;
  }

  if (/\ben\b/.test(lower)) return "en_US";

  return null;
}

/** Sync fallback when request headers are unavailable. */
export function resolveServerLocale(
  cookieValue: string | undefined,
): SupportedLocale {
  if (cookieValue && isSupportedLocale(cookieValue)) {
    return cookieValue;
  }

  return "en_US";
}

/** Request-aware locale: cookie → crawler → Accept-Language + IP country → en. */
export async function resolveRequestLocale(
  cookieValue: string | undefined,
): Promise<SupportedLocale> {
  if (cookieValue && isSupportedLocale(cookieValue)) {
    return cookieValue;
  }

  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") ?? "";

    if (CRAWLER_UA.test(userAgent)) {
      return "en_US";
    }

    const acceptLanguage = headersList.get("accept-language") ?? "";
    const countryCode = getCountryCodeFromHeaders(headersList);
    const resolved = resolveLocaleFromSignals(acceptLanguage, countryCode);
    if (resolved) {
      return resolved;
    }
  } catch {
    // headers() is only available during a request.
  }

  return "en_US";
}
