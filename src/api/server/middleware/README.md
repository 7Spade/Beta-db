# 中介軟體 (Middleware)

此目錄存放可重用的 API 中介軟體。

**檔案範例**: `auth.middleware.ts`

```typescript
import { type NextApiRequest, type NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

// 假設使用者 ID 被附加到請求物件上
interface AuthenticatedRequest extends NextApiRequest {
  userId: string;
}

type Middleware = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => void;

export const authMiddleware: Middleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    req.userId = (decoded as { id: string }).id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```
