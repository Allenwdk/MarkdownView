/**
 * 导出功能实现
 * 提供 PDF 和 PNG 导出功能
 */

import html2canvas from 'html2canvas';

/**
 * 将预览区域导出为 PDF 并下载（矢量化 PDF）
 * @param element - 要导出的 DOM 元素
 * @param filename - 下载的文件名（不含扩展名）
 */
export async function exportToPDF(element: HTMLElement | null, filename: string = 'markdown-preview'): Promise<void> {
  if (!element) {
    alert('预览区域不存在，请先输入 Markdown 内容');
    return;
  }

  try {
    // 显示加载提示
    showExportingStatus('正在生成 PDF...');

    // 获取预览容器的实际尺寸
    const rect = element.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    // 创建一个隐藏的 iframe 用于打印
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    document.body.appendChild(iframe);

     // 获取当前页面的样式，将相对 URL 转换为绝对 URL
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(tag => {
        if (tag.tagName === 'LINK' && tag.hasAttribute('href')) {
          const href = tag.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('data:')) {
            try {
              const absoluteHref = new URL(href, window.location.href).href;
              return tag.outerHTML.replace(`href="${href}"`, `href="${absoluteHref}"`);
            } catch {
              return tag.outerHTML;
            }
          }
        }
        return tag.outerHTML;
      })
      .join('\n');

     // PDF 导出统一使用浅色模板，避免深色模式背景渲染问题
    const lightBg = '#f8f9fc';
    const lightText = '#1a1a2e';

    // 获取 .markdown-body 的内容
    const markdownBody = element.querySelector('.markdown-body');
    const bodyContent = markdownBody ? markdownBody.innerHTML : element.innerHTML;

    // 构建 iframe 的 HTML 内容（强制浅色主题）
    const iframeHTML = `
      <!DOCTYPE html>
      <html class="light">
        <head>
          ${styles}
          <style>
            /* 重置样式 */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              width: ${width}px;
              height: ${height}px;
              overflow: hidden;
              background-color: ${lightBg} !important;
              color: ${lightText} !important;
            }

            /* 确保 markdown-body 样式正确应用 */
            .markdown-body {
              width: ${width}px;
              padding: 24px;
            }

            /* 打印样式 */
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="markdown-body">
            ${bodyContent}
          </div>
        </body>
      </html>
    `;

    // 写入 iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(iframeHTML);
      iframeDoc.close();
    }

    // 等待样式加载完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 调用打印对话框，用户可以选择"另存为 PDF"
    iframe.contentWindow?.focus();
    
    // 显示提示
    hideExportingStatus();
    
    // 使用 window.print() 生成矢量化 PDF
    // 用户可以在打印对话框中选择"另存为 PDF"
    const printWindow = iframe.contentWindow;
    if (printWindow) {
      printWindow.print();
    }

    // 清理 iframe
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  } catch (error) {
    console.error('PDF 导出失败:', error);
    alert('PDF 导出失败，请稍后重试');
    hideExportingStatus();
    
    // 清理 iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      document.body.removeChild(iframe);
    }
  }
}

/**
 * 将预览区域导出为 PNG 图片并下载
 * @param element - 要导出的 DOM 元素
 * @param filename - 下载的文件名（不含扩展名）
 */
export async function exportToPNG(element: HTMLElement | null, filename: string = 'markdown-preview'): Promise<void> {
  if (!element) {
    alert('预览区域不存在，请先输入 Markdown 内容');
    return;
  }

   try {
    showExportingStatus('正在生成 PNG...');

    // 只获取 .markdown-body 内容，不包含工具栏
    const markdownBody = element.querySelector('.markdown-body') as HTMLElement | null;
    const targetElement = markdownBody || element;

    // 获取当前主题的计算背景色（从 body 获取，因为 CSS 中背景色定义在 body 上）
    const computedBg = getComputedStyle(document.body).backgroundColor;
    const originalBg = targetElement.style.backgroundColor;
    targetElement.style.backgroundColor = computedBg;

    // 使用 html2canvas 将 DOM 元素转换为 canvas
    const canvas = await html2canvas(targetElement, {
      scale: 3, // PNG 使用更高倍率以获得更好清晰度
      useCORS: true,
      logging: false,
    });

    // 恢复原始背景色
    targetElement.style.backgroundColor = originalBg;

    // 将 canvas 转换为 PNG Data URL
    const imgUrl = canvas.toDataURL('image/png');

    // 创建临时下载链接
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    hideExportingStatus();
  } catch (error) {
    console.error('PNG 导出失败:', error);
    alert('PNG 导出失败，请稍后重试');
    hideExportingStatus();
  }
}

/**
 * 显示导出中的状态提示
 */
function showExportingStatus(message: string): void {
  // 移除已有的提示（如果有）
  hideExportingStatus();

  // 创建提示元素
  const toast = document.createElement('div');
  toast.id = 'export-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: fadeInUp 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
}

/**
 * 隐藏导出中的状态提示
 */
function hideExportingStatus(): void {
  const toast = document.getElementById('export-toast');
  if (toast) {
    toast.remove();
  }
}
