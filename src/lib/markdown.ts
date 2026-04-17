/**
 * Markdown 渲染配置
 * 配置 marked 解析器和代码高亮
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

/**
 * 为 marked 创建 highlight.js 插件
 * 使用 marked 的 extensions API 来添加代码高亮支持
 */
function getHighlightExtension() {
  return {
    extensions: [
      {
        name: 'highlight',
        level: 'block' as const,
        tokenizer(input: string) {
          const match = input.match(/^```([^\n]*)\n([^]*)?```$/);
          if (match) {
            return {
              type: 'highlight',
              raw: input,
              lang: match[1].trim(),
              code: (match[2] || '').replace(/\n$/, ''),
            };
          }
          return undefined;
        },
        renderer(token: { type: string; lang: string; code: string }) {
          if (token.type === 'highlight') {
            let highlighted: string;
            if (token.lang && hljs.getLanguage(token.lang)) {
              try {
                highlighted = hljs.highlight(token.code, {
                  language: token.lang,
                }).value;
              } catch {
                highlighted = hljs.highlightAuto(token.code).value;
              }
            } else {
              highlighted = hljs.highlightAuto(token.code).value;
            }
            return `<pre><code class="hljs ${token.lang}">${highlighted}</code></pre>\n`;
          }
          return undefined;
        },
      },
    ],
  };
}

/**
 * 初始化 Markdown 渲染器配置
 * 此函数应在应用启动时调用一次
 */
export function initMarkdownRenderer(): void {
  // 启用 GFM（GitHub Flavored Markdown）支持
  // 包括：表格、删除线、任务列表、自动链接等
  marked.use(getHighlightExtension());
  
  // 设置 marked 全局选项
  marked.setOptions({
    gfm: true, // 启用 GitHub 风格 Markdown
    breaks: true, // 支持换行符转换为 <br>
  });
}

/**
 * 将 Markdown 文本转换为安全的 HTML
 * @param markdown - Markdown 格式的字符串
 * @returns 清洗后的 HTML 字符串
 */
export function renderMarkdown(markdown: string): string {
  try {
    // marked 生成 HTML
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    // 使用 DOMPurify 清洗 HTML，移除危险标签和属性
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      // 允许的 HTML 标签列表
      ALLOWED_TAGS: [
        'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'strong', 'em', 'del', 'a', 'img', 'hr', 'details', 'summary',
      ],
      // 允许的 HTML 属性
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'data-lang', 'checked'],
    });
    return cleanHtml;
  } catch {
    // 解析失败时返回纯文本
    return `<pre>${markdown}</pre>`;
  }
}
