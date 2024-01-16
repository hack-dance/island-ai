import { Inconsolata, Inter, Zilla_Slab } from "next/font/google"
import localFont from "next/font/local"

export const zillaBold = Zilla_Slab({
  weight: "700",
  variable: "--font-serif",
  subsets: ["latin"]
})

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: true,
  display: "swap"
})

export const inconsolata = Inconsolata({
  variable: "--font-mono",
  subsets: ["latin"]
})

export const blunt = localFont({
  src: "./sp-blunt-regular.woff2",
  variable: "--font-blunt",
  preload: true,
  display: "swap"
})

export const bluntOutline = localFont({
  src: "./sp-blunt-outline.woff2",
  variable: "--font-blunt-outline",
  preload: true,
  display: "swap"
})

export const okineBold = localFont({
  src: "./made-okine-sans-bold.woff2",
  variable: "--font-okine-bold",
  preload: true,
  display: "swap"
})

export const okineBoldOutline = localFont({
  src: "./made-okine-sans-bold-outline.woff2",
  variable: "--font-okine-bold-outline",
  preload: true,
  display: "swap"
})

export const okineBlack = localFont({
  src: "./made-okine-sans-black.woff2",
  variable: "--font-okine-black",
  preload: true,
  display: "swap"
})

export const okine = localFont({
  src: "./made-okine-sans-regular.woff",
  variable: "--font-okine",
  preload: true,
  display: "swap"
})

export const okineMedium = localFont({
  src: "./made-okine-sans-medium.woff",
  variable: "--font-okine-medium",
  preload: true,
  display: "swap"
})

export const okineBlackOutline = localFont({
  src: "./made-okine-sans-black-outline.woff2",
  variable: "--font-okine-black-outline",
  preload: true,
  display: "swap"
})

export const fantasqueRegular = localFont({
  src: "./FantasqueSansMono-Regular.woff2",
  variable: "--font-default"
})

export const fantasqueBold = localFont({
  src: "./FantasqueSansMono-Bold.woff2",
  variable: "--font-bold"
})

export const defaultFontMapper = {
  inter: inter.variable,
  serif: zillaBold.variable,

  mono: fantasqueRegular.variable,
  monoBold: fantasqueBold.variable,

  blunt: blunt.variable,
  bluntOutline: bluntOutline.variable,
  okineBold: okineBold.variable,
  okineBoldOutline: okineBoldOutline.variable,
  okineBlack: okineBlack.variable,
  okineBlackOutline: okineBlackOutline.variable,
  okine: okine.variable,
  okineMedium: okineMedium.variable
}
