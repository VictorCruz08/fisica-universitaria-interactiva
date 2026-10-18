import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

/**
 * Sitio 100 % estático (output: 'export') publicado en GitHub Pages bajo
 * /fisica-universitaria-interactiva. `next/link` añade el basePath solo.
 */
const config: NextConfig = {
  output: 'export',
  basePath: '/fisica-universitaria-interactiva',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

// Con Turbopack los plugins se indican por nombre (deben ser serializables).
const conMDX = createMDX({
  options: {
    remarkPlugins: ['remark-math'],
    rehypePlugins: ['rehype-slug', ['rehype-katex', { strict: false }]],
  },
});

export default conMDX(config);
