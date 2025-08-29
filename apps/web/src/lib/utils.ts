import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNowStrict } from "date-fns";
import { SupportedLocale } from "./constants/localeOptions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tỉ giá USD → VND (có thể lấy từ API hoặc config .env)
const USD_TO_VND = 26375;

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export const formatPrice = (
  price?: number | string | null,
  locale: SupportedLocale = "en_US"
): string => {
  if (price == null || price === "") return "";

  const num = Number(price);
  if (isNaN(num)) return "";

  // Map lại cho đúng chuẩn Intl
  const localeMap: Record<SupportedLocale, { locale: string; currency: string; rate: number }> = {
    en_US: { locale: "en-US", currency: "USD", rate: 1 },
    vi_VN: { locale: "vi-VN", currency: "VND", rate: USD_TO_VND },
  };

  const { locale: intlLocale, currency, rate } = localeMap[locale];
  const converted = num * rate;

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(converted);
};


export function formatRelativeDate(from: Date | string | number | undefined | null) {
  if (!from) return ""; // Trường hợp null/undefined

  const date = new Date(from);
  if (isNaN(date.getTime())) return ""; // Trường hợp invalid date

  const currentDate = new Date();

  if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === date.getFullYear()) {
      return format(date, "MMM d");
    } else {
      return format(date, "MMM d, yyyy");
    }
  }
}

export const slugify = (name: unknown): string => {
  if (typeof name !== "string") return "";

  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-");    // khoảng trắng => dấu gạch ngang
};
