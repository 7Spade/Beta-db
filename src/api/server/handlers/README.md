# 請求處理程序 (Request Handlers)

此目錄包含 API 請求的具體業務邏輯實現。每個 handler 負責處理一個特定的端點操作。

**檔案範例**: `project.handler.ts`

```typescript
import { db } from '@/lib/db';
import type { CreateProjectRequest } from '@/api/types/requests';
import type { Project } from '@/shared/types';

export async function handleGetProjects(): Promise<Project[]> {
  // 從資料庫獲取專案...
  return projects;
}

export async function handleCreateProject(
  data: CreateProjectRequest
): Promise<Project> {
  // 驗證數據...
  // 在資料庫中建立新專案...
  return newProject;
}
```
