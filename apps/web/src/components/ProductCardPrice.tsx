"use client";

import { formatPrice, normalizeLocale } from "@/lib/utils"; 
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "@/hooks/useTranslations";

interface ProductPriceProps {
  price?: number | string | null;          // giá đang bán (luôn là raw USD)
  compareAtPrice?: number | string | null; // giá gốc (luôn là raw USD)
}

declare global {
  interface Navigator {
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
    };
    deviceMemory?: number;
    devicePosture?: unknown; // tránh any
  }
}

export function logNavigatorInfo() {
  try {
    console.group("🌍 Ngôn ngữ & địa phương");
    console.log("navigator.languages:", navigator.languages);
    console.log("navigator.language:", navigator.language);
    console.log("TimeZone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log("Currency (từ NumberFormat):", 
      (Intl.NumberFormat().resolvedOptions() as any).currency || "(chưa có trực tiếp, suy ra từ locale)"
    );
    console.groupEnd();

    console.group("💻 Thiết bị & trình duyệt");
    console.log("navigator.userAgent:", navigator.userAgent);
    console.log("navigator.platform:", navigator.platform);
    console.log("CPU cores:", navigator.hardwareConcurrency);
    console.log("RAM (GB):", navigator.deviceMemory);
    console.log("Touch points:", navigator.maxTouchPoints);
    console.groupEnd();

    console.group("📡 Network & online status");
    console.log("navigator.onLine:", navigator.onLine);
    console.log("navigator.connection:", navigator.connection || "(not supported)");
    console.groupEnd();

    console.group("🔒 Quyền & thiết bị");
    console.log("navigator.geolocation:", navigator.geolocation);
    console.log("navigator.mediaDevices:", navigator.mediaDevices);
    console.log("navigator.permissions:", navigator.permissions);
    console.groupEnd();

    console.group("🎮 Khác lạ & thú vị");
    console.log("navigator.vibrate:", typeof navigator.vibrate === "function");
    console.log("navigator.clipboard:", navigator.clipboard);
    console.log("navigator.share:", navigator.share);
    console.log("navigator.devicePosture:", navigator.devicePosture || "(experimental / not supported)");
    console.groupEnd();
  } catch (err) {
    console.error("Lỗi khi log navigator info:", err);
  }
}

export default function ProductPrice({
  price,
  compareAtPrice,
}: ProductPriceProps) {
  const priceNum = price ? Number(price) : null;
  const compareNum = compareAtPrice ? Number(compareAtPrice) : null;
  const locale = useAppSelector((state) => state.locale.locale) || normalizeLocale(navigator.language) // Mặc định là US English  
  // const userLocale = navigator.language;
  const t = useTranslations("common");
  logNavigatorInfo(); 
  // ví dụ: "en-US", "vi-VN"

  const hasDiscount =
    priceNum !== null &&
    compareNum !== null &&
    compareNum > priceNum;

  if (!price && !compareAtPrice) {
    return <span>—</span>
  }

  if (hasDiscount) {
    const discountPercent = Math.round(
      ((compareNum! - priceNum!) / compareNum!) * 100
    );

    return (
      <div className="space-y-1">
        {/* Giá sau giảm */}
        <div className="text-[#E32B2B] font-bold text-sm sm:text-[18px]">
          {formatPrice(priceNum, locale)}
        </div>

        {/* Giá gốc và phần trăm giảm */}
        <div className="text-[#88769E] text-xs sm:text-sm font-extralight">
          <span className="line-through mr-1">
            {formatPrice(compareNum, locale)}
          </span>
          <span className="font-normal">{t?.originalPrice || "Original price"}</span>
          <span className="text-[#E32B2B] font-thin ml-1">
            -{discountPercent}%
          </span>
        </div>
      </div>
    );
  }

  // Trường hợp không có giảm giá
  return (
    <div className="text-sm sm:text-[18px] font-bold text-foreground">
      {formatPrice(priceNum ?? compareNum ?? 0, locale)}
    </div>
  );
}
