"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export interface SliderWithValueProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const SliderWithValue = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderWithValueProps
>(({ className, defaultValue = [50], ...props }, ref) => {
  const [value, setValue] = React.useState<number[]>(defaultValue as number[])

  return (
    <div className="space-y-2">
      <div className="text-base text-muted-foreground">Giá trị: {value[0]}</div>
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        value={value}
        onValueChange={setValue}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  )
})

SliderWithValue.displayName = "SliderWithValue"

export { SliderWithValue }
