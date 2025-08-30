# API 服務 (API Services)

此目錄將 API 請求按照後端資源進行分組，每個檔案代表一個資源的客戶端。

**檔案範例**: `project.service.ts`

```typescript
import apiClient from '../core/api-client';
import type { Project } from '@/shared/types';
import type { ApiResponse } from '@/api/types/common';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${id}`
    );
    return response.data.data;
  },

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>(
      '/projects',
      data
    );
    return response.data.data;
  },
};
```
