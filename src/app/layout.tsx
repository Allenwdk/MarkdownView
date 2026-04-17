/**
 * 根布局组件
 * 设置字体、主题提供者和全局元数据
 */

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { initMarkdownRenderer } from '@/lib/markdown';

// 初始化 Markdown 渲染器（仅在客户端执行）
if (typeof window !== 'undefined') {
  initMarkdownRenderer();
}

// 元数据定义
export const metadata: Metadata = {
  title: 'Markdown 预览工具',
  description: '一个优雅的 Markdown 预览和转换工具，支持导出 PDF 和 PNG',
};

// 视口配置（独立于 metadata）
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
