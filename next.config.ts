import NextFederationPlugin from '@module-federation/nextjs-mf';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  serverExternalPackages: [
    'playwright-core',
    'playwright',
    '@sparticuz/chromium',
  ],
   webpack: (config, context) => {
    const mfConfig = new NextFederationPlugin({
      name: 'host_app',
      filename: 'remoteEntry.js',
      remotes: {
        // microfrontend: 'microfrontend@http://localhost:3001/_next/static/chunks/remoteEntry.js',
        // Продакшен (по необходимости):
        microfrontend: 'microfrontend@https://edit-route-image-mf.vercel.app/_next/static/chunks/remoteEntry.js',
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
    config.externals.push(
      'playwright-core',
      'playwright',
      '@sparticuz/chromium'
    );

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
