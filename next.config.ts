import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const isStandaloneBuild = process.env.NEXT_OUTPUT_STANDALONE === "true";

const nextConfig: NextConfig = {
  ...(isStandaloneBuild ? { output: "standalone" as const } : {}),
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        hostname: 'fhvmtnvjiotzztimdxbi.supabase.co',
      },
      {
        hostname: 'raw.githubusercontent.com',
      },
    ],
    deviceSizes: [320, 480, 768, 1024, 1200, 1440, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  pageExtensions: ['mdx', 'ts', 'tsx'],
  experimental: {
    useCache: true,
    mdxRs: true,
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'framer-motion',
      'd3',
    ],
  },
  compress: true,
  ...(isStandaloneBuild
    ? {
      outputFileTracingIncludes: {
        '/*': [
          '**/node_modules/@prisma/engines/libquery_engine-rhel-openssl-3.0.x.so.node',
          '**/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
        ],
        '/app/api/**': [
          '**/node_modules/.prisma/client/**',
        ],
      },
    }
    : {}),
  async headers() {
    return [
      {
        source: "/((?!embed).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'" },
        ],
      },
    ];
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
