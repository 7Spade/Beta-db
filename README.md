# Beta-db 統一整合平台 (Beta-db Integrated Platform)

一個基於 Next.js 15+ 的現代化企業資源管理平台，整合了 CRM、專案管理、合約管理、倉儲管理等多個業務模組。

## 🚀 技術架構

- **前端框架**: Next.js 15+ (App Router)
- **語言**: TypeScript 5.0+
- **樣式**: Tailwind CSS
- **UI 元件**: Radix UI + shadcn/ui
- **資料庫**: MongoDB + Redis + Supabase
- **AI 功能**: Google AI (Genkit)
- **認證**: Firebase Auth
- **部署**: Firebase Hosting

## 📁 專案結構

```
src/
├── app/                    # Next.js App Router 頁面
├── components/            # 共用 UI 元件
├── features/              # 業務功能模組
├── lib/                   # 工具函數和配置
└── ai/                    # AI 功能模組
```

## 🛠️ 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置專案
npm run build

# AI 功能開發
npm run genkit:dev
```

## 🌟 主要功能

- **CRM 管理**: 合作夥伴、客戶關係、工作流程
- **專案管理**: 專案追蹤、任務分配、進度監控
- **合約管理**: 合約建立、審核、執行追蹤
- **倉儲管理**: 多倉庫庫存追蹤、跨倉調撥、出入庫管理
- **AI 文件解析**: 智慧文件處理和分析
- **報表分析**: 業務數據視覺化和分析

## 📚 文件

詳細文件請參考 [docs/](./docs/) 目錄。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案。

## 📄 授權

此專案為私有專案，僅供內部使用。
