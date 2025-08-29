我来帮你分析项目结构并查看Next.js官方文档，然后为这些新模块设计合适的位置。


[4 tools called]

现在让我查看Next.js官方文档，了解多租户、移动应用、系统整合和工作流程自动化的最佳实践：


[2 tools called]

基于对项目结构的分析和Next.js官方文档的查阅，我来为这四个新模块设计合适的位置：

## VAN 分析结果

根据 `Structure.md` 的分析，项目采用了清晰的模块化架构，主要分为以下几个层次：

### 1. **多租戶支援 (Multi-tenancy)** 
**建议位置：** `src/features/multi-tenancy/`

**理由：**
- 这是一个核心业务功能，应该放在 `features` 目录下
- 需要与现有的认证、用户管理、权限系统深度集成
- 可以参考现有的 `auth` 和 `admin` 模块结构

**目录结构建议：**
```
src/features/multi-tenancy/
├── actions/
│   ├── tenant-actions.ts
│   └── index.ts
├── components/
│   ├── tenant-switcher.tsx
│   ├── tenant-selector.tsx
│   └── index.ts
├── hooks/
│   ├── use-tenant.ts
│   └── index.ts
├── providers/
│   ├── tenant-context.tsx
│   └── index.ts
├── services/
│   ├── tenant.service.ts
│   └── index.ts
├── types/
│   ├── tenant.types.ts
│   └── index.ts
├── utils/
│   ├── tenant.utils.ts
│   └── index.ts
├── views/
│   ├── tenant-management-view.tsx
│   └── index.ts
└── README.md
```

### 2. **移動應用支援 (Mobile App)**
**建议位置：** `src/features/mobile-app/`

**理由：**
- 现有已有 `src/components/mobile-app/` 目录，但只有 README
- 应该扩展为完整的 feature 模块
- 需要与现有的 `use-mobile.tsx` hook 集成

**目录结构建议：**
```
src/features/mobile-app/
├── actions/
│   ├── mobile-actions.ts
│   └── index.ts
├── components/
│   ├── mobile-navigation.tsx
│   ├── mobile-menu.tsx
│   ├── mobile-forms.tsx
│   └── index.ts
├── hooks/
│   ├── use-mobile-features.ts
│   ├── use-mobile-gestures.ts
│   └── index.ts
├── services/
│   ├── mobile-push.service.ts
│   ├── mobile-sync.service.ts
│   └── index.ts
├── types/
│   ├── mobile.types.ts
│   └── index.ts
├── utils/
│   ├── mobile.utils.ts
│   ├── pwa.utils.ts
│   └── index.ts
├── views/
│   ├── mobile-dashboard-view.tsx
│   └── index.ts
└── README.md
```

### 3. **系統整合與API (Integrations)**
**建议位置：** `src/features/integrations/`

**理由：**
- 现有已有 `src/integrations/` 目录，但只有 README
- 应该移动到 `features` 下保持架构一致性
- 需要与现有的服务层深度集成

**目录结构建议：**
```
src/features/integrations/
├── actions/
│   ├── integration-actions.ts
│   └── index.ts
├── components/
│   ├── integration-card.tsx
│   ├── integration-status.tsx
│   └── index.ts
├── hooks/
│   ├── use-integrations.ts
│   └── index.ts
├── providers/
│   ├── integration-context.tsx
│   └── index.ts
├── services/
│   ├── api-integration.service.ts
│   ├── webhook.service.ts
│   ├── oauth.service.ts
│   └── index.ts
├── types/
│   ├── integration.types.ts
│   ├── api.types.ts
│   └── index.ts
├── utils/
│   ├── api.utils.ts
│   ├── webhook.utils.ts
│   └── index.ts
├── views/
│   ├── integrations-view.tsx
│   └── index.ts
└── README.md
```

### 4. **工作流程自動化 (Workflow Automation)**
**建议位置：** `src/features/workflow-automation/`

**理由：**
- 现有已有 `src/app/(dashboard)/(workflow-automation)/` 目录
- 应该扩展为完整的 feature 模块
- 需要与现有的 kanban、projects、team 等模块集成

**目录结构建议：**
```
src/features/workflow-automation/
├── actions/
│   ├── workflow-actions.ts
│   ├── automation-actions.ts
│   └── index.ts
├── components/
│   ├── workflow-builder.tsx
│   ├── automation-trigger.tsx
│   ├── workflow-canvas.tsx
│   └── index.ts
├── hooks/
│   ├── use-workflow.ts
│   ├── use-automation.ts
│   └── index.ts
├── providers/
│   ├── workflow-context.tsx
│   └── index.ts
├── services/
│   ├── workflow-engine.service.ts
│   ├── automation.service.ts
│   ├── trigger.service.ts
│   └── index.ts
├── types/
│   ├── workflow.types.ts
│   ├── automation.types.ts
│   └── index.ts
├── utils/
│   ├── workflow.utils.ts
│   ├── automation.utils.ts
│   └── index.ts
├── views/
│   ├── workflow-builder-view.tsx
│   ├── automation-dashboard-view.tsx
│   └── index.ts
└── README.md
```

## 架构优势

1. **一致性**：所有新模块都遵循现有的 `features` 目录结构
2. **可扩展性**：每个模块都有完整的 actions、components、hooks、services 等层次
3. **集成性**：与现有的认证、权限、数据库等基础设施无缝集成
4. **维护性**：清晰的目录结构便于团队协作和代码维护
5. **符合Next.js最佳实践**：遵循App Router的目录结构和组件组织方式

这样的设计既保持了项目架构的一致性，又为未来的功能扩展提供了良好的基础。