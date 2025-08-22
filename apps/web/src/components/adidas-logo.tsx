"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface Props {
  className?: string
}

const AdidasLogo = ({ className }: Props) => {
  const { 
    // theme, 
    resolvedTheme 
  } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <Image
      src={isDark ? "/logo_white_transparent.png" : "/logo.png"}
      alt="Adidas logo"
      width={80}
      height={80}
      priority
      className={className}
    />
  )
}

export default AdidasLogo
