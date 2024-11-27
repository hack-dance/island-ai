import { cn } from "@ui/lib/utils"

import React from "react"

export const AnimatedBorderWrapper = ({
  children,
  enabled,
  strokeWidth = 3,
  className
}: {
  children: React.ReactNode
  enabled: boolean
  strokeWidth?: number
  className?: string
}) => {
  if (!enabled) return <>{children}</>

  return (
    <div
      className={cn(
        `from-cheese to-grass group relative w-full min-w-full overflow-hidden rounded-full bg-white bg-gradient-to-r p-[2px] shadow-xl transition-all duration-300 ease-in-out`,
        {
          "className": !!className,
          "p-[4px]": strokeWidth === 4,
          "p-[3px]": strokeWidth === 3,
          "p-[2px]": strokeWidth === 2,
          "p-[1px]": strokeWidth === 1
        }
      )}
    >
      <div className="animate-spin-slow visible absolute inset-x-[30%] inset-y-[-1200%] bg-gradient-to-r from-transparent via-gray-100/80 to-transparent"></div>
      <div className="relative z-50 size-full rounded-full bg-white">{children}</div>
    </div>
  )
}
