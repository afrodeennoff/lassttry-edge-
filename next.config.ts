import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: "standalone",
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
  
  // Build performance optimizations
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
      '@tiptap/react',
      '@tiptap/starter-kit',
      'date-fns',
      'zod',
    ],
  },
  
  compress: true,
  
  // Optimize compiler for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  outputFileTracingIncludes: {
    '/*': [
      '**/node_modules/@prisma/engines/libquery_engine-rhel-openssl-3.0.x.so.node',
      '**/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    ],
    '/app/api/**': [
      '**/node_modules/.prisma/client/**',
    ],
  },
  
  // Optimize bundle splitting for better caching
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,

            // Framework chunk
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },

            // Libraries chunk
            lib: {
              test(module: any) {
                const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                if (match) {
                  const packageName = match[1];
                  if (packageName.startsWith('@radix-ui')) {
                    return true;
                  }
                  if (packageName.startsWith('d3')) {
                    return true;
                  }
                  if (packageName.startsWith('@tiptap')) {
                    return true;
                  }
                }
                return false;
              },
              name(module: any) {
                const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                if (match) {
                  const packageName = match[1];
                  if (packageName.startsWith('@radix-ui')) {
                    return 'radix-ui';
                  }
                  if (packageName.startsWith('d3')) {
                    return 'd3';
                  }
                  if (packageName.startsWith('@tiptap')) {
                    return 'tiptap';
                  }
                }
                return 'vendor';
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },

            // Common shared modules
            common: {
              name: 'common',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
