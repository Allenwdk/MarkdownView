/**
 * 文件上传组件
 * 支持点击选择和拖拽上传 Markdown 文件
 */

'use client';

import React, { useRef, useState } from 'react';
import { FileUploadProps } from '@/types';

export default function FileUpload({ onContentChange }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 处理文件选择
  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // 重置 input 值，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // 处理拖拽上传
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  // 处理文件读取
  function processFile(file: File) {
    // 验证文件类型
    const validTypes = ['.md', '.markdown', '.mdx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(ext)) {
      alert('请上传 .md 或 .markdown 格式的文件');
      return;
    }

    // 读取文件内容
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentChange(content);
    };
    reader.onerror = () => {
      alert('文件读取失败，请重试');
    };
    reader.readAsText(file, 'UTF-8');
  }

  return (
    <div className="file-upload-area">
      {/* 隐藏的文件输入框 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.mdx"
        onChange={handleFileSelect}
        className="file-input-hidden"
        aria-hidden="true"
      />

      {/* 点击触发文件选择 */}
      <button
        className="file-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        <svg
          className="file-upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="file-upload-text">上传文件</span>
      </button>

      {/* 拖拽上传区域 */}
      <div
        className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="file-drop-text">
          {isDragging ? '松开以上传文件' : '或拖拽文件到此处'}
        </p>
        <p className="file-drop-hint">支持 .md、.markdown 格式</p>
      </div>
    </div>
  );
}
