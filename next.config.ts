import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "greenyellow-lion-623632.hostingersite.com"],
  },

  webpack(config) {
    // ✅ Disable Webpack's built-in minification to prevent TypeError
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
