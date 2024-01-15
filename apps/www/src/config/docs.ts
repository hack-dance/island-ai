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
  "@island-ai/client": {
    title: "@island-ai/client",
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
      },
      {
        title: "other..",
        pages: []
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
      },
      {
        title: "other..",
        pages: []
      }
    ]
  }
}
