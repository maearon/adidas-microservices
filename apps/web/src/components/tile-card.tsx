"use client"

// import Image from "next/image"

interface Tile {
  title: string,
  subtitle?: string,
  description?: string,
  image?: string,
  href?: string,
  cta?: string,
}

interface TileCardProps {
  tile: Tile,
  index: number
}

export default function TileCard({
  tile = {
    title: "",
    subtitle: "",
    description: "",
    image: "/placeholder.png?height=200&width=300",
    href: "#",
    cta: "SHOP NOW",
  },
  index = 1
}: TileCardProps) {
  return (
    <a
      key={`${tile.title}-${index}`}
      href={tile.href}
      className="group relative box-border border border-transparent hover:border-black dark:hover:border-white p-[1px] transition duration-300 h-full flex flex-col"
    >
      {/* Image section */}
      <div className="aspect-3/4 w-full overflow-hidden">
        <img
          src={tile.image || "/placeholder.svg"}
          alt={tile.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* <Image
          src={tile.image || "/placeholder.svg"}
          alt={tile.title}
          fill // need relative
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        /> */}
      </div>

      {/* Text section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base md:text-base uppercase mb-1">{tile.title}</h3>
        <p className="text-base text-gray-700 mb-3">{tile.description}</p>
        <span className="text-base font-bold underline underline-offset-4 mt-auto">SHOP NOW</span>
      </div>
    </a>
  )
}
