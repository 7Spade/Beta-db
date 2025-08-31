# 請求類型 (Request Types)

此目錄定義了所有 API `POST`, `PUT`, `PATCH` 請求的請求主體 (request body) 的 TypeScript 類型。

**檔案範例**: `project.requests.ts`

```typescript
export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}
```
