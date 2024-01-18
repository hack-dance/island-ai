// apps/www/src/app/docs/[...slug]/page.tsx
import dynamic from "next/dynamic"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"

import { docs } from "@/config/docs"
import { cn } from "@/lib/utils"

const allDocs = Object.values(docs)
const allPages = allDocs.flatMap(pkg =>
  pkg.sections.flatMap(section =>
    section.pages.map(page => ({
      ...page,
      package: pkg.title
    }))
  )
)

export async function generateStaticParams() {
  return allPages.map(page => ({
    params: {
      slug: page.slug.split("/")
    }
  }))
}

export default async function Page({ params: { slug } }: { params: { slug: string[] } }) {
  const doc = allPages.find(doc => doc.slug === slug.join("/"))

  if (!doc) {
    return notFound()
  }

  const Content = dynamic(() => import(`@/docs/${doc.id}.mdx`), {
    loading: () => (
      <div className="mt-[200px] h-full w-full flex justify-center items-center mt-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    )
  })

  return (
    <div className="p-4 min-h-full">
      <header className="border-b-[1px] border-b-accent pb-4 mb-8 pl-12 lg:pl-0">
        {[...slug].slice(0, -1).map((part, index) => {
          return (
            <span key={`${part}-${index}`}>
              {!!index && <span className="text-sm text-muted-foreground">{` / `}</span>}
              <span
                key={part}
                className={cn(
                  "text-sm text-muted-foreground hover:underline cursor-pointer capitalize"
                )}
              >
                <Link href={`/docs/${slug.slice(0, slug.indexOf(part) + 1).join("/")}`}>
                  {part.replace(/-/g, " ")}
                </Link>
              </span>
            </span>
          )
        })}
        <span className="text-sm text-muted-foreground">{` / `}</span>
        <span className="text-sm font-semibold">{doc.title}</span>
      </header>

      <div className="px-2 min-h-full">
        <Content />
      </div>
    </div>
  )
}
