# 遷移指南：從 contracts.actions.ts 到模組化架構

## 遷移概述

本文檔說明如何從原有的 `src/app/actions/contracts.actions.ts` 遷移到新的模組化合約架構。

## 遷移步驟

### 1. 更新導入路徑

**舊的導入方式：**
```tsx
import { createProjectAndContractFromDocument } from '@/app/actions/contracts.actions';
```

**新的導入方式：**
```tsx
import { createProjectAndContractFromDocument } from '@/components/features/contracts';
```

### 2. 功能對比

| 功能 | 舊路徑 | 新路徑 | 狀態 |
|------|--------|--------|------|
| createProjectAndContractFromDocument | ✅ | ✅ | 已遷移 |
| 類型定義 | ❌ | ✅ | 新增 |
| 錯誤處理 | ✅ | ✅ | 已優化 |

### 3. 新增功能

- **類型安全**: 完整的 TypeScript 類型定義
- **模組化**: 與現有合約模組完全整合
- **可重用性**: 支援 Server 和 Client Components

### 4. 使用示例

#### 在 Server Components 中

```tsx
import { createProjectAndContractFromDocument } from '@/components/features/contracts';

export default function DocumentProcessor() {
  async function processDocument(formData: FormData) {
    'use server';
    
    const result = await createProjectAndContractFromDocument({
      docDetails: {
        customId: formData.get('customId') as string,
        name: formData.get('name') as string,
        client: formData.get('client') as string,
        clientRepresentative: formData.get('clientRepresentative') as string,
      },
      workItems: JSON.parse(formData.get('workItems') as string),
    });
    
    if (result.error) {
      // 處理錯誤
    }
  }
  
  return (
    <form action={processDocument}>
      {/* 表單內容 */}
    </form>
  );
}
```

#### 在 Client Components 中

```tsx
'use client';

import { createProjectAndContractFromDocument } from '@/components/features/contracts';

export function DocumentProcessor() {
  const handleSubmit = async (data: any) => {
    const result = await createProjectAndContractFromDocument(data);
    
    if (result.error) {
      // 處理錯誤
    } else {
      // 處理成功
    }
  };
  
  return (
    <button onClick={() => handleSubmit(data)}>
      處理文件
    </button>
  );
}
```

## 注意事項

1. **類型安全**: 新架構提供完整的 TypeScript 支援
2. **錯誤處理**: 統一的錯誤處理格式
3. **模組化**: 與現有合約模組完全整合
4. **向後兼容**: 功能保持不變，只是路徑和架構優化

## 完成遷移

完成遷移後，您可以：

1. 刪除舊的 `src/app/actions/contracts.actions.ts` 文件
2. 更新所有相關的導入路徑
3. 享受新的模組化架構帶來的優勢