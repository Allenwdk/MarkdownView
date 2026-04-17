/**
 * Markdown 预览组件
 * 将 Markdown 内容渲染为 HTML 并显示
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { MarkdownPreviewProps } from '@/types';
import { renderMarkdown } from '@/lib/markdown';

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // 使用 useMemo 缓存渲染结果，避免重复渲染
  const renderedHtml = useMemo(() => {
    if (!content.trim()) {
      return getPlaceholderHTML();
    }
    return renderMarkdown(content);
  }, [content]);

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <span className="toolbar-title">预览</span>
        <span className="preview-status">实时渲染</span>
      </div>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        // XSS 防护已在 renderMarkdown 中通过 DOMPurify 处理
      />
    </div>
  );
}

/**
 * 获取占位提示的 HTML
 */
function getPlaceholderHTML(): string {
  return `
    <div class="preview-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <h3>开始编写 Markdown</h3>
      <p>在左侧编辑器中输入内容，或粘贴 Markdown 文本</p>
      <div class="preview-hints">
        <p><strong>标题:</strong> # 一级标题 / ## 二级标题</p>
        <p><strong>粗体:</strong> <code>**粗体文本**</code></p>
        <p><strong>列表:</strong> - 项目符号 / 1. 有序列表</p>
        <p><strong>代码:</strong> <code>{'\u0060'}行内代码{'\u0060'}</code> 或代码块</p>
        <p><strong>链接:</strong> [文本](URL)</p>
        <p><strong>图片:</strong> ![替代文本](图片URL)</p>
      </div>
    </div>
  `;
}
