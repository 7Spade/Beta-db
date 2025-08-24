# 遷移指南：從 documents.actions.ts 到模組化架構

## 遷移概述

本文檔說明如何從原有的 `src/app/actions/documents.actions.ts` 遷移到新的模組化 documents 架構。

## 遷移步驟

### 1. 更新導入路徑

**舊的導入方式：**
```tsx
import { extractDataFromDocument } from '@/app/actions/documents.actions';
```

**新的導入方式：**
```tsx
import { extractDataFromDocument } from '@/components/features/documents';
```

### 2. 功能對比

| 功能 | 舊路徑 | 新路徑 | 狀態 |
|------|--------|--------|------|
| extractDataFromDocument | ✅ | ✅ | 已遷移 |
| validateDocument | ❌ | ✅ | 新增功能 |
| 類型定義 | ❌ | ✅ | 新增 |
| 錯誤處理 | ✅ | ✅ | 已優化 |

### 3. 新增功能

- **validateDocument**: 文件格式和大小驗證
- **類型安全**: 完整的 TypeScript 類型定義
- **模組化**: 與現有 documents 模組完全整合
- **常數管理**: 支援的文件類型和大小限制

### 4. 使用示例

#### 在 Server Components 中使用

```tsx
import { extractDataFromDocument, validateDocument } from '@/components/features/documents';

export default function DocumentProcessor() {
  async function processDocument(formData: FormData) {
    'use server';
    
    // 先驗證文件
    const validation = await validateDocument({ isValid: false }, formData);
    if (!validation.isValid) {
      return { error: validation.error };
    }
    
    // 提取數據
    const result = await extractDataFromDocument({}, formData);
    return result;
  }
  
  return (
    <form action={processDocument}>
      {/* 表單內容 */}
    </form>
  );
}
```

#### 在 Client Components 中使用

```tsx
'use client';

import { extractDataFromDocument, validateDocument } from '@/components/features/documents';

export function DocumentProcessor() {
  const handleSubmit = async (formData: FormData) => {
    // 驗證文件
    const validation = await validateDocument({ isValid: false }, formData);
    if (!validation.isValid) {
      console.error(validation.error);
      return;
    }
    
    // 提取數據
    const result = await extractDataFromDocument({}, formData);
    if (result.error) {
      console.error(result.error);
    } else {
      console.log('提取成功:', result.data);
    }
  };
  
  return (
    <button onClick={() => handleSubmit(formData)}>
      處理文件
    </button>
  );
}
```

## 注意事項

1. **類型安全**: 新架構提供完整的 TypeScript 支援
2. **錯誤處理**: 統一的錯誤處理格式
3. **模組化**: 與現有 documents 模組完全整合
4. **向後兼容**: 功能保持不變，只是路徑和架構優化

## 完成遷移

完成遷移後，您可以：

1. 刪除舊的 `src/app/actions/documents.actions.ts` 文件
2. 更新所有相關的導入路徑
3. 享受新的模組化架構帶來的優勢
4. 使用新增的 `validateDocument` 功能