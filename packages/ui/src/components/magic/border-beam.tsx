import { cn } from "@ui/lib/utils"

import React from "react"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`
        } as React.CSSProperties
      }
      className={cn(
        "absolute inset-0 rounded-[inherit] border-[calc(var(--border-width)*1px)] border-transparent",
        "mask-clip-padding-box mask-clip-border-box mask-composite-intersect",
        "mask-linear-gradient-transparent-transparent mask-linear-gradient-white-white",
        "after:animate-border-beam after:absolute after:aspect-square after:w-[calc(var(--size)*1px)]",
        "after:animation-delay-[var(--delay)] after:background-linear-gradient-to-left-[var(--color-from),var(--color-to),transparent]",
        "after:offset-anchor-[calc(var(--anchor)*1%)]_50% after:offset-path-rect-0-auto-auto-0-round-[calc(var(--size)*1px)]",
        className
      )}
    />
  )
}
