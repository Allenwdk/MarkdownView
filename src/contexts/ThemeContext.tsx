/**
 * 主题上下文
 * 管理应用程序的主题状态（浅色/深色/跟随系统）
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeContextType, ThemeMode } from '@/types';

// 本地存储中主题模式的键名
const THEME_MODE_KEY = 'md-theme-mode';
// 本地存储中主题颜色的键名
const THEME_COLOR_KEY = 'md-theme-color';

/**
 * 根据主题模式和系统偏好获取当前应使用的主题颜色
 */
function getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    // 检查系统是否偏好深色模式
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/**
 * 主题上下文初始值（空对象，运行时才会被真实值替换）
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题提供者组件
 * 包装整个应用，为所有子组件提供主题状态
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 从 localStorage 读取用户上次选择的主题模式，默认为 'system'
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(THEME_MODE_KEY) as ThemeMode) || 'system';
    }
    return 'system';
  });

  // 当前实际生效的主题颜色
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 当模式或系统偏好变化时，计算并应用实际主题
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(mode);
    setTheme(effectiveTheme);

    // 将主题应用到 HTML 根元素，用于 CSS 变量和 Tailwind 的 dark 类
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // 保存用户选择的模式到 localStorage
    localStorage.setItem(THEME_MODE_KEY, mode);
  }, [mode]);

  // 监听系统主题变化（仅在 mode === 'system' 时生效）
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const effectiveTheme = getEffectiveTheme(mode);
      setTheme(effectiveTheme);
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(effectiveTheme);
    };

    // 兼容不同浏览器的 API 名称
    mediaQuery.addEventListener?.('change', handleChange);
    // 旧版浏览器兼容
    mediaQuery.addListener?.(handleChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleChange);
      mediaQuery.removeListener?.(handleChange);
    };
  }, [mode]);

  // 切换主题模式的函数
  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  // 手动在浅色和深色之间切换
  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return 'light'; // 如果当前是 system，切换到 dark
    });
  }, [setMode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 使用主题的自定义 Hook
 * 必须在 ThemeProvider 内部使用
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  return context;
}
