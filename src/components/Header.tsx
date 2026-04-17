/**
 * 顶部导航栏组件
 * 显示应用标题和操作按钮
 */

'use client';

import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        {/* 应用标题和图标 */}
        <div className="header-title">
          <svg
            className="header-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h1 className="header-text">Markdown 预览</h1>
        </div>

        {/* 右侧操作区 */}
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
