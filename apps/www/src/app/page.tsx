import { ScrollArea } from "@repo/ui/components/ui/scroll-area"

import { BadgeLogo } from "@/components/badge-logo"
import { Footer } from "@/components/footer"

export default async function Page() {
  return (
    <ScrollArea className="flex-1 h-[calc(100dvh-64px)]">
      <div className="h-full">
        <div className="px-6 sm:px-0 sm:container flex flex-col items-center justify-center sm:mx-auto min-h-[calc(100dvh-64px)]">
          <BadgeLogo size={186} />
          {/* <h1 className="font-okineBold text-4xl">ISLAND AI</h1> */}
          <p className="max-w-xl sm:text-center mt-12 mb-6">
            A TypeScript toolkit for building dynamic, ai-generated UI with structured, streaming,
            immeadately safe-to-parse JSON from from OpenAI & AnyScale.
          </p>
        </div>
      </div>
      <Footer />
    </ScrollArea>
  )
}
