# 技術棧 (Tech Stack)

本文件詳細列出了 Beta-db 整合平台所使用的核心技術、框架和服務。

## 前端 (Frontend)

- **框架**: [Next.js 15+](https://nextjs.org/) (App Router)
  - **核心優勢**: 混合伺服器與客戶端渲染、路由處理、伺服器元件 (Server Components)、Server Actions。
- **語言**: [TypeScript 5.0+](https://www.typescriptlang.org/)
  - **核心優勢**: 靜態類型檢查，提升程式碼品質與可維護性。
- **UI 元件庫**: [shadcn/ui](https://ui.shadcn.com/)
  - **核心優勢**: 基於 Radix UI 和 Tailwind CSS，提供美觀、可組合、易於客製化的元件。
- **樣式**: [Tailwind CSS 4.0+](https://tailwindcss.com/)
  - **核心優勢**: 原子化 CSS 框架，實現快速、一致的 UI 開發。
- **狀態管理**: React Hooks (`useState`, `useReducer`) + `useSWR`
  - **核心優勢**: 利用 Next.js App Router 的快取機制和 Server Actions，簡化了客戶端的狀態管理需求。
- **圖示**: [Lucide React](https://lucide.dev/)
  - **核心優勢**: 輕量、風格一致的 SVG 圖示庫。
- **表單**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
  - **核心優勢**: 高效能的表單管理與強大的 schema 驗證。

## 後端與資料庫 (Backend & Database)

- **核心服務**: [Firebase](https://firebase.google.com/)
  - **Firebase Authentication**: 用於使用者身份驗證 (Email/密碼、Google 登入)。
  - **Firestore (NoSQL)**: 作為核心業務數據的主資料庫（專案、合約、使用者等）。
  - **Firebase Storage**: 用於儲存使用者上傳的檔案（雲端硬碟功能）。
  
  > **重要開發規範：Client SDK vs. Admin SDK**
  >
  > - **Client SDK (`firebase`)**:
  >   - **使用時機**: **所有客戶端元件 (`'use client'`)** 中。
  >   - **運作方式**: 在使用者的瀏覽器中執行，**會嚴格遵守** 您在 `firestore.rules` 和 `storage.rules` 中定義的安全規則。這是確保資料安全的主要防線。
  >   - **初始化檔案**: `src/lib/db/firebase-client/firebase-client.ts`
  >
  - **Admin SDK (`firebase-admin`)**:
  >   - **使用時機**: **僅限於安全的伺服器環境**（如 Server Actions、API Routes、Genkit Flows）。
  >   - **運作方式**: 以**超級管理員權限**執行，**會繞過所有安全規則**。因此，絕不能在客戶端程式碼中洩漏或使用。
  >   - **初始化檔案**: `src/lib/db/firebase-admin/firebase-admin.ts`

- **日誌與流水帳資料庫**: [MongoDB](https://www.mongodb.com/) (透過 Mongoose)
  - **核心優勢**: 處理高頻寫入的數據（如庫存移動、AI Token 消耗紀錄），成本效益更高。
- **快取**: [Redis](https://redis.io/) (透過 ioredis)
  - **核心優勢**: 用於高效能的快取、會話管理和速率限制。
- **備用資料庫**: [Supabase](https://supabase.com/)
  - **核心優勢**: 提供一個基於 PostgreSQL 的備用方案，具備完整的後端即服務 (BaaS) 功能。

## AI 整合 (AI Integration)

- **框架**: [Google Genkit](https://firebase.google.com/docs/genkit)
  - **核心優勢**: 一個用於建構、部署和監控生產級 AI 應用的開源框架，與 Firebase 生態無縫整合。
- **模型**: [Google Gemini](https://deepmind.google/technologies/gemini/)
  - **核心優勢**: 強大的多模態模型，用於文件解析、內容生成和智慧建議。

## 部署與 DevOps (Deployment & DevOps)

- **主機平台**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)
  - **核心優勢**: 專為 Next.js 等 Web 框架設計的全託管、可擴展的後端服務。
- **持續整合/持續部署 (CI/CD)**: [GitHub Actions](https://github.com/features/actions)
  - **核心優勢**: 自動化測試、建構和部署流程。
