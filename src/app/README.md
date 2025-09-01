# Next.js App Router 路由群組設計

## 路由群組架構

此專案使用 Next.js App Router 的路由群組功能來組織不同類型的頁面，避免路由衝突並提供清晰的程式碼結構。

### 路由群組結構

```
src/app/
├── layout.tsx                    # 根佈局 (包含 html, body, AuthProvider)
├── (app)/                        # 應用程式路由群組 (需要登入)
│   ├── layout.tsx               # 應用佈局 (AppShell)
│   ├── automation-tools/        # 自動化工具
│   ├── business-intelligence/   # 商業智慧
│   ├── core-operations/         # 核心操作
│   ├── resource-management/     # 資源管理
│   └── system-administration/   # 系統管理
├── (auth)/                       # 認證路由群組
│   ├── layout.tsx               # 認證佈局 (置中佈局)
│   ├── login/                   # 登入頁面
│   ├── register/                # 註冊頁面
│   ├── verify-email/            # 郵箱驗證
│   ├── reset-password/          # 密碼重置
│   ├── pending-approval/        # 帳號待審核
│   └── profile/                 # 用戶資料
└── (public)/                     # 公開路由群組
    ├── layout.tsx               # 公開佈局 (頁首+頁尾)
    ├── page.tsx                 # 首頁
    ├── about/                   # 關於我們
    ├── blog/                    # 部落格
    ├── careers/                 # 企業徵才
    ├── contact/                 # 聯絡我們
    ├── privacy-policy/          # 隱私權政策
    └── terms-of-service/        # 服務條款
```

## 避免路由衝突的設計原則

### 1. 單一根佈局原則
- **根佈局** (`src/app/layout.tsx`) 是唯一包含 `<html>` 和 `<body>` 標籤的佈局
- 所有子佈局只能包含內容區域，不能重複定義 HTML 結構

### 2. Provider 層級管理
- **根佈局**：包含全域 Provider (`AuthProvider`, `Toaster`)
- **應用佈局**：包含應用特定 Provider (`AppProvider`)
- **認證佈局**：純 UI 佈局，不包含 Provider
- **公開佈局**：純 UI 佈局，不包含 Provider

### 3. 路由群組命名規範
- 使用括號 `()` 包圍群組名稱，避免影響 URL 路徑
- 群組名稱具有語義化意義，清楚表達用途

### 4. 佈局繼承關係
```
RootLayout (html, body, AuthProvider, Toaster)
├── AppLayout (AppProvider, AppShell) - 應用頁面
├── AuthLayout (置中佈局) - 認證頁面
└── PublicLayout (頁首+頁尾) - 公開頁面
```

## 路由衝突檢查清單

### ✅ 已解決的問題
1. **移除重複的 HTML 結構**：公開佈局不再包含 `<html>` 和 `<body>`
2. **移除重複的 Provider**：應用佈局不再重複包含 `AuthProvider`
3. **統一的 metadata 管理**：根佈局提供完整的 SEO 配置

### 🔍 需要定期檢查的項目
1. **URL 路徑衝突**：確保不同群組內的路由不會產生相同的 URL
2. **佈局嵌套**：避免在子佈局中重複定義父佈局的結構
3. **Provider 重複**：確保 Provider 只在適當的層級定義一次

## 最佳實踐

### 1. 新增路由群組時
```typescript
// ✅ 正確：只包含群組特定的 UI 結構
export default function NewGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="new-group-layout">
      <nav>群組導航</nav>
      <main>{children}</main>
    </div>
  );
}

// ❌ 錯誤：重複定義 HTML 結構
export default function WrongLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 2. 新增 Provider 時
```typescript
// ✅ 正確：在根佈局中新增全域 Provider
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <NewGlobalProvider>
            {children}
          </NewGlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// ✅ 正確：在應用佈局中新增應用特定 Provider
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <NewAppProvider>
        <AppShell>{children}</AppShell>
      </NewAppProvider>
    </AppProvider>
  );
}
```

## 參考資源

- [Next.js Route Groups 官方文檔](https://app-router.vercel.app/route-groups)
- [Next.js App Router 佈局文檔](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Next.js 路由群組最佳實踐](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
