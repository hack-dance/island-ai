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
            <h1 className="font-normal font-blunt text-sm overflow-hidden whitespace-nowrap">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-3xl leading-none tracking-tight">×</span>Island AI
              </Link>
            </h1>
          </SheetTitle>
        </SheetHeader>

        <h3 className="mt-12 px-2 text-xs text-muted-foreground font-bold">
          <Link className="hover:underline" href={"/docs/getting-started"}>
            DOCUMENTATION
          </Link>
        </h3>

        <div className="mt-4 pl-4">{/* <DocNav /> */}</div>
        <h3 className="mt-6 px-2 text-xs text-muted-foreground font-bold">
          <Link className="hover:underline" href={"/docs/getting-started"}>
            EXAMPLES
          </Link>
        </h3>

        <div className="mt-4 pl-4"></div>
      </SheetContent>
    </Sheet>
  )
}
