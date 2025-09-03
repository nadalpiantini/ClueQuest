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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },

  // Images optimization
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
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

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // TypeScript configuration
  typescript: {
    // TODO: Fix type issues before production
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // TODO: Fix linting issues before production
    ignoreDuringBuilds: false,
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