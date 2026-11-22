import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/payment/cancelled",
        destination: "/payment/cancel",
      },
      {
        source: "/payment/failed",
        destination: "/payment/cancel",
      },
    ];
  },
};

export default nextConfig;
