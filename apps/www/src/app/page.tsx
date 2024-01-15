import { ScrollArea } from "@repo/ui/components/ui/scroll-area"

import { Footer } from "@/components/footer"

export default async function Page() {
  return (
    <ScrollArea className="flex-1 h-[calc(100dvh-64px)]">
      <div className="h-full">
        <div className="px-6 sm:px-0 sm:container flex flex-col items-center justify-center sm:mx-auto min-h-[calc(100dvh-64px)]">
          <h1 className="font-okineBold text-2xl">Island AI</h1>
          <p className="max-w-xl sm:text-center mt-4 mb-6">
            A Practical Toolkit for Structured LLM Data Handling
          </p>
        </div>
      </div>
      <Footer />
    </ScrollArea>
  )
}
