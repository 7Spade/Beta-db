# 伺服器端驗證器 (Server Validators)

此目錄存放更複雜的、需要在伺服器端執行的驗證邏輯。

雖然基礎的格式驗證由 `shared/schemas` 中的 Zod schema 完成，但某些驗證需要查詢資料庫，這只能在後端進行。

**檔案範例**: `user.validator.ts`

```typescript
import { db } from '@/lib/db';

export async function isEmailUnique(email: string): Promise<boolean> {
  const existingUser = await db.user.findUnique({ where: { email } });
  return !existingUser;
}
```
