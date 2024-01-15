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
  "overview": {
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
            title: "Validation & type safety",
            slug: "overview#validation-type-safety",
            id: "validation"
          }
        ]
      },
      {
        title: "Concepts",
        pages: [
          {
            title: "LLMs & streaming",
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
          },
          {
            title: "Agents",
            slug: "agents",
            id: "agents"
          }
        ]
      },
      {
        title: "Guides",
        pages: [
          {
            title: "Getting started",
            slug: "getting-started",
            id: "getting-started"
          },
          {
            title: "Building dynamic UI",
            slug: "overview#building-dynamic-ui",
            id: "building-dynamic-ui"
          },
          {
            title: "Validating LLM Responses",
            slug: "overview#validating-llm-responses",
            id: "validating-llm-responses"
          },
          {
            title: "LLM orchestration",
            slug: "overview#llm-orchestration",
            id: "llm-orchestration"
          }
        ]
      }
    ]
  },
  "zod-stream": {
    title: "zod-stream",
    indexRoute: "/zod-stream",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "zod-stream",
            id: "zod-stream"
          },
          {
            title: "Usage",
            slug: "zod-stream#usage",
            id: "usage"
          },
          {
            title: "API",
            slug: "zod-stream#api",
            id: "api"
          }
        ]
      },
      {
        title: "Examples",
        pages: [
          {
            title: "Basic example",
            slug: "zod-stream/examples",
            id: "examples"
          },
          {
            title: "Next.js",
            slug: "zod-stream/examples/next",
            id: "examples-next"
          },
          {
            title: "Express",
            slug: "zod-stream/examples/express",
            id: "examples-express"
          }
        ]
      }
    ]
  },
  "stream-hooks": {
    title: "stream-hooks",
    indexRoute: "/stream-hooks",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "stream-hooks",
            id: "stream-hooks"
          }
        ]
      }
    ]
  },
  "schema-stream": {
    title: "schema-stream",
    indexRoute: "/schema-stream",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "schema-stream",
            id: "schema-stream"
          }
        ]
      }
    ]
  },
  "ai-ui": {
    title: "ai-ui",
    indexRoute: "/ai-ui",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "ai-ui",
            id: "ai-ui"
          }
        ]
      }
    ]
  },
  "instructor": {
    title: "instructor",
    indexRoute: "/instructor",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "instructor",
            id: "instructor"
          }
        ]
      }
    ]
  }
}
