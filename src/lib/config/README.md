# 配置文件 (Configuration)

应用程序的配置文件集合，管理各种服务的连接和设置。

## 配置文件

- `auth.config.ts` - 认证服务配置
- `firebase.config.ts` - Firebase主配置
- `firestore.config.ts` - Firestore数据库配置
- `functions.config.ts` - Cloud Functions配置
- `storage.config.ts` - Firebase Storage配置
- `index.ts` - 配置统一导出

## 使用方式

通过`index.ts`导入配置，支持开发和生产环境的不同配置。
