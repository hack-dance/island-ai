"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { RootProvider } from "fumadocs-ui/provider"
import { ThemeProvider, useTheme } from "next-themes"
import { Toaster } from "sonner"

export const AppContext = createContext({
  setData: () => {},
  data: {}
} as {
  setData: Dispatch<SetStateAction<{}>>
  data: {}
})
const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system"
  }
  return <Toaster theme={theme} />
}

export default function Providers({ children }: { children: ReactNode }) {
  const [data, setData] = useState({})

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppContext.Provider
        value={{
          setData,
          data
        }}
      >
        <ToasterProvider />
        <RootProvider>{children}</RootProvider>
      </AppContext.Provider>
    </ThemeProvider>
  )
}
