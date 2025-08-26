/**
 * 雲端儲存路徑工具函數
 * 統一處理路徑操作，避免路徑計算錯誤
 */

/**
 * 獲取父路徑
 * @param path 當前路徑
 * @returns 父路徑，如果是根目錄則返回空字串
 */
export function getParentPath(path: string): string {
  if (!path || path === '/') return '';
  const lastSlashIndex = path.lastIndexOf('/');
  return lastSlashIndex > 0 ? path.substring(0, lastSlashIndex) : '';
}

/**
 * 標準化路徑（去除開頭和結尾的斜線）
 * @param path 原始路徑
 * @returns 標準化後的路徑
 */
export function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

/**
 * 連接路徑
 * @param base 基礎路徑
 * @param name 檔案或資料夾名稱
 * @returns 連接後的路徑
 */
export function joinPath(base: string, name: string): string {
  if (!base) return name;
  return `${base}/${name}`;
}

/**
 * 驗證路徑是否有效
 * @param path 路徑
 * @returns 是否有效
 */
export function isValidPath(path: string): boolean {
  return /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.\/]+$/.test(path);
}

/**
 * 獲取路徑的最後一段（檔案或資料夾名稱）
 * @param path 路徑
 * @returns 最後一段名稱
 */
export function getPathName(path: string): string {
  if (!path) return '';
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
}

/**
 * 檢查是否為根目錄
 * @param path 路徑
 * @returns 是否為根目錄
 */
export function isRootPath(path: string): boolean {
  return !path || path === '/' || path === '';
}

/**
 * 建立完整路徑
 * @param currentPath 當前路徑
 * @param name 新名稱
 * @returns 完整路徑
 */
export function buildFullPath(currentPath: string, name: string): string {
  const normalizedCurrentPath = normalizePath(currentPath);
  return normalizedCurrentPath ? `${normalizedCurrentPath}/${name}` : name;
}
