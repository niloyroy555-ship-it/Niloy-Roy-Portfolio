const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
    ],
  },
  // Renamed from experimental.serverComponentsExternalPackages in Next 15
  serverExternalPackages: ['mongodb'],
  // @splinetool/react-spline v4 ships ESM-only exports; transpile so webpack resolves it
  transpilePackages: ['@splinetool/react-spline'],
<<<<<<< HEAD
  // Tree-shakes icon imports (lucide-react is used across nav/hero/timeline/
  // portfolio/contact/project-modal) so each file only ships the specific
  // icons it uses instead of pulling in the whole library's module graph.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
=======
>>>>>>> e4e5c0790b84505e04ce215325278357d3e46051
  webpack(config, { dev }) {
    // @splinetool/react-spline v4 exports map lacks a "default" condition which
    // breaks webpack resolution — alias straight to the dist ESM file.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@splinetool/react-spline': require('path').resolve(
        __dirname,
        'node_modules/@splinetool/react-spline/dist/react-spline.js'
      ),
    };
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
