"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@ui/lib/utils"

import * as React from "react"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { blank?: boolean }
>(({ className, blank = false, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        {
          "animate-in fade-in-20 slide-in-from-top-1 z-50 items-center rounded-md border border-stone-200 bg-white shadow-md":
            !blank
        },
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
