import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },

  webpack(config) {
    // ✅ Disable Webpack's built-in minification to prevent TypeError
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
