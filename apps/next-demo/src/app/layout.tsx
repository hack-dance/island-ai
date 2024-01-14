import "@/styles/globals.css"

import { ReactNode } from "react"
import { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/logo-mark"
import ModeToggle from "@/components/mode-toggle"
import { defaultFontMapper } from "@/styles/fonts"

import Providers from "./providers"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: "resizes-content"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased overflow-hidden h-screen w-screen font-default",
        ...Object.values(defaultFontMapper)
      )}
    >
      <body className="antialiased bg-background">
        <Providers>
          <>
            <div
              className="h-screen w-screen flex flex-col overflow-hidden bg-background"
              vaul-drawer-wrapper=""
            >
              <header className="w-full py-4 px-4 h-[64px] backdrop-blur-md bg-background/90 dark:bg-background/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center lg:gap-6 gap-2">
                    <div className="flex items-center">
                      <h1 className="text-lg font-okineBold overflow-hidden whitespace-nowrap">
                        <Link
                          href="/"
                          className="flex items-center gap-1 tracking-widest text-2xl text-foreground/90"
                        >
                          <LogoMark size={24} />
                        </Link>
                      </h1>

                      <nav className="space-x-8 ml-12">
                        {siteConfig.mainNav.map(({ label, url }) => (
                          <Link
                            className="text-xs hover:underline font-okineMedium uppercase tracking-widest text-muted-foreground hover:text-foreground"
                            href={url}
                            key={label}
                          >
                            {label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>

                  <div className="gap-4 items-center flex">
                    <div className="ml-[-2px] mt-[4px] flex items-center gap-6">
                      <ModeToggle />
                    </div>
                  </div>
                </div>
              </header>

              <main className="h-[calc(100dvh-64px)] w-full flex-1 flex flex-col overflow-hidden texture">
                {children}
              </main>
            </div>
          </>
        </Providers>
      </body>
    </html>
  )
}
