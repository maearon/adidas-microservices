import { cn } from "@/lib/utils"

type EmptyBagPopoverProps = {
  message: string
  className?: string
}

/** Empty bag panel — ~1.5× search width */
export function EmptyBagPopover({ message, className }: EmptyBagPopoverProps) {
  return (
    <div
      className={cn(
        "relative box-border flex w-[280px] items-center md:w-[292px] lg:w-[316px]",
        "border border-[#D3D7DA] bg-white px-4 py-6",
        "text-black dark:bg-black dark:text-white",
        className,
      )}
    >
      <p className="whitespace-nowrap text-[16px] font-bold leading-none">{message}</p>
    </div>
  )
}
