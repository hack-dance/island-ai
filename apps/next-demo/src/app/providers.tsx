"use client"

import { Toaster } from "@repo/ui/components/ui/toaster"
import { ThemeProvider } from "next-themes"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      {children}
    </ThemeProvider>
  )
}
