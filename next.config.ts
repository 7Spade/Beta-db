import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // 開發時啟用類型檢查，生產環境可選擇忽略
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // 開發時啟用 ESLint 檢查，生產環境可選擇忽略
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    config.output.webassemblyModuleFilename =
      (isServer ? '../' : '') + 'static/wasm/[modulehash].wasm';
    return config;
  },
};

export default nextConfig;
