/**
 * Markdown 编辑器组件
 * 提供文本输入区域和文件上传功能
 */

'use client';

import React, { useRef } from 'react';
import { MarkdownEditorProps } from '@/types';
import FileUpload from './FileUpload';

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 处理键盘快捷键
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl+Enter (Windows/Linux) 或 Cmd+Enter (Mac) - 聚焦预览
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      // 可以在这里添加滚动到预览的逻辑
    }
  }

  // 处理 Tab 键输入（插入空格而非切换焦点）
  function handleKeyDownTab(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 插入两个空格作为缩进
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // 恢复光标位置
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div className="editor-panel">
      {/* 编辑器工具栏 */}
      <div className="editor-toolbar">
        <span className="toolbar-title">编辑</span>
        <FileUpload onContentChange={onChange} />
      </div>

      {/* 文本输入区域 */}
      <textarea
        ref={textareaRef}
        className="markdown-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyDownCapture={handleKeyDownTab}
        placeholder="在此输入或粘贴 Markdown 内容...&#10;&#10;支持 # 标题、**粗体**、- 列表等语法&#10;按 Ctrl+Enter 快速预览"
        spellCheck={false}
        aria-label="Markdown 编辑器"
      />
    </div>
  );
}
