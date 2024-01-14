import Link from "next/link"
import { Button } from "@repo/ui/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@repo/ui/components/ui/sheet"
import { PanelLeftOpen } from "lucide-react"

import { siteConfig } from "@/config/site"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"sm"} variant="ghost" className="px-2">
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <h1 className="text-lg font-okineBold overflow-hidden whitespace-nowrap">
              <Link
                href="/"
                className="flex items-center gap-1 tracking-widest text-2xl text-foreground/90"
              >
                NOTES
              </Link>
            </h1>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 pl-4">
          <nav className="space-y-6 flex flex-col">
            {siteConfig.mainNav.map(({ label, url }) => (
              <Link
                className="text-xs hover:underline font-okineMedium uppercase tracking-widest text-muted-foreground hover:text-foreground"
                href={url}
                key={label}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
