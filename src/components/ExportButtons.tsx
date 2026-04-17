/**
 * 导出按钮组件
 * 提供 PDF 和 PNG 导出功能
 */

'use client';

import React, { useState } from 'react';
import { ExportButtonsProps } from '@/types';
import { exportToPDF, exportToPNG } from '@/lib/export';

export default function ExportButtons({ previewRef }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  // 处理导出操作
  async function handleExport(format: 'pdf' | 'png') {
    if (isExporting) return;

    setIsExporting(true);
    try {
      if (format === 'pdf') {
        await exportToPDF(previewRef.current, 'markdown-preview');
      } else {
        await exportToPNG(previewRef.current, 'markdown-preview');
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="export-buttons">
      <button
        className={`export-btn pdf-btn ${isExporting ? 'exporting' : ''}`}
        onClick={() => handleExport('pdf')}
        disabled={isExporting}
        title="导出为 PDF"
      >
        <svg
          className="export-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18v-6" />
          <path d="M9 15l3 3 3-3" />
        </svg>
        <span>PDF</span>
      </button>

      <button
        className={`export-btn png-btn ${isExporting ? 'exporting' : ''}`}
        onClick={() => handleExport('png')}
        disabled={isExporting}
        title="导出为 PNG"
      >
        <svg
          className="export-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>PNG</span>
      </button>
    </div>
  );
}
