"use client";

import { formatPrice, normalizeLocale } from "@/lib/utils"; 
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "@/hooks/useTranslations";

interface ProductPriceSpanProps {
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

export default function ProductPriceSpan({
  price,
  compareAtPrice,
}: ProductPriceSpanProps) {
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
      <span className="inline-flex flex-col leading-tight ml-1">
        <span className="text-[#E32B2B] font-bold text-sm sm:text-[18px]">
          {formatPrice(priceNum, locale)}
        </span>
        <span className="text-[#88769E] text-xs sm:text-sm font-extralight">
          <span className="line-through mr-1">
            {formatPrice(compareNum, locale)}
          </span>
          <span className="text-[#E32B2B] font-thin">-{discountPercent}%</span>
        </span>
      </span>
    );
  }

  return (
    <span className="text-sm sm:text-[18px] font-bold text-foreground inline-block ml-1">
      {formatPrice(priceNum ?? compareNum ?? 0, locale)}
    </span>
  );
}
