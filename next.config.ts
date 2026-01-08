import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  serverExternalPackages: [
    'typeorm',
    'playwright-core',
    'playwright',
    '@sparticuz/chromium',
  ],
};

export default nextConfig;

