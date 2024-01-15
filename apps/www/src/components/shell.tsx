"use client"

import { useEffect, useRef } from "react"
import sdk from "@stackblitz/sdk"

export function Shell() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref?.current) {
      sdk.embedProjectId("embed", "sdk-open-embed-sb-projects-ts", {
        forceEmbedLayout: true,
        openFile: "index.ts",
        view: "editor",
        hideExplorer: true,
        hideNavigation: true,
        devToolsHeight: 33
      })
    }
  }, [ref])
  return <div className="my-6 block" ref={ref} id="embed" />
}
