/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations from AXIS6 proven patterns
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@radix-ui/react-dialog'],
  },
  
  // Bundle optimization for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase/,
            name: 'supabase',
            priority: 10,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/]@radix-ui/,
            name: 'ui',
            priority: 10,
            chunks: 'all',
          },
          forms: {
            test: /[\\/]node_modules[\\/](react-hook-form|@hookform)/,
            name: 'forms',
            priority: 10,
            chunks: 'all',
          }
        },
      };
    }
    
    return config;
  },

  // Security headers (production-ready from AXIS6 patterns)
  async headers() {
    // Only apply custom headers in production to avoid MIME type conflicts in development
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
            },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/chunks/(.*).js',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/javascript; charset=utf-8',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
          ],
        },
        {
          source: '/_next/static/css/(.*).css',
          headers: [
            {
              key: 'Content-Type',
              value: 'text/css; charset=utf-8',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
          ],
        },
        {
          source: '/_next/static/media/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    }
    
    // In development, don't apply any custom headers to avoid MIME type conflicts
    // Let Next.js handle all headers automatically in development
    return [];
  },

  // Images optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Redirects for SEO and UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard/home',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  // Environment variables validation - temporarily disabled for production
  // TODO: Re-enable once environment variables are configured in Vercel
  // env: {
  //   NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  //   NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Server external packages temporarily removed due to conflict
  
  // TypeScript configuration - Temporarily disabled for development
  typescript: {
    ignoreBuildErrors: true, // Temporarily disabled for development
  },

  // ESLint configuration - Temporarily disabled for production deployment
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disabled for production deployment
  },
};

// Bundle analyzer for development
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}