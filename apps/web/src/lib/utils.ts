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
  currency: SupportedLocale = "en_US"
): string => {
  const num = Number(price);

  if (price == null || isNaN(num)) {
    return "";
  }

  // Với "en-US" + currency: "USD" → format ra $1,234.00 ($ đứng trước).
  // Với "vi-VN" + currency: "VND" → format ra 1.234.000 ₫ (₫ đứng sau).
  if (currency === "vi_VN") {
    const converted = num * USD_TO_VND;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0, // thường giá VNĐ không hiển thị thập phân
    }).format(converted);
  }

  // Mặc định là USD
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
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
