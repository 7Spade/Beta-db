# Supabase 迁移设置指南

## 概述
此项目已从 MongoDB 迁移到 Supabase 用于 AI Token 日志记录，采用极简主义的统一配置。

## 新的文件结构

```
src/lib/db/supabase/
├── index.ts          # 统一配置文件（主要入口）
├── types.ts          # 类型定义
└── README.md         # 详细使用说明
```

## 需要完成的步骤

### 1. 在 Supabase 中创建数据库表

运行以下 SQL 命令在 Supabase 中创建 `ai_token_logs` 表：

```sql
-- 文件: supabase-migrations/001_create_ai_token_logs_table.sql
-- 在 Supabase SQL Editor 中执行此命令
```

### 2. 环境变量配置

确保以下环境变量已在 `apphosting.yaml` 中正确设置：

```yaml
# Supabase 配置
- variable: NEXT_PUBLIC_SUPABASE_URL
  value: "https://dyghxnilkfrtjbefeecx.supabase.co"
  
- variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
  value: "your-anon-key"
  
- variable: SUPABASE_SERVICE_ROLE_KEY
  value: "your-service-role-key"
```

### 3. 数据库表结构

`ai_token_logs` 表包含以下字段：

- `id` (UUID, 主键)
- `flow_name` (TEXT, 流程名称)
- `total_tokens` (INTEGER, Token 数量)
- `status` (TEXT, 状态: 'succeeded' 或 'failed')
- `user_id` (TEXT, 用户ID, 可选)
- `error` (TEXT, 错误信息, 可选)
- `timestamp` (TIMESTAMPTZ, 时间戳)

### 4. 已更新的文件

- ✅ `src/lib/db/supabase/index.ts` - 统一 Supabase 配置
- ✅ `src/lib/db/supabase/types.ts` - Supabase 类型定义
- ✅ `src/lib/services/ai-token-log/logging.service.ts` - 日志服务
- ✅ `src/components/features/dashboard/ai-usage-log.tsx` - AI 使用日志组件

### 5. 使用方法

#### 客户端操作
```typescript
import { supabase } from '@/lib/db/supabase';

const { data, error } = await supabase
  .from('ai_token_logs')
  .select('*');
```

#### 服务端操作
```typescript
import { getSupabaseAdmin } from '@/lib/db/supabase';

const supabase = getSupabaseAdmin();
const { error } = await supabase
  .from('ai_token_logs')
  .insert(logData);
```

### 6. 测试迁移

部署后，测试以下功能：

1. AI Token 日志记录是否正常工作
2. 仪表板是否能正确显示日志数据
3. 检查 Supabase 控制台中的日志表

### 7. 注意事项

- 确保 Supabase 项目已启用 Row Level Security (RLS)
- 服务端操作使用 `SUPABASE_SERVICE_ROLE_KEY`
- 客户端操作使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 所有 Supabase 相关操作都从 `@/lib/db/supabase` 导入

## 优势

1. **极简主义** - 只有 3 个文件，便于维护
2. **统一入口** - 所有操作都从一个地方导入
3. **类型安全** - 完整的 TypeScript 支持
4. **环境适配** - 自动选择合适的客户端
5. **官方标准** - 遵循 Supabase 最佳实践

## 故障排除

如果遇到类型错误，检查：
1. Supabase 类型定义是否正确
2. 环境变量是否已设置
3. 数据库表是否已创建
4. RLS 策略是否正确配置
5. 导入路径是否正确（使用 `@/lib/db/supabase`）
