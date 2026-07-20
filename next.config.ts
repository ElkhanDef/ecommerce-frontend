import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are served by the backend's object storage (MinIO in dev).
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/products/**",
      },
    ],
    // Next 16 blocks upstream images that resolve to private IPs (SSRF guard).
    // MinIO runs on localhost in dev; keep this OFF in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
