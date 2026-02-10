import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: ['@sparticuz/chromium-min', 'playwright-core'],
};

export default nextConfig;
