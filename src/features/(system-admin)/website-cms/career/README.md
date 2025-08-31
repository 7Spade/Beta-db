
# 徵才模組 (Career Module)

## 概述

此模組負責管理所有與「企業徵才」相關的功能，涵蓋了從後台的職缺管理到前台的職缺列表與應徵流程。

## 架構設計

### 目錄結構

```
career/
├── actions/                     # Server Actions
│   ├── job.actions.ts           # 職缺 CRUD 操作
│   ├── application.actions.ts   # 應徵 CRUD 操作
│   ├── interview.actions.ts     # 面試管理操作
│   └── email.actions.ts         # 郵件通知操作
├── components/                  # 徵才組件
│   ├── JobEditor/
│   ├── JobCard/
│   ├── JobList/
│   ├── ApplicationCard/
│   ├── ApplicationList/
│   ├── InterviewScheduler/
│   └── ApplyForm/
├── hooks/                       # 自定義 Hooks
│   ├── use-job-form.ts
│   ├── use-job-list.ts
│   └── use-applications.ts
├── types/                       # 類型定義
│   ├── job.types.ts
│   ├── application.types.ts
│   └── interview.types.ts
├── utils/                       # 工具函數
│   ├── slug.utils.ts
│   ├── status.utils.ts
│   └── notification.utils.ts
└── views/                       # 頁面視圖
    ├── JobListView.tsx
    ├── JobFormView.tsx
    ├── ApplicationListView.tsx
    ├── ApplicationDetailView.tsx
    └── PublicCareerView.tsx
```

### 核心功能

- **職缺管理 (後台)**: 提供給管理員建立、編輯、發布、封存和刪除職缺的功能。
- **應徵者追蹤 (後台)**: 管理所有應徵者的資訊、履歷，並追蹤應徵狀態。
- **職缺展示 (前台)**: 在 `/careers` 公開頁面中，以列表形式展示所有已發布的職缺。
- **線上應徵 (前台)**: 提供應徵者一個表單來提交他們的申請。
