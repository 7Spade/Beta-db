# 多租户支援 (Multi-tenancy)

## 概述
多租户模块为系统提供完整的租户隔离和管理功能，支持SaaS模式下的多客户部署。每个租户拥有独立的数据空间、用户管理和配置选项。

## 功能特性
- **租户隔离**: 完整的数据和用户隔离
- **租户管理**: 租户创建、配置、停用管理
- **权限控制**: 基于租户的细粒度权限管理
- **配置管理**: 租户级别的系统配置和自定义
- **计费集成**: 与计费系统的集成支持

## 目录结构
```
src/features/multi-tenancy/
├── actions/                 # 业务逻辑操作
│   ├── tenant-actions.ts   # 租户CRUD操作
│   └── index.ts
├── components/             # UI组件
│   ├── tenant-switcher.tsx # 租户切换器
│   ├── tenant-selector.tsx # 租户选择器
│   └── index.ts
├── hooks/                  # React Hooks
│   ├── use-tenant.ts      # 租户状态管理
│   └── index.ts
├── providers/              # Context Providers
│   ├── tenant-context.tsx # 租户上下文
│   └── index.ts
├── services/               # 服务层
│   ├── tenant.service.ts  # 租户业务逻辑
│   └── index.ts
├── types/                  # TypeScript类型定义
│   ├── tenant.types.ts    # 租户相关类型
│   └── index.ts
├── utils/                  # 工具函数
│   ├── tenant.utils.ts    # 租户工具函数
│   └── index.ts
├── views/                  # 页面视图
│   ├── tenant-management-view.tsx # 租户管理页面
│   └── index.ts
└── README.md
```

## 核心概念

### 租户 (Tenant)
- 代表一个独立的客户或组织
- 拥有独立的数据空间和用户管理
- 可配置的系统设置和功能模块

### 租户隔离策略
- **数据库级别**: 使用租户ID进行数据过滤
- **应用级别**: 中间件和Context提供租户上下文
- **UI级别**: 组件自动适应租户配置

## 使用方法

### 基本设置
```typescript
// 在应用根组件中包装租户Provider
import { TenantProvider } from '@/features/multi-tenancy/providers/tenant-context'

export default function App({ children }) {
  return (
    <TenantProvider>
      {children}
    </TenantProvider>
  )
}
```

### 使用租户Hook
```typescript
import { useTenant } from '@/features/multi-tenancy/hooks/use-tenant'

function MyComponent() {
  const { tenant, switchTenant, isAdmin } = useTenant()
  
  return (
    <div>
      <h1>当前租户: {tenant.name}</h1>
      {isAdmin && <TenantManagementPanel />}
    </div>
  )
}
```

## 数据库设计

### 租户表结构
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 数据隔离策略
- 所有业务表添加 `tenant_id` 字段
- 使用数据库视图和触发器自动过滤数据
- 支持租户级别的数据备份和恢复

## 安全考虑

### 租户隔离
- 严格的数据库查询过滤
- API级别的租户验证
- 防止跨租户数据访问

### 权限管理
- 基于角色的访问控制(RBAC)
- 租户级别的权限配置
- 审计日志记录

## 集成点

### 认证系统
- 与现有auth模块集成
- 支持租户级别的登录策略
- 多租户SSO支持

### 计费系统
- 租户使用量统计
- 计费周期管理
- 支付集成

### 通知系统
- 租户级别的通知配置
- 邮件模板自定义
- 推送通知支持

## 部署配置

### 环境变量
```bash
# 多租户配置
MULTI_TENANCY_ENABLED=true
TENANT_DOMAIN_PATTERN=*.yourdomain.com
DEFAULT_TENANT_ID=default
```

### 中间件配置
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 租户识别和验证逻辑
  const tenant = identifyTenant(request)
  if (!tenant) {
    return NextResponse.redirect('/tenant-selector')
  }
  
  // 设置租户上下文
  request.headers.set('x-tenant-id', tenant.id)
  return NextResponse.next()
}
```

## 性能优化

### 缓存策略
- 租户配置缓存
- 用户权限缓存
- 数据库连接池优化

### 扩展性
- 水平扩展支持
- 微服务架构兼容
- 负载均衡配置

## 监控和日志

### 关键指标
- 租户数量和使用情况
- API响应时间
- 资源使用率

### 日志记录
- 租户操作审计
- 错误日志分类
- 性能监控数据

## 未来规划

### 短期目标
- [ ] 租户数据导入导出
- [ ] 租户模板系统
- [ ] 高级权限管理

### 长期目标
- [ ] 多租户集群支持
- [ ] 租户级别的AI功能
- [ ] 国际化多语言支持