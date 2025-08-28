# Supabase 统一配置

## 概述

这是一个极简主义的 Supabase 配置，将所有客户端和类型定义整合到一个文件中，便于维护和开发。

## 文件结构

```
src/lib/db/supabase/
├── index.ts          # 主配置文件（统一入口）
├── types.ts          # 类型定义
└── README.md         # 使用说明
```

## 使用方法

### 1. 基本导入

```typescript
import { supabase, getSupabaseAdmin } from '@/lib/db/supabase';
```

### 2. 客户端使用（浏览器端）

```typescript
// 用于浏览器端操作，支持认证和会话管理
import { supabase } from '@/lib/db/supabase';

// 查询数据
const { data, error } = await supabase
  .from('ai_token_logs')
  .select('*');

// 认证操作
const { user, error } = await supabase.auth.getUser();
```

### 3. 服务端使用（管理操作）

```typescript
// 用于服务端操作，使用 service role key
import { getSupabaseAdmin } from '@/lib/db/supabase';

const supabase = getSupabaseAdmin();

// 插入数据
const { error } = await supabase
  .from('ai_token_logs')
  .insert({
    flow_name: 'test',
    total_tokens: 100,
    status: 'succeeded'
  });
```

### 4. 自动环境选择

```typescript
import { getSupabaseClient } from '@/lib/db/supabase';

// 自动根据环境选择合适的客户端
const supabase = getSupabaseClient();
```

### 5. 类型使用

```typescript
import type { AiTokenLogRow, AiTokenLogInsert } from '@/lib/db/supabase';

const log: AiTokenLogInsert = {
  flow_name: 'test',
  total_tokens: 100,
  status: 'succeeded'
};
```

## 环境变量

确保以下环境变量已设置：

```bash
# 必需
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 可选（用于服务端管理操作）
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 配置说明

### 客户端配置
- `autoRefreshToken: true` - 自动刷新认证令牌
- `persistSession: true` - 持久化会话
- `detectSessionInUrl: true` - 检测 URL 中的会话

### 服务端配置
- `autoRefreshToken: false` - 禁用自动刷新
- `persistSession: false` - 禁用会话持久化
- `detectSessionInUrl: false` - 禁用 URL 会话检测

## 优势

1. **统一入口** - 所有 Supabase 相关操作都从一个文件导入
2. **类型安全** - 完整的 TypeScript 类型支持
3. **环境适配** - 自动根据运行环境选择合适的客户端
4. **极简设计** - 减少文件数量，提高维护性
5. **官方标准** - 遵循 Supabase 官方最佳实践

## 注意事项

- 服务端操作需要设置 `SUPABASE_SERVICE_ROLE_KEY` 环境变量
- 客户端操作使用 `NEXT_PUBLIC_` 前缀的环境变量
- 所有类型定义都在 `types.ts` 中集中管理
- 使用 `getSupabaseAdmin()` 进行服务端管理操作
- 使用 `supabase` 进行客户端操作
