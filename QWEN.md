# Markdown 预览工具 (markdown-view)

## 项目概述

一个基于 Next.js 16 构建的现代化 Markdown 预览与转换工具。支持实时 Markdown 编辑与渲染、文件上传、导出 PDF/PNG 以及深浅色主题切换。界面优雅，响应式设计，完美适配桌面端和移动端。

### 核心功能

- **实时预览** — 左侧编辑、右侧渲染，即时查看 Markdown 效果
- **多种导入方式** — 直接粘贴文本或拖拽上传 `.md` / `.markdown` 文件
- **导出功能** — 一键导出为 PDF（A4 分页）或高清 PNG 图片
- **主题系统** — 浅色 / 深色 / 跟随系统三种模式，平滑过渡动画
- **代码高亮** — 基于 highlight.js 的 100+ 编程语言语法高亮
- **安全渲染** — DOMPurify 清洗 HTML，防止 XSS 攻击
- **响应式布局** — 桌面端双栏并排，移动端上下布局自适应

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 16.2.4 |
| 语言 | TypeScript | 5.x |
| UI 库 | React | 19.2.4 |
| Markdown 解析 | marked | 18.0.1 |
| 代码高亮 | highlight.js | 11.11.1 |
| XSS 防护 | DOMPurify | 3.4.0 |
| PDF 导出 | iframe + window.print()（矢量化 PDF） |
| 样式 | Tailwind CSS 4 + CSS 变量 | 4.x |

## 项目结构

```
markdown-view/
├── src/
│   ├── app/                          # Next.js App Router 路由
│   │   ├── layout.tsx                # 根布局：字体、主题提供者、元数据
│   │   ├── page.tsx                  # 主页面：整合所有组件
│   │   └── globals.css               # 全局样式：CSS 变量 + 主题 + 响应式
│   ├── components/                   # React 组件
│   │   ├── Header.tsx                # 顶部导航栏（标题 + 主题切换入口）
│   │   ├── ThemeToggle.tsx           # 主题下拉菜单（浅色/深色/跟随系统）
│   │   ├── MarkdownEditor.tsx        # Markdown 编辑器（文本输入 + Tab 缩进）
│   │   ├── MarkdownPreview.tsx       # Markdown 预览渲染（useMemo 缓存）
│   │   ├── ExportButtons.tsx         # 导出按钮组（PDF/PNG）
│   │   └── FileUpload.tsx            # 文件上传（点击 + 拖拽）
│   ├── contexts/                     # React Context
│   │   └── ThemeContext.tsx          # 主题状态管理（localStorage 持久化）
│   ├── lib/                          # 工具函数库
│   │   ├── markdown.ts               # marked 配置 + DOMPurify 安全渲染
│   │   └── export.ts                 # PDF/PNG 导出逻辑
│   └── types/                        # TypeScript 类型定义
│       └── index.ts                  # 全局类型（ThemeMode、Props 接口等）
├── public/                           # 静态资源
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config (via postcss.config.mjs)
└── eslint.config.mjs
```

## 构建与运行

### 开发模式

```bash
npm run dev
```

启动开发服务器，访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

优化并生成生产版本。

### 启动生产服务器

```bash
npm start
```

### 代码检查

```bash
npm run lint
```

## 架构设计

### 主题系统

采用 **Context + CSS 变量** 双轨方案：

1. `ThemeContext` 管理用户选择的主题模式（`light | dark | system`）
2. 模式变化时自动更新 `<html>` 元素的 class（`light` / `dark`）
3. CSS 变量根据 class 切换，实现全页面主题联动
4. 用户选择持久化到 `localStorage`
5. 跟随系统模式通过 `matchMedia('prefers-color-scheme: dark')` 实时响应

### Markdown 渲染管线

```
Markdown 文本
    ↓
marked.parse() → 原始 HTML
    ↓
DOMPurify.sanitize() → 清洗后的安全 HTML
    ↓
dangerouslySetInnerHTML → 渲染到页面
```

代码块通过自定义 `marked` 扩展插件处理，调用 highlight.js 进行语法高亮。

### 导出流程

1. 通过 `useRef` 获取预览区域 DOM 元素
2. **PNG**: 提取 `.markdown-body` 内容 → `html2canvas` 转为 canvas（scale 3x）→ DataURL → 下载
3. **PDF**: 创建隐藏 iframe → 注入当前页面 CSS（绝对 URL）和主题 class → `window.print()` 生成矢量化 PDF → 用户选择"另存为 PDF"

## 开发约定

- 所有源代码使用 **TypeScript**，严格模式（`strict: true`）
- 所有组件和工具函数均使用 **中文注释**
- 使用 `@/*` 路径别名指向 `src/` 目录
- 组件文件使用 `.tsx` 后缀，工具文件使用 `.ts` 后缀
- 客户端组件使用 `'use client'` 指令
- CSS 使用 Tailwind CSS 4 的 `@tailwind` 指令 + 自定义 CSS 变量
- 主题相关样式通过 CSS 变量实现，避免硬编码颜色

## 可扩展性

- **渲染插件** — 在 `lib/markdown.ts` 中添加新的 marked 扩展即可支持新语法
- **导出方案** — `lib/export.ts` 封装了导出逻辑，可替换为其他库
- **主题扩展** — 在 `globals.css` 的 CSS 变量中新增颜色变量即可
- **组件复用** — 各组件职责单一，可独立抽取为共享组件库
