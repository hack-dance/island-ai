export type DocType = {
  title: string
  indexRoute: string
  sections: {
    title: string
    pages: {
      titlePage?: boolean
      title: string
      slug: string
      id: string
    }[]
  }[]
}

export const docs: Record<string, DocType> = {
  core: {
    title: "core",
    indexRoute: "/core",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "core",
            id: "core"
          },
          {
            title: "Usage",
            slug: "core#usage",
            id: "usage"
          },
          {
            title: "API",
            slug: "core#api",
            id: "api"
          }
        ]
      },
      {
        title: "Examples",
        pages: [
          {
            title: "Basic example",
            slug: "core/examples",
            id: "examples"
          },
          {
            title: "Next.js",
            slug: "core/examples/next",
            id: "examples-next"
          },
          {
            title: "Express",
            slug: "core/examples/express",
            id: "examples-express"
          }
        ]
      }
    ]
  },
  hooks: {
    title: "hooks",
    indexRoute: "/hooks",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "hooks",
            id: "hooks"
          }
        ]
      }
    ]
  }
}
