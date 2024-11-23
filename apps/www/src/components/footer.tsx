import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export async function Footer() {
  return (
    <footer className="w-full py-12 border-t border-accent/70 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3 grid-cols-2">
          <div className="space-y-2 mx-auto">
            <h3 className="text-xs tracking-widest uppercase font-okineBold">BUILT BY</h3>
            <Link className="font-okineBold text-xl" href="">
              Hack Dance
            </Link>
          </div>
          <div className="space-y-2 mx-auto">
            <h3 className="text-xs tracking-widest uppercase font-okineBold">Connect</h3>
            <ul className="flex flex-col space-y-2">
              <li>
                <div className="flex items-center justify-center gap-4">
                  <Link href="https://www.linkedin.com/in/dimitri-kennedy/" target="_blank">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                  <Link href="https://www.github.com/hack-dance/island-ai" target="_blank">
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link href="https://www.twitter.com/dimitrikennedy/" target="_blank">
                    <Twitter className="w-5 h-5" />
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          <div className="max-w-[420px] mx-auto flex flex-col items-center justify-center space-y-6 h-full mt-4 md:-mt-4 col-start-1 col-end-3 md:col-start-auto md:col-end-auto">
            <article>
              <small></small>
              <small></small>
              <p className="text-xs"></p>
            </article>
          </div>
        </div>

        <div className="px-4 flex justify-between items-center mt-8 border-t border-gray-accent/70 pt-8 text-foreground/60 text-sm space-y-2">
          <div>
            <p>Hack Dance © 2023</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
