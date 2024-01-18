import Link from "next/link"
import { Button } from "@repo/ui/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@repo/ui/components/ui/sheet"
import { Menu } from "lucide-react"

import { siteConfig } from "@/config/site"

import { LogoMark } from "./logo-mark"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"sm"} variant="ghost" className="px-1 mr-4">
          <Menu className="h-5 w-5" />
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
                <LogoMark size={48} />
              </Link>
            </h1>
          </SheetTitle>
        </SheetHeader>

        <h3 className="mt-12 px-2 text-xs text-muted-foreground font-bold">
          <Link className="hover:underline" href={"/docs/getting-started"}>
            DOCUMENTATION
          </Link>
        </h3>
        <div className="mt-4 pl-4 flex flex-col gap-8">
          {siteConfig.mainNav.map(({ label, url }) => (
            <Link
              className="text-xs hover:underline font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
              href={url}
              key={label}
            >
              {label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
