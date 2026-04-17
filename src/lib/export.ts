/**
 * 导出功能实现
 * 提供 PDF 和 PNG 导出功能
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * 将预览区域导出为 PDF 并下载
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

    // 使用 html2canvas 将 DOM 元素转换为 canvas
    // scale: 2 提高导出清晰度
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true, // 允许跨域图片
      logging: false, // 关闭日志
      backgroundColor: getComputedStyle(document.documentElement).backgroundColor || '#ffffff',
    });

    // 计算 PDF 尺寸（A4 比例）
    const imgWidth = 210; // A4 宽度（毫米）
    const pageHeight = 297; // A4 高度（毫米）
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgUrl = canvas.toDataURL('image/png');

    // 创建 jsPDF 实例
    const pdf = new jsPDF('p', 'mm', 'a4');

    // 如果内容超过一页，分页处理
    let position = 0;
    let heightLeft = imgHeight;

    // 第一页
    pdf.addImage(imgUrl, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 添加后续页面
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 保存 PDF 文件
    pdf.save(`${filename}.pdf`);
    hideExportingStatus();
  } catch (error) {
    console.error('PDF 导出失败:', error);
    alert('PDF 导出失败，请稍后重试');
    hideExportingStatus();
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

    // 使用 html2canvas 将 DOM 元素转换为 canvas
    const canvas = await html2canvas(element, {
      scale: 3, // PNG 使用更高倍率以获得更好清晰度
      useCORS: true,
      logging: false,
      backgroundColor: getComputedStyle(document.documentElement).backgroundColor || '#ffffff',
    });

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
