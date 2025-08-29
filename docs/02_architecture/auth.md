# 認證功能檔案清單 (Auth Feature Files List)

本文件列出了 Beta-db 整合平台中所有與身份驗證（註冊、登入、權限管理）相關的核心檔案。

## 📁 目錄結構

### 1. 認證功能元件 (Auth Feature Components)
```
src/features/auth/
├── README.md                           # 身份驗證模組概述
├── index.ts                            # 模組統一導出
├── actions/auth-actions.ts             # 包含 createUserProfile 等核心操作 (Client-side)
├── auth-form-schemas.ts                # Zod-based 驗證規則 (登入、註冊、個人資料)
├── auth-provider.tsx                   # 核心路由守衛，處理頁面訪問權限
├── use-auth.ts                         # 客戶端 Hook，用於獲取用戶狀態和個人資料
├── login-view.tsx                      # 登入介面元件
├── register-view.tsx                   # 註冊介面元件
├── profile-view.tsx                    # "我的個人資料" 頁面元件
├── public-profile-view.tsx             # 公開的用戶個人資料頁面元件
└── social-auth-buttons.tsx             # Google 社交登入按鈕元件
```

### 2. 管理員操作 (Admin Actions)
```
src/features/admin/
├── actions/user-actions.ts             # 管理員審核用戶的 Server Actions (approveUser, rejectUser)
└── views/user-management-view.tsx      # 管理員審核使用者的介面
```

### 3. 認證相關頁面 (Auth Pages)
```
src/app/(auth)/
├── layout.tsx                          # 認證頁面 (登入/註冊) 的置中佈局
├── login/page.tsx                      # 登入頁面
├── register/page.tsx                   # 註冊頁面
├── pending-approval/page.tsx           # 帳號待審核提示頁面
├── verify-email/page.tsx               # 郵箱驗證提示頁面
├── reset-password/page.tsx             # 密碼重置頁面
└── profile/
    ├── page.tsx                        # 當前登入用戶的個人資料頁
    └── [id]/page.tsx                   # 查看其他用戶的公開個人資料頁
```

### 4. 相關服務與設定 (Related Services & Config)
```
src/lib/db/firebase-client/firebase-client.ts # 初始化 Firebase Client SDK (包含 Auth)
src/lib/db/firebase-admin/firebase-admin.ts   # 初始化 Firebase Admin SDK (包含 Auth)
```

## 🔧 技術架構

- **核心服務**: Firebase Authentication
- **資料庫**: Firebase Firestore (`users` 集合)
- **客戶端狀態**: React Context + Custom Hook (`useAuth`)
- **表單驗證**: `react-hook-form` + `zod`
- **路由保護**: 高階元件 `AuthProvider`

## 📊 核心流程

1.  **註冊**:
    - 使用者在 `/register` 頁面填寫信箱和密碼。
    - `register-view.tsx` 呼叫 Firebase Auth `createUserWithEmailAndPassword` 建立帳號。
    - 成功後，呼叫 `createUserProfile` 在 `users` 集合中建立一份文件，`status` 預設為 `'pending'`。
    - 觸發 `user.registered` 事件，通知管理員有新用戶待審核。
    - 引導使用者至登入頁面。

2.  **登入**:
    - 使用者在 `/login` 頁面登入。
    - `<AuthProvider>` 元件開始工作。

3.  **路由守衛 (`AuthProvider`)**:
    - **檢查狀態**: `useAuth` Hook 會監聽認證狀態，並從 `users` 集合讀取用戶的 `status`。
    - **未登入**: 如果用戶未登入且試圖訪問受保護頁面，則被重導向至 `/login`。
    - **待審核 (`pending`)**: 如果用戶 `status` 為 `'pending'`，則被強制重導向至 `/pending-approval` 頁面，無法訪問其他內容。
    - **已拒絕 (`rejected`)**: 如果用戶 `status` 為 `'rejected'`，系統會自動將其登出並重導向至登入頁，並附帶錯誤提示。
    - **已批准 (`approved`)**: 用戶可以正常訪問 `/dashboard` 及其他受保護的頁面。

4.  **管理員審核**:
    - 管理員在 `/user-management` 頁面看到待審核用戶列表。
    - 點擊「核准」或「拒絕」按鈕，觸發 `approveUser` 或 `rejectUser` Server Action。
    - Action 更新 Firestore 中對應用戶的 `status`。
    - `onSnapshot` 會即時更新用戶端的 `status`，`AuthProvider` 接著會將用戶導向到正確的頁面。

## 📚 相關文件

- [資料庫設計文件](./database.md) (`users` 集合)
- [事件驅動架構](./events.md) (使用者相關事件)
