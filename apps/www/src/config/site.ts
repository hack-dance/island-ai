import { docs } from "./docs"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "island-ai",
  url: "https://island.novy.work",
  description: "",
  og: {
    title: "Island AI",
    description: ""
  },
  links: {
    twitter: {
      url: "https://twitter.com/dimitrikennedy",
      text: "@dimitrikennedy"
    },
    github: {
      url: "https://github.com/hack-dance/island-ai",
      text: "Github"
    }
  },
  mainNav: [
    ...Object.values(docs).map(doc => ({
      url: `/docs/${doc.indexRoute}`,
      label: doc.title
    }))
  ]
}
