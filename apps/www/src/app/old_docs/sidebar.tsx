"use client"

import { useState } from "react"
import { Button } from "@repo/ui/components/ui/button"
import { List, XIcon } from "lucide-react"

import { DocType } from "@/config/docs"
import { cn } from "@/lib/utils"
import { DocNav } from "@/components/doc-nav"

export function DocSidebar({ packageConfig }: { packageConfig: DocType }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="lg:hidden absolute left-4 p-2">
        <Button variant="secondary" size="icon" className="shadow-xl border">
          <List className="h-4 w-4" onClick={() => setOpen(!open)} />
        </Button>
      </div>
      <aside
        className={cn(
          "shadow-xl lg:shadow-none top-0 border-r border-accent lg:border-transparent z-50 pl-4 pt-6 min-w-[280px] h-full absolute lg:static lg:block bg-background transition-all",
          {
            "translate-x-0": open,
            "lg:translate-x-0 -translate-x-full": !open
          }
        )}
      >
        <Button variant="secondary" size="icon" className="absolute right-4 top-3 z-20 lg:hidden">
          <XIcon className="h-4 w-4" onClick={() => setOpen(!open)} />
        </Button>
        <DocNav packageConfig={packageConfig} />
      </aside>
    </>
  )
}
