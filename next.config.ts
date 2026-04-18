import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出，用于 GitHub Pages 部署
  // 构建产物将输出到 ./out 目录
  output: 'export',
  // 设置 basePath，适配 GitHub Pages 项目页面部署
  // 所有资源路径会自动添加 /MarkdownView 前缀
  basePath: '/MarkdownView',
};

export default nextConfig;
