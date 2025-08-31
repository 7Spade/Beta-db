# API Hooks

此目錄存放用於數據獲取的自定義 React Hooks，通常基於 `react-query` 或 `SWR`。這些 hooks 封裝了 `services` 的呼叫，並自動管理載入狀態、錯誤狀態和數據快取。

**檔案範例**: `useProjects.ts` (使用 SWR)

```typescript
import useSWR from 'swr';
import { projectService } from '../services/project.service';

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR(
    'projects',
    projectService.getProjects
  );

  return {
    projects: data,
    error,
    isLoading,
    mutate, // 用於手動觸發重新驗證
  };
}
```
