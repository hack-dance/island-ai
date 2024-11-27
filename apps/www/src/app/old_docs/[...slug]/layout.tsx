import { notFound } from "next/navigation"

import { docs } from "@/config/docs"

import { DocSidebar } from "../sidebar"

export default async function DocLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ slug: string[] }>
  }
) {
  const params = await props.params;

  const {
    slug
  } = params;

  const {
    children
  } = props;

  const parsedSlug = slug?.[0]?.split("#")[0]
  const packageConfig = docs[parsedSlug]

  if (!packageConfig) {
    return notFound()
  }

  return (
    <>
      <div className="flex  h-full flex-1 w-full relative">
        <DocSidebar packageConfig={packageConfig} />

        <div className="w-full flex-grow pl-2 border-l-[1px] border-accent h-full max-w-full">
          <main className="h-full w-full overflow-y-auto max-w-full pb-4">{children}</main>
        </div>
      </div>
    </>
  )
}
