import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    'playwright-core',
    'playwright',
    '@sparticuz/chromium',
  ],
};

export default nextConfig;
