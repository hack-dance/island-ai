import fs from "fs"
import { createMDX } from "fumadocs-mdx/next"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"]
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

export default withMDX(nextConfig)
