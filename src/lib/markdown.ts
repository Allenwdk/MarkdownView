/**
 * Markdown 渲染配置
 * 配置 marked 解析器和代码高亮
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

/**
 * 初始化 Markdown 渲染器配置
 * 此函数应在应用启动时调用一次
 */
export function initMarkdownRenderer(): void {
  // 启用 GFM（GitHub Flavored Markdown）支持
  marked.use({
    gfm: true,
    breaks: true,
  });

  // 覆盖 code token 的渲染器，添加 highlight.js 代码高亮
  marked.use({
    renderer: {
      code({ text, lang, escaped }) {
        // 如果代码块有语言标识，进行语法高亮
        if (lang && !escaped) {
          let highlighted: string;
          if (hljs.getLanguage(lang)) {
            try {
              highlighted = hljs.highlight(text, { language: lang }).value;
            } catch (err) {
              console.warn(`hljs highlight error for language: ${lang}`, err);
              highlighted = hljs.highlightAuto(text).value;
            }
          } else {
            highlighted = hljs.highlightAuto(text).value;
          }
          return `<pre><code class="hljs ${lang}">${highlighted}</code></pre>\n`;
        }

        // 没有语言标识或转义的代码块，直接输出
        const codeContent = escaped ? text.replace(/^/, '&') : text;
        return `<pre><code class="hljs">${codeContent}</code></pre>\n`;
      },
    },
  });
}

/**
 * 将 Markdown 文本转换为安全的 HTML
 * @param markdown - Markdown 格式的字符串
 * @returns 清洗后的安全 HTML 字符串
 */
export function renderMarkdown(markdown: string): string {
  try {
    // marked 生成 HTML（会自动调用 renderer.code）
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    // 使用 DOMPurify 清洗 HTML，移除危险标签和属性
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      // 允许的 HTML 标签列表
      ALLOWED_TAGS: [
        'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'strong', 'em', 'del', 'a', 'img', 'hr', 'details', 'summary',
        'span', // 支持 highlight.js 代码高亮
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
