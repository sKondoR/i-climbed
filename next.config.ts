import NextFederationPlugin from '@module-federation/nextjs-mf';

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Явно отключаем webpack и разрешаем использование Turbopack,
  // но с пустой конфигурацией, чтобы подавить ошибку
  turbopack: {}, // ← это подавляет ошибку, но остаётся совместимым с webpack-плагинами в development

  // ВАЖНО: Webpack-конфигурация НЕ будет использоваться при включённом Turbopack
  // Module Federation пока НЕ поддерживается в Turbopack, поэтому принудительно используем webpack
};

// Экспортируем улучшенную конфигурацию с отключением Turbopack
const config = {
  ...nextConfig,
  // Принудительно отключаем Turbopack, чтобы работал @module-federation/nextjs-mf
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
} satisfies NextConfig;

// Экспортируем через withBundleAnalyzer
// export default withBundleAnalyzer(config);
export default config;