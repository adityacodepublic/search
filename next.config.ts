import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", // Allow local development
        "xkw2cs3d-3000.inc1.devtunnels.ms", // Allow your dev tunnel host
        // Add any other allowed origins as needed
      ],
    },
  },
  /* config options here */
};

export default nextConfig;
