# 核心 API 客戶端 (Core API Client)

此目錄存放 API 客戶端的核心實例和設定。

**檔案範例**: `api-client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// 請求攔截器: 自動附加認證 token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 回應攔截器: 統一處理 API 錯誤
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 例如: 如果收到 401 未授權錯誤，自動登出使用者
    if (error.response.status === 401) {
      // logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```
