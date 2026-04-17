/**
 * 主题模式类型定义
 */

/** 主题模式枚举 */
export type ThemeMode = 'light' | 'dark' | 'system';

/** 主题上下文接口 */
export interface ThemeContextType {
  /** 当前实际生效的主题 */
  theme: 'light' | 'dark';
  /** 用户选择的主题模式 */
  mode: ThemeMode;
  /** 切换主题模式的函数 */
  setMode: (mode: ThemeMode) => void;
  /** 手动切换为另一主题的函数 */
  toggleTheme: () => void;
}

/** 导出格式枚举 */
export type ExportFormat = 'pdf' | 'png';

/** 导出组件的 props */
export interface ExportButtonsProps {
  /** 预览区域的 ref */
  previewRef: React.RefObject<HTMLElement | null>;
}

/** 文件上传组件的 props */
export interface FileUploadProps {
  /** 文件内容变化回调 */
  onContentChange: (content: string) => void;
}

/** Markdown 编辑器的 props */
export interface MarkdownEditorProps {
  /** 编辑器内容 */
  value: string;
  /** 内容变化回调 */
  onChange: (value: string) => void;
}

/** 预览区域的 props */
export interface MarkdownPreviewProps {
  /** Markdown 内容 */
  content: string;
}
