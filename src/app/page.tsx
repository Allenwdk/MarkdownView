/**
 * 主页面组件
 * 整合编辑器、预览和导出功能
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import MarkdownEditor from '@/components/MarkdownEditor';
import MarkdownPreview from '@/components/MarkdownPreview';
import ExportButtons from '@/components/ExportButtons';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

/** 默认示例 Markdown 内容 */
const DEFAULT_MARKDOWN = `# 欢迎使用 Markdown 预览工具 🎉

这是一个功能丰富的 Markdown 编辑器，支持实时预览和导出功能。

## 功能特性

- **实时预览** - 输入的同时即可看到渲染效果
- **多种导入方式** - 支持粘贴、拖拽上传 .md 文件
- **导出功能** - 一键导出为 PDF 或 PNG 格式
- **深浅色主题** - 支持浅色/深色/跟随系统三种模式
- **响应式设计** - 完美适配桌面和移动设备

## 代码示例

\`\`\`javascript
// JavaScript 代码高亮
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

\`\`\`python
# Python 代码高亮
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
\`\`\`

## 表格示例

| 功能 | 状态 | 说明 |
|------|------|------|
| Markdown 渲染 | ✅ 已完成 | 支持 GFM 语法 |
| 代码高亮 | ✅ 已完成 | 支持多种语言 |
| PDF 导出 | ✅ 已完成 | A4 纸张大小 |
| PNG 导出 | ✅ 已完成 | 高清分辨率 |

## 引用与格式

> 这是一段引用文字。
> 引用可以包含**粗体**、*斜体*等格式。

1. 有序列表第一项
2. 有序列表第二项
3. 有序列表第三项

- [x] 已完成的功能
- [ ] 待完成的功能

---

### 链接与图片

访问 [GitHub](https://github.com) 了解更多。

---

*开始编辑左侧内容，实时预览效果* ✨
`;

/**
 * 页面内容组件（需要在 ThemeProvider 内部使用）
 */
function PageContent() {
  const { theme } = useTheme();
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const previewRef = useRef<HTMLDivElement>(null);

  // 内容变化防抖处理
  const handleChange = useCallback(() => {
    // 这里可以添加保存逻辑
  }, []);

  // 监听内容变化
  useEffect(() => {
    const timer = setTimeout(handleChange, 500);
    return () => clearTimeout(timer);
  }, [content, handleChange]);

  return (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <Header />

      {/* 主内容区域 */}
      <main className="main-content">
        {/* 导出按钮栏 */}
        <div className="toolbar-bar">
          <ExportButtons previewRef={previewRef} />
        </div>

        {/* 编辑器和预览双栏 */}
        <div className="editor-preview-container">
          {/* 左侧编辑器 */}
          <div className="editor-column">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>

          {/* 右侧预览 */}
          <div className="preview-column" ref={previewRef}>
            <MarkdownPreview content={content} />
          </div>
        </div>
      </main>

      {/* 底部信息栏 */}
      <footer className="footer">
        <span>Markdown 预览工具</span>
        <span>支持导出 PDF & PNG</span>
      </footer>
    </div>
  );
}

/**
 * 主页面
 */
export default function Home() {
  return (
    <ThemeProvider>
      <PageContent />
    </ThemeProvider>
  );
}
