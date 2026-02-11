import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/k-cinema-bridge' : '',
};

export default nextConfig;
