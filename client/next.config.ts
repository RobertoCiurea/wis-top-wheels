import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "frankfurt.apollo.olxcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
