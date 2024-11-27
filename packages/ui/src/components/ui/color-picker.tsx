"use client"

import { Button } from "@ui/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/ui/popover"
import { cn } from "@ui/lib/utils"
import { Sketch } from "@uiw/react-color"
import { Paintbrush } from "lucide-react"

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
          <div className="flex w-full items-center gap-2">
            {background ?
              <div
                className="size-4 rounded !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            : <Paintbrush className="size-4" />}
            <div className="flex-1 truncate">{background ? background : "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border-none bg-transparent p-0 shadow-none">
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
