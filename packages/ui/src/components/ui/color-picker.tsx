"use client"

import { Sketch } from "@uiw/react-color"
import { Paintbrush } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ColorPicker({
  background,
  setBackground,
  className
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "justify-start text-left",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">{background ? background : "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-transparent border-none shadow-none p-0">
        <div className="w-full">
          <Sketch
            className="shadow-2xl"
            color={background}
            onChange={color => {
              setBackground(
                Object.values(color.hsl)
                  .map((value, index) => {
                    if (index === 0) {
                      return value.toFixed(0)
                    }

                    return `${value.toFixed(2)}%`
                  })
                  .join(" ")
              )
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
