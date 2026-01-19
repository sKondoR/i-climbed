import NextFederationPlugin from '@module-federation/nextjs-mf';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      // Глобальные безопасные заголовки
      {
        source: '/(.*)', // Применяется ко всем маршрутам
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' https://i-climbed-card.vercel.app; connect-src 'self' https://i-climbed-card.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
        ],
      },
    ];
  },
  reactStrictMode: true,
  // turbopack: {},
  serverExternalPackages: [
    'playwright-core',
    'playwright',
    '@sparticuz/chromium',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
   webpack: (config, context) => {
    const mfConfig = new NextFederationPlugin({
      name: 'host_app',
      filename: 'remoteEntry.js',
      remotes: {
        // microfrontend: 'microfrontend@http://localhost:3001/_next/static/chunks/remoteEntry.js',
        // Продакшен (по необходимости):
        microfrontend: `microfrontend@https://i-climbed-card.vercel.app/_next/static/chunks/remoteEntry.js?__t=${Date.now()}`,
      },
      shared: {
        // react: {
        //   singleton: true,
        //   eager: true,
        //   requiredVersion: false,
        // },
        // 'react-dom': {
        //   singleton: true,
        //   eager: true,
        //   requiredVersion: false,
        // },
      },
      extraOptions: {
        // automaticAsyncBoundary: true,
        // enableCompatibility: true,
      },
    });

    config.plugins.push(mfConfig);

    // Keep externals
    config.externals.push('playwright-core', 'playwright', '@sparticuz/chromium');


    // Настройка publicPath только на клиенте
    if (!context.isServer) {
      config.output = {
        ...config.output,
        publicPath: 'auto',
      };
    }

    return config;
  },
};

export default nextConfig;
