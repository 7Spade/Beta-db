# 系統整合與API (Integrations)

## 概述
系统整合与API模块为系统提供完整的外部服务集成能力，包括第三方API集成、Webhook支持、OAuth认证、数据同步和系统间通信。支持多种集成模式和协议。

## 功能特性
- **API集成**: 第三方服务API集成
- **Webhook支持**: 事件驱动的Webhook处理
- **OAuth认证**: 第三方OAuth认证集成
- **数据同步**: 多系统间数据同步
- **协议支持**: REST、GraphQL、gRPC等协议
- **监控告警**: 集成状态监控和告警

## 目录结构
```
src/features/integrations/
├── actions/                 # 业务逻辑操作
│   ├── integration-actions.ts # 集成管理操作
│   └── index.ts
├── components/             # UI组件
│   ├── integration-card.tsx # 集成卡片组件
│   ├── integration-status.tsx # 集成状态显示
│   └── index.ts
├── hooks/                  # React Hooks
│   ├── use-integrations.ts # 集成状态管理
│   └── index.ts
├── providers/              # Context Providers
│   ├── integration-context.tsx # 集成上下文
│   └── index.ts
├── services/               # 服务层
│   ├── api-integration.service.ts # API集成服务
│   ├── webhook.service.ts # Webhook处理服务
│   ├── oauth.service.ts   # OAuth认证服务
│   └── index.ts
├── types/                  # TypeScript类型定义
│   ├── integration.types.ts # 集成相关类型
│   ├── api.types.ts       # API相关类型
│   └── index.ts
├── utils/                  # 工具函数
│   ├── api.utils.ts       # API工具函数
│   ├── webhook.utils.ts   # Webhook工具函数
│   └── index.ts
├── views/                  # 页面视图
│   ├── integrations-view.tsx # 集成管理页面
│   └── index.ts
└── README.md
```

## 核心概念

### 集成类型
- **API集成**: 通过REST/GraphQL等协议集成外部服务
- **Webhook集成**: 接收和处理外部系统的事件通知
- **OAuth集成**: 第三方认证和授权集成
- **数据同步**: 多系统间的数据一致性维护

### 集成模式
- **同步模式**: 实时API调用和响应
- **异步模式**: 消息队列和事件驱动
- **批量模式**: 定期数据同步和批量处理

## 使用方法

### 基本设置
```typescript
// 在应用根组件中启用集成功能
import { IntegrationProvider } from '@/features/integrations/providers/integration-context'

export default function App({ children }) {
  return (
    <IntegrationProvider>
      {children}
    </IntegrationProvider>
  )
}
```

### 使用集成Hook
```typescript
import { useIntegrations } from '@/features/integrations/hooks/use-integrations'

function MyComponent() {
  const { integrations, addIntegration, removeIntegration } = useIntegrations()
  
  return (
    <div>
      {integrations.map(integration => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  )
}
```

### API集成示例
```typescript
import { useApiIntegration } from '@/features/integrations/hooks/use-api-integration'

function ApiIntegrationExample() {
  const { callApi, isLoading, error } = useApiIntegration()
  
  const handleApiCall = async () => {
    try {
      const result = await callApi({
        endpoint: '/api/external-service',
        method: 'POST',
        data: { key: 'value' }
      })
      console.log('API调用成功:', result)
    } catch (err) {
      console.error('API调用失败:', err)
    }
  }
  
  return (
    <button onClick={handleApiCall} disabled={isLoading}>
      {isLoading ? '调用中...' : '调用API'}
    </button>
  )
}
```

## API集成

### 配置管理
```typescript
// 集成配置接口
interface IntegrationConfig {
  id: string
  name: string
  type: 'api' | 'webhook' | 'oauth'
  baseUrl: string
  apiKey?: string
  headers?: Record<string, string>
  timeout?: number
  retryCount?: number
}

// 创建API集成
const apiConfig: IntegrationConfig = {
  id: 'stripe',
  name: 'Stripe支付',
  type: 'api',
  baseUrl: 'https://api.stripe.com/v1',
  apiKey: process.env.STRIPE_API_KEY,
  headers: {
    'Authorization': `Bearer ${process.env.STRIPE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  retryCount: 3
}
```

### 请求处理
```typescript
// API请求处理
class ApiIntegrationService {
  async makeRequest(config: IntegrationConfig, options: RequestOptions) {
    const { baseUrl, headers, timeout, retryCount } = config
    const { endpoint, method, data, params } = options
    
    const url = new URL(endpoint, baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    
    const response = await fetch(url.toString(), {
      method,
      headers: { ...headers, ...options.headers },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(timeout || 30000)
    })
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
}
```

## Webhook集成

### Webhook配置
```typescript
// Webhook配置
interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  headers?: Record<string, string>
  retryPolicy: RetryPolicy
}

// Webhook处理器
class WebhookService {
  async handleWebhook(config: WebhookConfig, payload: any, signature: string) {
    // 验证签名
    if (!this.verifySignature(payload, signature, config.secret)) {
      throw new Error('Webhook签名验证失败')
    }
    
    // 处理事件
    const event = this.parseEvent(payload)
    await this.processEvent(event)
    
    // 记录日志
    await this.logWebhook(config.id, event, 'success')
  }
  
  private verifySignature(payload: any, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
}
```

### 事件处理
```typescript
// 事件处理器
class EventProcessor {
  async processEvent(event: WebhookEvent) {
    switch (event.type) {
      case 'user.created':
        await this.handleUserCreated(event.data)
        break
      case 'payment.succeeded':
        await this.handlePaymentSucceeded(event.data)
        break
      case 'order.updated':
        await this.handleOrderUpdated(event.data)
        break
      default:
        console.warn(`未知事件类型: ${event.type}`)
    }
  }
  
  private async handleUserCreated(data: any) {
    // 处理用户创建事件
    await this.syncUserToLocalSystem(data)
  }
}
```

## OAuth集成

### OAuth配置
```typescript
// OAuth配置
interface OAuthConfig {
  id: string
  name: string
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  redirectUri: string
  scope: string[]
}

// OAuth服务
class OAuthService {
  async initiateOAuth(config: OAuthConfig, state: string) {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope.join(' '),
      state: state
    })
    
    const authUrl = `${config.authorizationUrl}?${params.toString()}`
    return authUrl
  }
  
  async exchangeCodeForToken(config: OAuthConfig, code: string) {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      })
    })
    
    if (!response.ok) {
      throw new Error('OAuth token交换失败')
    }
    
    return response.json()
  }
}
```

## 数据同步

### 同步策略
```typescript
// 同步配置
interface SyncConfig {
  id: string
  source: string
  target: string
  schedule: string // Cron表达式
  strategy: 'full' | 'incremental' | 'real-time'
  mapping: FieldMapping[]
  filters?: FilterCondition[]
}

// 数据同步服务
class DataSyncService {
  async syncData(config: SyncConfig) {
    try {
      // 获取源数据
      const sourceData = await this.fetchSourceData(config)
      
      // 数据转换
      const transformedData = this.transformData(sourceData, config.mapping)
      
      // 应用过滤器
      const filteredData = this.applyFilters(transformedData, config.filters)
      
      // 同步到目标系统
      await this.syncToTarget(config.target, filteredData)
      
      // 记录同步状态
      await this.logSyncStatus(config.id, 'success', filteredData.length)
    } catch (error) {
      await this.logSyncStatus(config.id, 'error', 0, error.message)
      throw error
    }
  }
}
```

## 监控和告警

### 健康检查
```typescript
// 集成健康检查
class IntegrationHealthChecker {
  async checkHealth(integrationId: string): Promise<HealthStatus> {
    const integration = await this.getIntegration(integrationId)
    
    try {
      const startTime = Date.now()
      const response = await this.makeHealthCheckRequest(integration)
      const responseTime = Date.now() - startTime
      
      return {
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
        details: response
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastCheck: new Date()
      }
    }
  }
  
  async scheduleHealthChecks() {
    setInterval(async () => {
      const integrations = await this.getAllIntegrations()
      
      for (const integration of integrations) {
        const health = await this.checkHealth(integration.id)
        await this.updateHealthStatus(integration.id, health)
        
        // 发送告警
        if (health.status === 'unhealthy') {
          await this.sendAlert(integration, health)
        }
      }
    }, 5 * 60 * 1000) // 每5分钟检查一次
  }
}
```

### 告警系统
```typescript
// 告警配置
interface AlertConfig {
  integrationId: string
  conditions: AlertCondition[]
  channels: AlertChannel[]
  escalation: EscalationPolicy
}

// 告警服务
class AlertService {
  async sendAlert(integration: Integration, health: HealthStatus) {
    const alertConfig = await this.getAlertConfig(integration.id)
    
    if (this.shouldSendAlert(alertConfig.conditions, health)) {
      for (const channel of alertConfig.channels) {
        await this.sendAlertToChannel(channel, {
          integration: integration.name,
          status: health.status,
          error: health.error,
          timestamp: new Date()
        })
      }
    }
  }
  
  private async sendAlertToChannel(channel: AlertChannel, alert: Alert) {
    switch (channel.type) {
      case 'email':
        await this.sendEmailAlert(channel.config, alert)
        break
      case 'slack':
        await this.sendSlackAlert(channel.config, alert)
        break
      case 'webhook':
        await this.sendWebhookAlert(channel.config, alert)
        break
    }
  }
}
```

## 配置管理

### 环境变量
```bash
# 集成配置
INTEGRATIONS_ENABLED=true
WEBHOOK_SECRET_KEY=your-webhook-secret
OAUTH_REDIRECT_BASE_URL=https://yourdomain.com/auth/callback

# 第三方服务配置
STRIPE_API_KEY=sk_test_...
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 配置文件
```typescript
// config/integrations.ts
export const integrationConfigs = {
  stripe: {
    name: 'Stripe',
    type: 'api',
    baseUrl: 'https://api.stripe.com/v1',
    apiKey: process.env.STRIPE_API_KEY,
    endpoints: {
      customers: '/customers',
      payments: '/payment_intents',
      subscriptions: '/subscriptions'
    }
  },
  google: {
    name: 'Google',
    type: 'oauth',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  }
}
```

## 错误处理

### 重试机制
```typescript
// 重试配置
interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

// 重试装饰器
function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempt = 0
    
    const attemptCall = async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        attempt++
        
        if (attempt >= config.maxAttempts) {
          reject(error)
          return
        }
        
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelay
        )
        
        setTimeout(attemptCall, delay)
      }
    }
    
    attemptCall()
  })
}
```

## 测试和调试

### 集成测试
```typescript
// 集成测试示例
describe('Stripe Integration', () => {
  it('should create customer successfully', async () => {
    const stripeService = new StripeIntegrationService()
    const customer = await stripeService.createCustomer({
      email: 'test@example.com',
      name: 'Test User'
    })
    
    expect(customer.id).toBeDefined()
    expect(customer.email).toBe('test@example.com')
  })
})
```

### 调试工具
- API请求日志记录
- Webhook事件追踪
- OAuth流程调试
- 性能监控和分析

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
- API响应时间
- 集成成功率
- Webhook处理延迟
- OAuth认证成功率
- 数据同步状态

## 未来规划

### 短期目标
- [ ] 增强错误处理和重试机制
- [ ] 添加更多第三方服务集成
- [ ] 优化监控和告警系统

### 长期目标
- [ ] 支持GraphQL集成
- [ ] 实时数据流集成
- [ ] AI驱动的集成优化