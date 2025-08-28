# Supabase 极简配置说明

## 概述

本项目使用 Supabase 官方推荐的 `@supabase/ssr` 包，实现了**极简的自己初始化自己连接**的配置，专门用于记录和显示 AI Token 消耗。

## 🚀 极简特性

- **自动初始化**: 无需手动配置，自动从环境变量获取连接信息
- **自动连接**: 自动选择客户端或服务端环境
- **自动记录**: AI 流程自动记录 token 消耗
- **自动显示**: 面板自动显示使用记录

## 📁 文件结构

```
src/lib/db/supabase/
├── index.ts          # 自动选择客户端
├── client.ts         # 浏览器端自动初始化
├── server.ts         # 服务端自动初始化
├── middleware.ts     # 自动认证处理
└── README.md         # 本说明文档
```

## ⚙️ 配置说明

### 1. 环境变量（必需）

在 `.env.local` 文件中配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 自动使用

**无需手动导入，自动工作：**

```typescript
// 在任何地方直接使用
import { getSupabaseClient } from '@/lib/db/supabase'

// 自动选择客户端或服务端
const supabase = await getSupabaseClient()

// 自动记录 AI Token 消耗
import { logAiTokenUsage } from '@/lib/services/ai-token-log/logging.service'
await logAiTokenUsage('flowName', totalTokens, 'succeeded')
```

## 🗄️ 数据库设置

### 运行迁移文件

选择以下任一迁移文件：

1. **`003_ultra_simple_ai_token_logs.sql`** - 超极简版本（推荐）
2. **`002_simple_ai_token_logs_table.sql`** - 简化版本
3. **`001_create_ai_token_logs_table.sql`** - 完整版本

### 推荐使用超极简版本

```sql
-- 在 Supabase SQL 编辑器中运行
-- 文件：supabase-migrations/003_ultra_simple_ai_token_logs.sql
```

## 📊 AI Token 记录

### 自动记录

AI 流程会自动记录：

```typescript
// 成功时
logAiTokenUsage('extractWorkItemsFlow', totalTokens, 'succeeded')

// 失败时
logAiTokenUsage('extractWorkItemsFlow', totalTokens, 'failed', errorMessage)
```

### 自动显示

在面板中自动显示：

```typescript
// 组件自动获取并显示记录
<AiUsageLog />
```

## 🎯 使用场景

1. **AI 流程监控**: 自动记录每个 AI 流程的 token 消耗
2. **成本追踪**: 实时监控 AI 使用成本
3. **性能分析**: 分析不同流程的 token 效率
4. **用户统计**: 了解用户使用模式

## ✨ 优势

1. **零配置**: 安装后即可使用
2. **自动工作**: 无需手动管理连接
3. **类型安全**: 完整的 TypeScript 支持
4. **性能优化**: 自动缓存和优化
5. **错误处理**: 静默处理，不影响主业务

## 🚨 注意事项

1. 确保环境变量正确配置
2. 先运行数据库迁移文件
3. 组件会自动处理错误状态
4. 日志记录不会阻塞主要业务逻辑

## 🔧 故障排除

如果遇到问题：

1. 检查环境变量是否正确
2. 确认数据库表是否创建成功
3. 查看浏览器控制台错误信息
4. 使用超极简迁移文件重新创建表
