import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price?: number | string | null) => {
  if (price == null || isNaN(Number(price))) {
    return "";
  }
  return `$${Number(price).toFixed(2)}`;
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

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en_US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export const slugify = (name: unknown): string => {
  if (typeof name !== "string") return "";

  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-");    // khoảng trắng => dấu gạch ngang
};
