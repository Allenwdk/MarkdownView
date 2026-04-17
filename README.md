# Markdown 预览工具

一个基于 Next.js 构建的现代化 Markdown 预览与转换工具。支持实时编辑、代码高亮、导出 PDF/PNG 以及深浅色主题切换。

## ✨ 功能特性

- 📝 **实时预览** — 左侧编辑、右侧渲染，即时查看 Markdown 效果
- 📤 **多种导入方式** — 直接粘贴文本或拖拽上传 `.md` / `.markdown` 文件
- 📄 **导出功能** — 一键导出为 PDF（A4 分页）或高清 PNG 图片
- 🌗 **主题系统** — 浅色 / 深色 / 跟随系统三种模式，平滑过渡动画
- 💻 **代码高亮** — 支持 100+ 编程语言的语法高亮
- 🔒 **安全渲染** — DOMPurify 清洗 HTML，防止 XSS 攻击
- 📱 **响应式设计** — 完美适配桌面端和移动端

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **Markdown 解析**: marked
- **代码高亮**: highlight.js
- **XSS 防护**: DOMPurify
- **PDF 导出**: jsPDF + html2canvas
- **样式**: Tailwind CSS 4 + CSS 变量

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
npm run build
npm start
```

## 📂 项目结构

```
markdown-view/
├── src/
│   ├── app/                    # Next.js 路由和全局样式
│   ├── components/             # React 组件
│   ├── contexts/               # React Context（主题管理）
│   ├── lib/                    # 工具函数（渲染、导出）
│   └── types/                  # TypeScript 类型定义
├── public/                     # 静态资源
└── package.json
```

## 📖 使用方法

1. **编辑内容**：在左侧编辑器中输入 Markdown 文本，或粘贴已有的 Markdown 内容
2. **上传文件**：点击"上传文件"按钮或拖拽 `.md` 文件到指定区域
3. **预览效果**：右侧实时显示渲染后的 Markdown 预览
4. **导出文件**：点击右上角的 PDF 或 PNG 按钮，即可下载对应格式的文件
5. **切换主题**：点击右上角的主题切换按钮，选择浅色、深色或跟随系统

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
