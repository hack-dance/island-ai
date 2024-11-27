import type { ReactNode } from "react"
import Link from "next/link"
import { baseOptions } from "@/app/layout.config"
import { DocsLayout } from "fumadocs-ui/layouts/docs"

import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      sidebar={{
        footer: (
          <div className="py-4">
            <Link
              className="hover:underline uppercase font-okineBold flex flex-col"
              href="https://hack.dance"
              target="_blank"
            >
              <span className="text-muted-foreground text-xs">Built in Boston by</span>
              <span className="text-sm font-okineBold">HACK DANCE</span>
            </Link>
          </div>
        )
      }}
    >
      {children}
    </DocsLayout>
  )
}
