interface ProductPriceProps {
  price?: string
  compareAtPrice?: string
}

export default function ProductPrice({ price, compareAtPrice }: ProductPriceProps) {
  const hasDiscount =
    price && compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price)

  if (hasDiscount) {
    const discountPercent = Math.round(
      ((parseFloat(compareAtPrice!) - parseFloat(price!)) / parseFloat(compareAtPrice!)) * 100
    )

    return (
      <div className="space-y-1">
      {/* Giá sau giảm */}
      <div className="text-[#E32B2B] font-bold text-sm sm:text-[18px]">
        {price}
      </div>

      {/* Giá gốc và phần trăm giảm */}
      <div className="text-[#88769E] text-xs sm:text-sm front-extralight">
        {compareAtPrice} <span className="font-normal">Original price</span> <span className="text-[#E32B2B] front-thin ml-1">-{discountPercent}%</span>
      </div>
    </div>
  )
}

// Trường hợp không có giảm giá
return (
  <div className="text-sm sm:text-[18px] font-bold text-foreground">
    {price ?? compareAtPrice ?? "0"}
  </div>
)
}
