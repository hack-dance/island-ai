import type { MDXComponents } from "mdx/types"

import { customComponents } from "./components/mdx-components"

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...customComponents
  }
}
