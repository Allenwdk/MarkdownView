/**
 * 主题切换组件
 * 提供下拉菜单让用户选择主题模式
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeMode } from '@/types';

// 主题选项配置
const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: '浅色模式', icon: '☀️' },
  { value: 'dark', label: '深色模式', icon: '🌙' },
  { value: 'system', label: '跟随系统', icon: '💻' },
];

export default function ThemeToggle() {
  const { theme, mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 获取当前显示的主题图标
  const currentOption = THEME_OPTIONS.find((opt) => opt.value === mode);

  return (
    <div className="theme-toggle-wrapper" ref={dropdownRef}>
      {/* 主题切换按钮 */}
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="切换主题"
        aria-label="切换主题"
      >
        <span className="theme-toggle-icon">{currentOption?.icon}</span>
        <svg
          className={`theme-toggle-arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="theme-dropdown">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`theme-dropdown-item ${mode === option.value ? 'active' : ''}`}
              onClick={() => {
                setMode(option.value);
                setIsOpen(false);
              }}
            >
              <span className="theme-dropdown-icon">{option.icon}</span>
              <span className="theme-dropdown-label">{option.label}</span>
              {mode === option.value && (
                <span className="theme-dropdown-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
