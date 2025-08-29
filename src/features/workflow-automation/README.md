# 工作流程自動化 (Workflow Automation)

## 概述
工作流程自动化模块为系统提供完整的业务流程自动化能力，包括工作流设计器、规则引擎、任务调度、流程监控和自动化执行。支持复杂的业务逻辑编排和智能决策。

## 功能特性
- **工作流设计器**: 可视化工作流设计工具
- **规则引擎**: 智能决策和条件判断
- **任务调度**: 自动化任务执行和调度
- **流程监控**: 实时流程状态监控
- **智能触发**: 事件驱动的自动化触发
- **集成支持**: 与现有模块深度集成

## 目录结构
```
src/features/workflow-automation/
├── actions/                 # 业务逻辑操作
│   ├── workflow-actions.ts # 工作流管理操作
│   ├── automation-actions.ts # 自动化操作
│   └── index.ts
├── components/             # UI组件
│   ├── workflow-builder.tsx # 工作流设计器
│   ├── automation-trigger.tsx # 自动化触发器
│   ├── workflow-canvas.tsx # 工作流画布
│   └── index.ts
├── hooks/                  # React Hooks
│   ├── use-workflow.ts    # 工作流状态管理
│   ├── use-automation.ts  # 自动化功能Hook
│   └── index.ts
├── providers/              # Context Providers
│   ├── workflow-context.tsx # 工作流上下文
│   └── index.ts
├── services/               # 服务层
│   ├── workflow-engine.service.ts # 工作流引擎
│   ├── automation.service.ts # 自动化服务
│   ├── trigger.service.ts # 触发器服务
│   └── index.ts
├── types/                  # TypeScript类型定义
│   ├── workflow.types.ts  # 工作流相关类型
│   ├── automation.types.ts # 自动化相关类型
│   └── index.ts
├── utils/                  # 工具函数
│   ├── workflow.utils.ts  # 工作流工具函数
│   ├── automation.utils.ts # 自动化工具函数
│   └── index.ts
├── views/                  # 页面视图
│   ├── workflow-builder-view.tsx # 工作流设计页面
│   ├── automation-dashboard-view.tsx # 自动化仪表板
│   └── index.ts
└── README.md
```

## 核心概念

### 工作流 (Workflow)
- 由多个步骤组成的业务流程
- 支持条件分支和并行执行
- 可配置的步骤参数和规则

### 自动化 (Automation)
- 基于规则和条件的自动执行
- 支持多种触发方式
- 智能决策和异常处理

### 规则引擎 (Rule Engine)
- 灵活的规则定义和配置
- 支持复杂条件判断
- 动态规则更新和热加载

## 使用方法

### 基本设置
```typescript
// 在应用根组件中启用工作流自动化
import { WorkflowProvider } from '@/features/workflow-automation/providers/workflow-context'

export default function App({ children }) {
  return (
    <WorkflowProvider>
      {children}
    </WorkflowProvider>
  )
}
```

### 使用工作流Hook
```typescript
import { useWorkflow } from '@/features/workflow-automation/hooks/use-workflow'

function WorkflowComponent() {
  const { workflows, createWorkflow, executeWorkflow } = useWorkflow()
  
  const handleCreateWorkflow = async () => {
    const workflow = await createWorkflow({
      name: '订单处理流程',
      description: '自动化订单处理流程',
      steps: [
        { id: '1', name: '订单验证', type: 'validation' },
        { id: '2', name: '库存检查', type: 'inventory' },
        { id: '3', name: '支付处理', type: 'payment' }
      ]
    })
    console.log('工作流创建成功:', workflow)
  }
  
  return (
    <div>
      <button onClick={handleCreateWorkflow}>创建工作流</button>
      {workflows.map(workflow => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  )
}
```

### 自动化触发器
```typescript
import { useAutomation } from '@/features/workflow-automation/hooks/use-automation'

function AutomationComponent() {
  const { automations, createAutomation, enableAutomation } = useAutomation()
  
  const handleCreateAutomation = async () => {
    const automation = await createAutomation({
      name: '新用户欢迎流程',
      trigger: {
        type: 'event',
        event: 'user.created'
      },
      actions: [
        { type: 'send_email', template: 'welcome' },
        { type: 'create_profile', data: 'user_data' },
        { type: 'assign_role', role: 'basic_user' }
      ]
    })
    console.log('自动化创建成功:', automation)
  }
  
  return (
    <div>
      <button onClick={handleCreateAutomation}>创建自动化</button>
      {automations.map(automation => (
        <AutomationCard key={automation.id} automation={automation} />
      ))}
    </div>
  )
}
```

## 工作流设计器

### 工作流定义
```typescript
// 工作流定义接口
interface WorkflowDefinition {
  id: string
  name: string
  description: string
  version: string
  steps: WorkflowStep[]
  connections: WorkflowConnection[]
  variables: WorkflowVariable[]
  metadata: Record<string, any>
}

// 工作流步骤
interface WorkflowStep {
  id: string
  name: string
  type: StepType
  position: { x: number; y: number }
  config: StepConfig
  nextSteps: string[]
  conditions?: Condition[]
}

// 工作流连接
interface WorkflowConnection {
  id: string
  sourceStepId: string
  targetStepId: string
  condition?: Condition
  label?: string
}
```

### 工作流引擎
```typescript
// 工作流执行引擎
class WorkflowEngine {
  async executeWorkflow(workflowId: string, input: any): Promise<WorkflowResult> {
    const workflow = await this.getWorkflow(workflowId)
    const execution = await this.createExecution(workflowId, input)
    
    try {
      const result = await this.executeSteps(workflow, execution)
      await this.completeExecution(execution.id, result)
      return result
    } catch (error) {
      await this.failExecution(execution.id, error)
      throw error
    }
  }
  
  private async executeSteps(workflow: WorkflowDefinition, execution: WorkflowExecution) {
    const context = { workflow, execution, variables: {} }
    let currentStep = workflow.steps.find(s => s.id === workflow.startStepId)
    
    while (currentStep) {
      // 执行当前步骤
      const stepResult = await this.executeStep(currentStep, context)
      
      // 更新上下文
      context.variables = { ...context.variables, ...stepResult.output }
      
      // 确定下一步
      currentStep = this.determineNextStep(currentStep, stepResult, workflow)
    }
    
    return context.variables
  }
  
  private async executeStep(step: WorkflowStep, context: WorkflowContext) {
    const stepExecutor = this.getStepExecutor(step.type)
    return await stepExecutor.execute(step, context)
  }
}
```

## 规则引擎

### 规则定义
```typescript
// 规则定义
interface Rule {
  id: string
  name: string
  description: string
  conditions: RuleCondition[]
  actions: RuleAction[]
  priority: number
  enabled: boolean
}

// 规则条件
interface RuleCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
  logicalOperator?: 'and' | 'or'
}

// 规则动作
interface RuleAction {
  type: 'set_field' | 'send_notification' | 'trigger_workflow' | 'call_api'
  config: Record<string, any>
}
```

### 规则执行
```typescript
// 规则引擎
class RuleEngine {
  async evaluateRules(data: any, ruleSet: string): Promise<RuleResult[]> {
    const rules = await this.getRules(ruleSet)
    const results: RuleResult[] = []
    
    for (const rule of rules.filter(r => r.enabled)) {
      if (await this.evaluateConditions(rule.conditions, data)) {
        const result = await this.executeActions(rule.actions, data)
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actions: result
        })
      }
    }
    
    return results.sort((a, b) => {
      const ruleA = rules.find(r => r.id === a.ruleId)
      const ruleB = rules.find(r => r.id === b.ruleId)
      return (ruleB?.priority || 0) - (ruleA?.priority || 0)
    })
  }
  
  private async evaluateConditions(conditions: RuleCondition[], data: any): Promise<boolean> {
    if (conditions.length === 0) return true
    
    let result = true
    let logicalOperator: 'and' | 'or' = 'and'
    
    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, data)
      
      if (logicalOperator === 'and') {
        result = result && conditionResult
      } else {
        result = result || conditionResult
      }
      
      logicalOperator = condition.logicalOperator || 'and'
    }
    
    return result
  }
  
  private evaluateCondition(condition: RuleCondition, data: any): boolean {
    const fieldValue = this.getFieldValue(data, condition.field)
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value
      case 'not_equals':
        return fieldValue !== condition.value
      case 'contains':
        return String(fieldValue).includes(String(condition.value))
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value)
      case 'less_than':
        return Number(fieldValue) < Number(condition.value)
      default:
        return false
    }
  }
}
```

## 自动化触发器

### 触发器类型
```typescript
// 触发器类型
type TriggerType = 
  | 'event'           // 事件触发
  | 'schedule'        // 定时触发
  | 'webhook'         // Webhook触发
  | 'manual'          // 手动触发
  | 'condition'       // 条件触发

// 事件触发器
interface EventTrigger {
  type: 'event'
  event: string
  filters?: EventFilter[]
}

// 定时触发器
interface ScheduleTrigger {
  type: 'schedule'
  cron: string
  timezone?: string
}

// Webhook触发器
interface WebhookTrigger {
  type: 'webhook'
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
}
```

### 触发器服务
```typescript
// 触发器服务
class TriggerService {
  async registerTrigger(automationId: string, trigger: Trigger): Promise<void> {
    switch (trigger.type) {
      case 'event':
        await this.registerEventTrigger(automationId, trigger)
        break
      case 'schedule':
        await this.registerScheduleTrigger(automationId, trigger)
        break
      case 'webhook':
        await this.registerWebhookTrigger(automationId, trigger)
        break
    }
  }
  
  private async registerEventTrigger(automationId: string, trigger: EventTrigger) {
    const eventBus = this.getEventBus()
    await eventBus.subscribe(trigger.event, async (eventData) => {
      if (this.shouldTriggerAutomation(trigger, eventData)) {
        await this.executeAutomation(automationId, eventData)
      }
    })
  }
  
  private async registerScheduleTrigger(automationId: string, trigger: ScheduleTrigger) {
    const scheduler = this.getScheduler()
    await scheduler.schedule(trigger.cron, async () => {
      await this.executeAutomation(automationId, {})
    })
  }
  
  private async registerWebhookTrigger(automationId: string, trigger: WebhookTrigger) {
    const webhookHandler = this.createWebhookHandler(automationId, trigger)
    await this.registerWebhookEndpoint(trigger.endpoint, webhookHandler)
  }
}
```

## 任务调度

### 调度配置
```typescript
// 任务调度配置
interface TaskSchedule {
  id: string
  name: string
  cron: string
  timezone: string
  enabled: boolean
  task: TaskDefinition
  retryPolicy?: RetryPolicy
  timeout?: number
}

// 任务定义
interface TaskDefinition {
  type: 'workflow' | 'automation' | 'api_call' | 'script'
  config: Record<string, any>
}

// 重试策略
interface RetryPolicy {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
}
```

### 调度器服务
```typescript
// 任务调度器
class TaskScheduler {
  async scheduleTask(schedule: TaskSchedule): Promise<void> {
    const job = new CronJob(schedule.cron, async () => {
      try {
        await this.executeTask(schedule.task)
        await this.logTaskSuccess(schedule.id)
      } catch (error) {
        await this.handleTaskError(schedule.id, error, schedule.retryPolicy)
      }
    }, null, false, schedule.timezone)
    
    if (schedule.enabled) {
      job.start()
    }
    
    await this.saveJob(schedule.id, job)
  }
  
  private async executeTask(task: TaskDefinition): Promise<any> {
    switch (task.type) {
      case 'workflow':
        return await this.executeWorkflow(task.config.workflowId, task.config.input)
      case 'automation':
        return await this.executeAutomation(task.config.automationId, task.config.input)
      case 'api_call':
        return await this.makeApiCall(task.config)
      case 'script':
        return await this.executeScript(task.config.script)
      default:
        throw new Error(`未知任务类型: ${task.type}`)
    }
  }
  
  private async handleTaskError(taskId: string, error: Error, retryPolicy?: RetryPolicy) {
    const attempts = await this.getTaskAttempts(taskId)
    
    if (retryPolicy && attempts < retryPolicy.maxAttempts) {
      const delay = Math.min(
        retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, attempts),
        retryPolicy.maxDelay
      )
      
      setTimeout(() => {
        this.retryTask(taskId)
      }, delay)
    } else {
      await this.logTaskFailure(taskId, error)
    }
  }
}
```

## 流程监控

### 监控指标
```typescript
// 工作流执行指标
interface WorkflowMetrics {
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageExecutionTime: number
  activeExecutions: number
  stepMetrics: StepMetrics[]
}

// 步骤执行指标
interface StepMetrics {
  stepId: string
  stepName: string
  totalExecutions: number
  successRate: number
  averageExecutionTime: number
  errorCount: number
}
```

### 监控服务
```typescript
// 流程监控服务
class WorkflowMonitorService {
  async getWorkflowMetrics(workflowId: string, timeRange: TimeRange): Promise<WorkflowMetrics> {
    const executions = await this.getExecutionsInRange(workflowId, timeRange)
    
    const metrics: WorkflowMetrics = {
      totalExecutions: executions.length,
      successfulExecutions: executions.filter(e => e.status === 'completed').length,
      failedExecutions: executions.filter(e => e.status === 'failed').length,
      averageExecutionTime: this.calculateAverageExecutionTime(executions),
      activeExecutions: executions.filter(e => e.status === 'running').length,
      stepMetrics: await this.calculateStepMetrics(workflowId, executions)
    }
    
    return metrics
  }
  
  async getRealTimeUpdates(workflowId: string): Promise<Observable<WorkflowUpdate>> {
    return new Observable(observer => {
      const subscription = this.eventBus.subscribe(`workflow.${workflowId}`, (event) => {
        observer.next(event)
      })
      
      return () => subscription.unsubscribe()
    })
  }
  
  async getExecutionHistory(workflowId: string, limit: number = 100): Promise<WorkflowExecution[]> {
    return await this.workflowExecutionRepository.find({
      where: { workflowId },
      order: { createdAt: 'DESC' },
      take: limit
    })
  }
}
```

## 集成支持

### 与现有模块集成
```typescript
// 与合同模块集成
class ContractWorkflowIntegration {
  async handleContractCreated(contract: Contract) {
    const workflow = await this.getWorkflow('contract-approval')
    
    await this.workflowEngine.executeWorkflow(workflow.id, {
      contractId: contract.id,
      contractType: contract.type,
      amount: contract.amount,
      approvers: this.determineApprovers(contract)
    })
  }
  
  async handleContractApproved(contract: Contract, approver: User) {
    const automation = await this.getAutomation('contract-approved')
    
    await this.automationService.executeAutomation(automation.id, {
      contract,
      approver,
      timestamp: new Date()
    })
  }
}

// 与团队模块集成
class TeamWorkflowIntegration {
  async handleMemberAdded(member: TeamMember) {
    const automation = await this.getAutomation('new-member-onboarding')
    
    await this.automationService.executeAutomation(automation.id, {
      member,
      team: member.team,
      onboardingTasks: this.getOnboardingTasks(member.role)
    })
  }
}
```

## 配置管理

### 环境变量
```bash
# 工作流自动化配置
WORKFLOW_AUTOMATION_ENABLED=true
WORKFLOW_ENGINE_TIMEOUT=300000
AUTOMATION_MAX_CONCURRENT=10
RULE_ENGINE_CACHE_SIZE=1000
```

### 配置文件
```typescript
// config/workflow-automation.ts
export const workflowConfig = {
  engine: {
    timeout: 300000,
    maxConcurrent: 10,
    retryAttempts: 3
  },
  rules: {
    cacheSize: 1000,
    cacheTTL: 300000,
    enableHotReload: true
  },
  monitoring: {
    enableMetrics: true,
    enableTracing: true,
    logLevel: 'info'
  }
}
```

## 错误处理和恢复

### 异常处理
```typescript
// 工作流异常处理
class WorkflowErrorHandler {
  async handleStepError(execution: WorkflowExecution, step: WorkflowStep, error: Error) {
    // 记录错误
    await this.logStepError(execution.id, step.id, error)
    
    // 检查是否有错误处理步骤
    const errorHandler = this.findErrorHandler(step)
    if (errorHandler) {
      await this.executeErrorHandler(execution, errorHandler, error)
    }
    
    // 应用重试策略
    if (this.shouldRetry(step, error)) {
      await this.scheduleRetry(execution, step)
    } else {
      await this.failExecution(execution.id, error)
    }
  }
  
  private async executeErrorHandler(
    execution: WorkflowExecution, 
    errorHandler: WorkflowStep, 
    error: Error
  ) {
    try {
      await this.workflowEngine.executeStep(errorHandler, {
        workflow: execution.workflow,
        execution,
        variables: {
          ...execution.variables,
          error: {
            message: error.message,
            stack: error.stack,
            timestamp: new Date()
          }
        }
      })
    } catch (handlerError) {
      console.error('错误处理器执行失败:', handlerError)
    }
  }
}
```

## 测试和调试

### 工作流测试
```typescript
// 工作流测试示例
describe('Contract Approval Workflow', () => {
  it('should approve contract when all conditions are met', async () => {
    const workflow = await createTestWorkflow('contract-approval')
    const input = {
      contractId: 'test-contract',
      amount: 10000,
      approvers: ['manager1', 'manager2']
    }
    
    const result = await workflowEngine.executeWorkflow(workflow.id, input)
    
    expect(result.status).toBe('approved')
    expect(result.approvalDate).toBeDefined()
  })
})
```

### 调试工具
- 工作流执行追踪
- 规则引擎调试
- 自动化触发器测试
- 性能分析和优化

## 部署和运维

### 部署配置
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 监控指标
- 工作流执行成功率
- 自动化触发频率
- 规则引擎性能
- 任务调度状态

## 未来规划

### 短期目标
- [ ] 增强工作流设计器功能
- [ ] 添加更多触发器类型
- [ ] 优化规则引擎性能

### 长期目标
- [ ] AI驱动的工作流优化
- [ ] 机器学习规则生成
- [ ] 跨系统工作流编排