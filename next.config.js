/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'illustrations.popsy.co',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' https://images.unsplash.com https://ui-avatars.com https://illustrations.popsy.co data:; default-src 'self'",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

