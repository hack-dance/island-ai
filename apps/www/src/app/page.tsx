import { ScrollArea } from "@repo/ui/components/ui/scroll-area"

import { Footer } from "@/components/footer"

export default async function Page() {
  return (
    <ScrollArea className="flex-1 h-[calc(100dvh-64px)]">
      <div className="h-full">
        <div className="px-6 sm:px-0 sm:container flex flex-col items-center justify-center sm:mx-auto min-h-[calc(100dvh-64px)]">
          <h1 className="font-okineBold text-4xl">ISLAND AI</h1>
          <p className="max-w-xl sm:text-center mt-4 mb-6">
            a TypeScript toolkit for engaging with structured outputs from Large Language Models. It
            offers streamlined processes for handling, parsing, streaming, and leveraging
            AI-generated data across various applications.
          </p>
        </div>
      </div>
      <Footer />
    </ScrollArea>
  )
}
