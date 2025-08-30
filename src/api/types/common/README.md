# 通用 API 類型 (Common API Types)

此目錄定義了可在多個 API 請求和回應中重複使用的通用類型結構。

**檔案範例**: `ApiResponse.ts`

一個非常常見的模式是將所有 API 回應都包裹在一個統一的結構中：

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```
