import fs from "fs"
import { createMDX } from "fumadocs-mdx/next"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  async redirects() {
    return [
      {
        source: "/docs/schema-stream/:path*",
        destination: "https://github.com/hack-dance/schema-stream",
        permanent: true
      }
    ]
  }
}

const options = {
  keepBackground: false,
  theme: JSON.parse(fs.readFileSync(new URL("./moonlight-ii.json", import.meta.url)))
}

const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, options]]
  }
})

const { experimental, webpack: _webpack, ...mdxConfig } = withMDX(nextConfig)
const { turbo, ...remainingExperiments } = experimental ?? {}

const configuredNext = {
  ...mdxConfig,
  ...(Object.keys(remainingExperiments).length > 0 ? { experimental: remainingExperiments } : {}),
  ...(turbo ? { turbopack: turbo } : {})
}

export default configuredNext
