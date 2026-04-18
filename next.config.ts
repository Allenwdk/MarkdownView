import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出，用于 GitHub Pages 部署
  // 构建产物将输出到 ./out 目录
  output: 'export',
};

export default nextConfig;
