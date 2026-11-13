import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // The app has two root layouts (language picker and /[lang]), so the 404 page must be global.
    globalNotFound: true,
  },
}

// Plugins are referenced by name so Turbopack can serialize them.
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
  },
})

export default withMDX(nextConfig)
