# 回應類型 (Response Types)

此目錄定義了所有 API 回應的 TypeScript 類型。

**檔案範例**: `user.responses.ts`

```typescript
import type { User } from '@/shared/types';

export interface UserLoginResponse {
  user: Omit<User, 'passwordHash'>; // 確保從不回傳密碼
  token: string;
}
```
