import Link from "next/link"
import { Github, Linkedin, XTwitter } from "@mynaui/icons-react"

export const Footer = () => {
  return (
    <footer className="w-full">
      <div className="container">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <nav className="text-muted-foreground flex flex-wrap items-center space-x-4 text-xs font-medium">
            <Link
              className="hover:underline uppercase text-sm font-okineBold"
              href="https://hack.dance"
              target="_blank"
            >
              HACK DANCE
            </Link>
          </nav>

          <nav className="text-muted-foreground flex items-center gap-4">
            <Link href="https://www.linkedin.com/company/hack-dance" target="_blank">
              <Linkedin className="size-5" />
            </Link>
            <Link href="https://www.github.com/hack-dance/island-ai" target="_blank">
              <Github className="size-5" />
            </Link>
            <Link href="https://www.twitter.com/dimitrikennedy/" target="_blank">
              <XTwitter className="size-5" />
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="text-muted-foreground text-xs">© 2020 Hack Dance, LLC.</p>
          <div></div>
        </div>
      </div>
    </footer>
  )
}
