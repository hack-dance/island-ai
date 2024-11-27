import { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { LogoMark } from "@/components/logo-mark"

export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/hack-dance/island-ai",
  nav: {
    title: (
      <>
        <LogoMark size={20} />
        <h1 className="text-2xl font-okineBold uppercase">Island AI</h1>
      </>
    )
  }
}
