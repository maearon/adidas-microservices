"use client"

import Image from "next/image"

interface Props {
  className?: string;
}

const AdidasLogo = ({ className }: Props) => (
  <Image
    src="/logo.png"
    alt="Adidas logo"
    width={80}
    height={80}
    priority
    className={className}
  />
)

export default AdidasLogo;
