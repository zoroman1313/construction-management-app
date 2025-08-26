import type { NextConfig } from "next";

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: "/", destination: "/accounting", permanent: true },
    ];
  },
};

export default nextConfig;
