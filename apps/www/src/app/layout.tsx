import "@/styles/globals.css"

import { ReactNode } from "react"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { defaultFontMapper } from "@/styles/fonts"

import Providers from "./providers"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: "Island AI",
    description: "",
    url: "https://island.hack.dance",
    siteName: "Island AI",
    locale: "en_US",
    type: "website",
    images: []
  },
  twitter: {
    title: "Island AI",
    card: "summary_large_image",
    creator: "@dimitrikennedy"
  },
  icons: {
    shortcut: "/favicon.ico"
  }
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
      className={cn(...Object.values(defaultFontMapper), "antialiased font-inter")}
    >
      <body className="antialiased bg-background flex flex-col min-h-screen">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
