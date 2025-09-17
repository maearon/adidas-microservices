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

export default function ProductPrice({
  price,
  compareAtPrice,
}: ProductPriceProps) {
  const priceNum = price ? Number(price) : null;
  const compareNum = compareAtPrice ? Number(compareAtPrice) : null;
  const locale = useAppSelector((state) => state.locale.locale)
  const t = useTranslations("common");

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
