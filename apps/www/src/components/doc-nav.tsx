import Link from "next/link"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"

import { DocType } from "@/config/docs"

export function DocNav({ packageConfig }: { packageConfig: DocType }) {
  return (
    <>
      <ScrollArea className="h-full">
        <div className="pb-6">
          {packageConfig.sections.map((docSection, index) => (
            <div key={index}>
              <h3 className="mb-2 text-sm font-semibold">{docSection.title}</h3>
              <div className="grid grid-flow-row auto-rows-max text-sm mb-2">
                {docSection.pages.map(doc => (
                  <div key={doc.title}>
                    {doc?.titlePage ? (
                      <h4 className="mb-1 rounded-md px-2 text-sm font-semibold">
                        <Link replace={false} className="hover:underline" href={`/${doc.slug}`}>
                          {doc.title}
                        </Link>
                      </h4>
                    ) : (
                      <Link
                        replace={false}
                        scroll={false}
                        className="font-medium text-muted-foreground group flex w-full items-center rounded-md border border-transparent px-3 py-1 hover:underline"
                        href={`/${doc.slug}`}
                      >
                        {doc.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  )
}
