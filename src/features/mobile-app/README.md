# 移動應用支援 (Mobile App)

## 概述
移动应用模块为系统提供完整的移动端支持，包括响应式设计、PWA功能、移动端优化和原生应用集成。支持iOS、Android和Web平台的统一体验。

## 功能特性
- **响应式设计**: 自适应各种屏幕尺寸
- **PWA支持**: 渐进式Web应用功能
- **移动端优化**: 触摸手势、移动端UI组件
- **离线支持**: 离线数据同步和缓存
- **推送通知**: 移动端推送通知支持
- **原生集成**: 与移动端原生功能集成

## 目录结构
```
src/features/mobile-app/
├── actions/                 # 业务逻辑操作
│   ├── mobile-actions.ts   # 移动端特定操作
│   └── index.ts
├── components/             # UI组件
│   ├── mobile-navigation.tsx # 移动端导航
│   ├── mobile-menu.tsx    # 移动端菜单
│   ├── mobile-forms.tsx   # 移动端表单
│   └── index.ts
├── hooks/                  # React Hooks
│   ├── use-mobile-features.ts # 移动端功能Hook
│   ├── use-mobile-gestures.ts # 手势识别Hook
│   └── index.ts
├── services/               # 服务层
│   ├── mobile-push.service.ts # 推送通知服务
│   ├── mobile-sync.service.ts # 数据同步服务
│   └── index.ts
├── types/                  # TypeScript类型定义
│   ├── mobile.types.ts    # 移动端相关类型
│   └── index.ts
├── utils/                  # 工具函数
│   ├── mobile.utils.ts    # 移动端工具函数
│   ├── pwa.utils.ts       # PWA相关工具
│   └── index.ts
├── views/                  # 页面视图
│   ├── mobile-dashboard-view.tsx # 移动端仪表板
│   └── index.ts
└── README.md
```

## 核心概念

### 移动优先设计
- 优先考虑移动端用户体验
- 触摸友好的交互设计
- 性能优化的移动端加载

### PWA (Progressive Web App)
- 可安装的Web应用
- 离线功能支持
- 推送通知集成

### 响应式架构
- 断点系统设计
- 组件自适应布局
- 移动端特定功能

## 使用方法

### 基本设置
```typescript
// 在应用根组件中启用移动端功能
import { MobileProvider } from '@/features/mobile-app/providers/mobile-context'

export default function App({ children }) {
  return (
    <MobileProvider>
      {children}
    </MobileProvider>
  )
}
```

### 使用移动端Hook
```typescript
import { useMobileFeatures } from '@/features/mobile-app/hooks/use-mobile-features'

function MyComponent() {
  const { isMobile, isTablet, isPWA, enableOffline } = useMobileFeatures()
  
  return (
    <div>
      {isMobile && <MobileNavigation />}
      {isPWA && <OfflineIndicator />}
    </div>
  )
}
```

### 手势支持
```typescript
import { useMobileGestures } from '@/features/mobile-app/hooks/use-mobile-gestures'

function SwipeableComponent() {
  const { onSwipeLeft, onSwipeRight, onPinch } = useMobileGestures({
    onSwipeLeft: () => console.log('向左滑动'),
    onSwipeRight: () => console.log('向右滑动'),
    onPinch: (scale) => console.log('缩放:', scale)
  })
  
  return <div>支持手势的组件</div>
}
```

## PWA配置

### Manifest配置
```json
{
  "name": "Beta-db Mobile",
  "short_name": "Beta-db",
  "description": "企业级数据库管理系统",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Service Worker配置
```typescript
// public/sw.js
const CACHE_NAME = 'beta-db-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})
```

## 移动端优化

### 性能优化
- 图片懒加载和优化
- 代码分割和按需加载
- 缓存策略优化

### 触摸优化
- 触摸目标大小优化
- 手势识别和反馈
- 滚动性能优化

### 离线功能
- 离线数据缓存
- 离线操作队列
- 网络状态检测

## 推送通知

### 配置设置
```typescript
// 推送通知配置
const pushConfig = {
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  userVisibleOnly: true,
  requireInteraction: false
}

// 注册推送通知
async function registerPushNotification() {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe(pushConfig)
  
  // 发送订阅信息到服务器
  await sendSubscriptionToServer(subscription)
}
```

### 通知管理
```typescript
// 显示通知
function showNotification(title, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      ...options
    })
  }
}
```

## 响应式设计

### 断点系统
```scss
// 断点定义
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

// 响应式混入
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

### 组件自适应
```typescript
// 响应式组件示例
function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  if (isMobile) {
    return <MobileLayout />
  } else if (isTablet) {
    return <TabletLayout />
  } else {
    return <DesktopLayout />
  }
}
```

## 移动端组件

### 导航组件
```typescript
// 移动端导航
function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <nav className="mobile-nav">
      <button onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </button>
      {isOpen && (
        <div className="mobile-menu">
          <NavigationItems />
        </div>
      )}
    </nav>
  )
}
```

### 表单组件
```typescript
// 移动端优化表单
function MobileForm() {
  return (
    <form className="mobile-form">
      <input 
        type="text" 
        placeholder="输入内容"
        className="mobile-input"
      />
      <button type="submit" className="mobile-button">
        提交
      </button>
    </form>
  )
}
```

## 测试和调试

### 移动端测试
- 设备模拟器测试
- 真机测试
- 性能测试

### 调试工具
- Chrome DevTools移动端调试
- React Native Debugger
- 性能监控工具

## 部署和发布

### 构建配置
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    pwa: true
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif']
  }
}
```

### 发布流程
1. 构建优化版本
2. PWA资源生成
3. Service Worker部署
4. 移动端测试验证

## 未来规划

### 短期目标
- [ ] 增强PWA功能
- [ ] 离线数据同步
- [ ] 推送通知优化

### 长期目标
- [ ] 原生应用集成
- [ ] 跨平台代码共享
- [ ] AI驱动的移动端优化