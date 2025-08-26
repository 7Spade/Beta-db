/**
 * 雲端儲存路徑工具函數
 * 針對 Firebase Storage 扁平化結構優化
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
  // 允許中文、英文、數字、空格、連字符、底線、點號和斜線
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

/**
 * 從檔案路徑推斷資料夾結構
 * @param filePaths 檔案路徑陣列
 * @param currentPath 當前查詢路徑
 * @returns 資料夾路徑陣列
 */
export function extractFolderPaths(filePaths: string[], currentPath: string): string[] {
  const folders = new Set<string>();
  const prefix = currentPath ? `${currentPath}/` : '';
  
  filePaths.forEach(filePath => {
    if (filePath.startsWith(prefix)) {
      const relativePath = filePath.substring(prefix.length);
      const segments = relativePath.split('/');
      
      // 如果有多個段，表示有子資料夾
      if (segments.length > 1) {
        let folderPath = prefix;
        for (let i = 0; i < segments.length - 1; i++) {
          folderPath += segments[i];
          folders.add(folderPath);
          folderPath += '/';
        }
      }
    }
  });
  
  return Array.from(folders).sort();
}

/**
 * 檢查路徑是否為資料夾（通過檢查是否有子項目）
 * @param path 路徑
 * @param allPaths 所有檔案路徑
 * @returns 是否為資料夾
 */
export function isFolderPath(path: string, allPaths: string[]): boolean {
  const prefix = path.endsWith('/') ? path : `${path}/`;
  return allPaths.some(filePath => filePath.startsWith(prefix) && filePath !== prefix);
}
