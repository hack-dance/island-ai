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
  overview: {
    title: "Overview",
    indexRoute: "/overview",
    sections: [
      {
        title: "Introduction",
        pages: [
          {
            title: "What is Island AI?",
            slug: "overview",
            id: "overview"
          },
          {
            title: "Why Island AI?",
            slug: "overview#why-island-ai",
            id: "why-island-ai"
          },
          {
            title: "How does it work?",
            slug: "overview#how-does-it-work",
            id: "how-does-it-work"
          },
          {
            title: "How is it different?",
            slug: "overview#how-is-it-different",
            id: "how-is-it-different"
          }
        ]
      }
    ]
  },
  concepts: {
    title: "Concepts",
    indexRoute: "/concepts",
    sections: [
      {
        title: "Concepts",
        pages: [
          {
            title: "Concepts",
            slug: "concepts",
            id: "concepts"
          },
          {
            title: "Stuctured Responses",
            slug: "structured-responses",
            id: "structured-responses"
          },
          {
            title: "Partial Streaming",
            slug: "partial-streaming",
            id: "partial-streaming"
          }
        ]
      }
    ]
  },
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
