import type { NextConfig } from "next";

const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isStaticDemo ? "export" : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    }
  }
};

export default nextConfig;
