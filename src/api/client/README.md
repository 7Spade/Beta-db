# API 客戶端 (API Client)

## 概述

此目錄包含了所有**前端**用於與後端 API 進行通訊的程式碼。UI 元件不應該直接使用 `fetch`，而應該透過此處提供的服務或 hooks 來發起請求。

## 目錄結構

- **/core/**: 存放 API 客戶端的核心配置，例如 `axios` 的實例、攔截器 (interceptors) 設定，用於統一處理認證 token、錯誤處理等。
- **/services/**: 封裝了對不同業務資源的 API 操作。每個 service 檔案對應一個後端資源。例如 `project.service.ts` 可能會包含 `getProjects()`, `createProject(data)` 等函式。
- **/hooks/**: （可選）提供自定義的 React Hooks (例如基於 `react-query` 或 `SWR` 的 hooks)，用於簡化數據獲取、快取和狀態管理。例如 `useProjects()` 可能會封裝 `project.service.ts` 的呼叫並處理載入和錯誤狀態。
