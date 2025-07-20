const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(
  withPWA({
    images: {
      domains: [
        'cdn.shopify.com',
        'images.unsplash.com',
        'assets.example.com',
        'media.graphassets.com',
        'img.examplecdn.com',
      ],
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [320, 420, 768, 1024, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    i18n: {
      locales: ['en', 'es', 'pt'],
      defaultLocale: 'en',
      localeDetection: true,
    },
    compress: true,
    swcMinify: true,
    experimental: {
      optimizeImages: true,
    },
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
    },
  })
);