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
        <span className="font-bold text-red-600 text-lg">${price}</span>
        <span className="line-through text-gray-500 text-sm">${compareAtPrice}</span>
        <span className="text-red-600 text-sm font-medium">-{discountPercent}%</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg">${price ?? compareAtPrice ?? "0"}</span>
    </div>
  )
}
