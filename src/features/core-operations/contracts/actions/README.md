# 合約 Server Actions

## 概述

本目錄包含合約模組的 Server Actions，遵循 NextJS 15 的最佳實踐。

## 架構設計

### 文件結構

```
actions/
├── contract-actions.ts    # Server Actions 實現
├── types.ts              # 類型定義
├── index.ts              # 統一導出
└── README.md             # 文檔說明
```

### 核心功能

- **createProjectAndContractFromDocument**: 從文件創建專案和合約
- **createContractAction**: 創建合約的 Server Action

## 使用方式

### 在 Server Components 中使用

```tsx
import { createContractAction } from '@/features/contracts';

export default function CreateContractPage() {
  async function handleCreateContract(formData: FormData) {
    'use server';

    const data = {
      name: formData.get('name') as string,
      // ... 其他欄位
    };

    const result = await createContractAction(data);
    if (result.success) {
      // 處理成功
    }
  }

  return <form action={handleCreateContract}>{/* 表單內容 */}</form>;
}
```

### 在 Client Components 中使用

```tsx
'use client';

import { createContractAction } from '@/features/contracts';

export function CreateContractForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createContractAction({
      name: formData.get('name') as string,
      // ... 其他欄位
    });

    if (result.success) {
      // 處理成功
    }
  };

  return <form action={handleSubmit}>{/* 表單內容 */}</form>;
}
```

## 最佳實踐

1. **類型安全**: 所有 Server Actions 都使用 TypeScript 類型定義
2. **錯誤處理**: 統一的錯誤處理和返回格式
3. **模組化**: 與現有合約模組架構完全整合
4. **可重用性**: 可以在 Server 和 Client Components 中使用

## 與現有架構的整合

- 使用合約模組的類型定義
- 與服務層協作
- 遵循 NextJS 15 App Router 模式
- 支援 Firebase 整合
