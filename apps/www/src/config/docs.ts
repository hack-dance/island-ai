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
            title: "Instructor JS",
            slug: "overview/instructor",
            id: "overview-instructor"
          }
        ]
      },
      {
        title: "Concepts",
        pages: [
          {
            title: "Stuctured Responses",
            slug: "overview/concepts/structured-responses",
            id: "overview-concepts-structured-responses"
          },
          {
            title: "Partial Streaming",
            slug: "overview/concepts/partial-streaming",
            id: "overview-concepts-partial-streaming"
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
    indexRoute: "zod-stream/introduction",
    sections: [
      {
        title: "Overview",
        pages: [
          {
            title: "Introduction",
            slug: "zod-stream/introduction",
            id: "zod-stream"
          },
          {
            title: "Getting started",
            slug: "zod-stream/getting-started",
            id: "zod-stream-getting-started"
          },
          {
            title: "API reference",
            slug: "zod-stream/api",
            id: "zod-stream-api"
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
    indexRoute: "stream-hooks/introduction",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Introduction",
            slug: "stream-hooks/introduction",
            id: "stream-hooks"
          },
          {
            title: "Getting started",
            slug: "stream-hooks/getting-started",
            id: "stream-hooks-getting-started"
          },
          {
            title: "API reference",
            slug: "stream-hooks/api",
            id: "stream-hooks-api"
          }
        ]
      }
    ]
  }
  // "schema-stream": {
  //   title: "schema-stream",
  //   indexRoute: "/schema-stream",
  //   sections: [
  //     {
  //       title: "Getting started",
  //       pages: [
  //         {
  //           title: "Install",
  //           slug: "schema-stream",
  //           id: "schema-stream"
  //         }
  //       ]
  //     }
  //   ]
  // },
  // "ai-ui": {
  //   title: "ai-ui",
  //   indexRoute: "/ai-ui",
  //   sections: [
  //     {
  //       title: "Getting started",
  //       pages: [
  //         {
  //           title: "Install",
  //           slug: "ai-ui",
  //           id: "ai-ui"
  //         }
  //       ]
  //     }
  //   ]
  // },
  // "instructor": {
  //   title: "instructor",
  //   indexRoute: "/instructor",
  //   sections: [
  //     {
  //       title: "Getting started",
  //       pages: [
  //         {
  //           title: "Install",
  //           slug: "instructor",
  //           id: "instructor"
  //         }
  //       ]
  //     }
  //   ]
  // }
}
