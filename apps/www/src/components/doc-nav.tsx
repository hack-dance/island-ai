import Link from "next/link"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { ArrowRight } from "lucide-react"

import { docs, DocType } from "@/config/docs"

export function DocNav({ packageConfig }: { packageConfig: DocType }) {
  return (
    <>
      <ScrollArea className="h-full">
        <div className="pb-6">
          <div className="flex flex-col gap-2">
            {Object.values(docs).map(({ title, indexRoute }) => (
              <>
                <Link
                  key={title}
                  href={`/docs/${indexRoute}`}
                  className="flex items-center gap-2 text-xs hover:underline"
                >
                  <h3 className="text-sm font-okineBold tracking-widest uppercase">{title}</h3>
                  {packageConfig.title !== title && <ArrowRight className="h-4 w-4" />}
                </Link>
                {packageConfig.title === title && (
                  <>
                    {packageConfig.sections.map((docSection, index) => (
                      <div key={index} className="ml-2">
                        <h3 className="mb-2 text-sm font-semibold">{docSection.title}</h3>
                        <div className="grid grid-flow-row auto-rows-max text-sm mb-2">
                          {docSection.pages.map(doc => (
                            <div key={doc.title}>
                              {doc?.titlePage ? (
                                <h4 className="mb-1 rounded-md px-2 text-sm font-semibold">
                                  <Link
                                    replace={false}
                                    className="hover:underline"
                                    href={`/docs/${doc.slug}`}
                                  >
                                    {doc.title}
                                  </Link>
                                </h4>
                              ) : (
                                <Link
                                  replace={false}
                                  scroll={false}
                                  className="font-medium text-muted-foreground group flex w-full items-center rounded-md border border-transparent px-3 py-1 hover:underline"
                                  href={`/docs/${doc.slug}`}
                                >
                                  {doc.title}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
