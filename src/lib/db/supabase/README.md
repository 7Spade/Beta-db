# Supabase 配置说明

## 概述

本项目使用 Supabase 官方推荐的 `@supabase/ssr` 包来支持 Next.js App Router 的 Server-Side Auth，实现了极简且高效的配置。

## 文件结构

```
src/lib/db/supabase/
├── index.ts          # 统一导出和便捷函数
├── types.ts          # 类型定义
├── client.ts         # 客户端 Supabase 客户端
├── server.ts         # 服务端 Supabase 客户端
├── middleware.ts     # 中间件配置
└── README.md         # 本说明文档
```

## 配置说明

### 1. 环境变量

在 `.env.local` 文件中配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 客户端使用

**客户端组件中：**
```typescript
import { createClient } from '@/lib/db/supabase/client';

export default function MyComponent() {
  const supabase = createClient();
  // 使用 supabase 客户端
}
```

**服务端组件中：**
```typescript
import { createClient } from '@/lib/db/supabase/server';

export default async function MyServerComponent() {
  const supabase = await createClient();
  // 使用 supabase 客户端
}
```

### 3. 中间件配置

项目根目录的 `middleware.ts` 文件会自动处理：
- 认证 token 刷新
- 路由保护
- 会话管理

### 4. AI Token 日志

AI 流程会自动记录 token 使用情况到 `ai_token_logs` 表：

```typescript
import { logAiTokenUsage } from '@/lib/services/ai-token-log/logging.service';

await logAiTokenUsage({
  flow_name: 'extractWorkItemsFlow',
  total_tokens: totalTokens,
  status: 'succeeded',
});
```

## 优势

1. **官方推荐**: 使用 Supabase 官方推荐的 SSR 配置
2. **类型安全**: 完整的 TypeScript 类型支持
3. **自动会话管理**: 中间件自动处理 token 刷新
4. **极简配置**: 最小化的配置代码
5. **性能优化**: 支持 Next.js 的缓存和优化

## 注意事项

1. 确保环境变量正确配置
2. 中间件会自动保护需要认证的路由
3. 服务端和客户端使用不同的客户端实例
4. AI Token 日志服务不会阻塞主要业务逻辑
