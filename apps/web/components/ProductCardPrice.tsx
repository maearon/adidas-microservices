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
      <div className="flex items-center gap-2">
        <span className="font-extralight text-red-600 text-base">${price}</span>
        <span className="line-through text-gray-500 text-base">${compareAtPrice}</span>
        <span className="text-[#E32B2B] text-base font-thin">-{discountPercent}%</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-extralight text-base">${price ?? compareAtPrice ?? "0"}</span>
    </div>
  )
}
