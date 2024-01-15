import { notFound } from "next/navigation"

import { docs } from "@/config/docs"
import { DocNav } from "@/components/doc-nav"

;("@/components/doc-header")

export default async function DocLayout({
  children,
  params: { slug }
}: {
  children: React.ReactNode
  params: { slug: string[] }
}) {
  const parsedSlug = slug?.[0]?.split("#")[0]
  const packageConfig = docs[parsedSlug]

  if (!packageConfig) {
    return notFound()
  }

  return (
    <>
      <div className="flex  h-full flex-1 w-full">
        <aside className="top-[64px] pl-4 pt-6 min-w-[280px] h-full lg:sticky hidden lg:block">
          <DocNav packageConfig={packageConfig} />
        </aside>

        <div className="w-full flex-grow pl-2 border-l-[1px] border-accent h-full max-w-full">
          <main className="h-full w-full overflow-y-auto max-w-full pb-4">{children}</main>
        </div>
      </div>
    </>
  )
}
