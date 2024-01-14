export type DocType = {
  title: string
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
  main: {
    title: "main",
    sections: [
      {
        title: "Getting started",
        pages: [
          {
            title: "Install",
            slug: "main",
            id: "main"
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
