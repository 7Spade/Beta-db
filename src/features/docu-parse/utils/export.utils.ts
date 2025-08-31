/**
 * @fileoverview 文件匯出相關的工具函數
 */
import { EXPORT_FILE_NAMES } from '@/features/docu-parse/constants';
import type { WorkItem } from '@/features/docu-parse/types';

/**
 * 將工料清單資料匯出為 CSV 檔案。
 * @param data - 要匯出的工料清單陣列。
 * @param fileName - 匯出的檔案名稱 (不含副檔名)。
 */
export const exportToCSV = (data: WorkItem[], fileName: string = EXPORT_FILE_NAMES.WORK_ITEMS) => {
  const headers = ['項次', '名稱', '數量', '單價', '總價'];
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      `"${row.id}","${row.name.replace(/"/g, '""')}",${row.quantity},${row.unitPrice},${row.total || 0}`
    )
  ].join('\n');

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 將工料清單資料匯出為 JSON 檔案。
 * @param data - 要匯出的工料清單陣列。
 * @param fileName - 匯出的檔案名稱 (不含副檔名)。
 */
export const exportToJSON = (data: WorkItem[], fileName: string = EXPORT_FILE_NAMES.WORK_ITEMS) => {
  // 移除前端計算的 total 欄位
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jsonContent = JSON.stringify(data.map(({ total, ...rest }) => rest), null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
