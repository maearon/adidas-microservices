interface CarouselTitleProps {
  title?: React.ReactNode
}

export default function CarouselTitle({ title }: CarouselTitleProps) {
  if (!title) return null
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-3xl font-semibold uppercase tracking-widest leading-tight break-words">
        {title}
      </h3>
    </div>
  )
}
