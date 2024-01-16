import Link from "next/link"
import { Button } from "@repo/ui/components/ui/button"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"

import { BadgeLogo } from "@/components/badge-logo"
import { Footer } from "@/components/footer"

export default async function Page() {
  return (
    <ScrollArea className="flex-1 h-[calc(100dvh-64px)]">
      <div className="h-full">
        <div className="max-w-lg px-6 sm:px-0 flex flex-col items-center justify-center sm:mx-auto min-h-[calc(100dvh-64px)]">
          <BadgeLogo size={186} />

          <p className="sm:text-center mt-12 mb-6 font-mono">
            A TypeScript toolkit for building dynamic ai-generated UI with structured, streaming,
            immediately safe-to-parse JSON from OpenAI or AnyScale.
          </p>

          <div className="flex items-center gap-2">
            <Link href="/docs/overview">
              <Button>Read the docs</Button>
            </Link>
            <Link href="/docs/overview">
              <Button variant="secondary">Live demo</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </ScrollArea>
  )
}
