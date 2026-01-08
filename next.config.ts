import type { NextConfig } from "next";
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  serverExternalPackages: [
    'typeorm',
    'playwright-core',
    'playwright',
    '@sparticuz/chromium',
  ],
    webpack: (config, { isServer }) => {
    if (isServer) {
      // Копируем .ts файлы моделей в выходную директорию
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/models'),
              to: path.join(config.output.path, 'src/models'),
              noErrorOnMissing: true,
              // Явно указываем, что нужно копировать .ts файлы
              globOptions: {
                ignore: ['**/.git', '**/node_modules/**'],
              },
            },
          ],
        })
      );

      // Обработка .ts файлов на сервере с помощью ts-loader
      config.module.rules.push({
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src/models')],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          },
        ],
      });
    }

    return config;
  },
};

export default nextConfig;

