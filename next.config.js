/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable bundle analyzer in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        return entries;
      };
    }
    
    // Optimize chunks for better code splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            audio: {
              name: 'audio-player',
              test: /[\\/]components[\\/]podcast[\\/]AudioPlayer/,
              chunks: 'all',
              priority: 30,
            },
            ui: {
              name: 'ui-components',
              test: /[\\/]components[\\/]ui[\\/]/,
              chunks: 'all',
              priority: 20,
            },
            lucide: {
              name: 'lucide-icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              chunks: 'all',
              priority: 25,
            },
          },
        },
      };
    }

    return config;
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;