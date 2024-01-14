"use client"

import dynamic from "next/dynamic"
import { Button } from "@repo/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@repo/ui/components/ui/dropdown-menu"
import { Monitor, Moon, SunDim } from "lucide-react"
import { useTheme } from "next-themes"

const appearances = [
  {
    theme: "System",
    icon: <Monitor className="h-4 w-4" />
  },
  {
    theme: "Light",
    icon: <SunDim className="h-4 w-4" />
  },
  {
    theme: "Dark",
    icon: <Moon className="h-4 w-4" />
  }
]

function ModeToggle() {
  const { theme: currentTheme, setTheme } = useTheme()
  const activeThemeItem = appearances.find(({ theme }) => theme.toLowerCase() === currentTheme)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 m-0 rounded-full h-auto cursor-pointer outline-none focus-visible:ring-0 text-muted-foreground hover:text-foreground"
          >
            {activeThemeItem?.icon}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" collisionPadding={24}>
          <DropdownMenuLabel>App settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentTheme} onValueChange={setTheme}>
            {appearances.map(({ theme, icon }) => (
              <DropdownMenuRadioItem key={theme} value={theme.toLowerCase()}>
                <div className="flex items-center space-x-2">
                  <div className="p-1">{icon}</div>
                  <span>{theme}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default dynamic(() => Promise.resolve(ModeToggle), {
  ssr: false,
  loading: () => <div className="text-xl h-auto mt-[-8px]">☺️</div>
})
