# 雲端儲存路徑工具函數

這個目錄包含了用於處理雲端儲存路徑的統一工具函數，解決了之前路徑結構設計中的問題。

## 問題背景

之前的實作中存在以下路徑處理問題：

1. **路徑計算錯誤**：使用 `lastIndexOf('/')` 計算父路徑時，根目錄檔案會導致錯誤
2. **路徑標準化不一致**：不同函數中對路徑的處理方式不一致
3. **缺少統一的路徑工具函數**：重複的邏輯和潛在的錯誤

## 工具函數說明

### `getParentPath(path: string): string`
獲取父路徑，正確處理根目錄情況
```typescript
getParentPath('folder/file.txt') // 返回 'folder'
getParentPath('file.txt')        // 返回 '' (根目錄)
getParentPath('')                // 返回 '' (根目錄)
```

### `normalizePath(path: string): string`
標準化路徑，去除開頭和結尾的斜線
```typescript
normalizePath('/folder/subfolder/') // 返回 'folder/subfolder'
normalizePath('folder/subfolder')   // 返回 'folder/subfolder'
```

### `joinPath(base: string, name: string): string`
連接路徑，正確處理空路徑情況
```typescript
joinPath('folder', 'file.txt')     // 返回 'folder/file.txt'
joinPath('', 'file.txt')           // 返回 'file.txt'
```

### `isValidPath(path: string): boolean`
驗證路徑是否包含有效字符
```typescript
isValidPath('folder/file.txt')     // 返回 true
isValidPath('folder/file*.txt')    // 返回 false
```

### `getPathName(path: string): string`
獲取路徑的最後一段（檔案或資料夾名稱）
```typescript
getPathName('folder/subfolder/file.txt') // 返回 'file.txt'
getPathName('folder')                    // 返回 'folder'
```

### `isRootPath(path: string): boolean`
檢查是否為根目錄
```typescript
isRootPath('')        // 返回 true
isRootPath('/')       // 返回 true
isRootPath('folder')  // 返回 false
```

### `buildFullPath(currentPath: string, name: string): string`
建立完整路徑，自動處理路徑連接
```typescript
buildFullPath('folder', 'subfolder')     // 返回 'folder/subfolder'
buildFullPath('', 'folder')              // 返回 'folder'
```

## 使用範例

```typescript
import { getParentPath, buildFullPath, isValidPath } from './path.utils';

// 重命名操作
const oldPath = 'folder/file.txt';
const newName = 'newfile.txt';
const parentPath = getParentPath(oldPath);        // 'folder'
const newPath = buildFullPath(parentPath, newName); // 'folder/newfile.txt'

// 建立資料夾
const currentPath = 'folder/subfolder';
const folderName = 'newfolder';
const fullPath = buildFullPath(currentPath, folderName); // 'folder/subfolder/newfolder'

// 路徑驗證
if (!isValidPath(folderName)) {
  throw new Error('無效的資料夾名稱');
}
```

## 修復的問題

1. ✅ 重命名操作中的路徑計算錯誤
2. ✅ 建立資料夾時的路徑計算錯誤
3. ✅ 路徑標準化不一致
4. ✅ 根目錄處理不當
5. ✅ 缺少統一的路徑工具函數

## 注意事項

- 所有路徑都使用正斜線 `/` 作為分隔符
- 路徑驗證支援中文字符、數字、英文字母、空格、連字號、底線和點號
- 根目錄用空字串 `''` 表示
- 路徑操作都是不可變的，不會修改原始路徑
