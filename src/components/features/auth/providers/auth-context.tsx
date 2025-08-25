/**
 * Auth Context - 認證上下文
 * 
 * 功能說明：
 * - 定義認證系統的 React Context
 * - 提供認證狀態和方法的類型定義
 * - 包含認證相關的狀態和方法介面
 * 
 * 主要內容：
 * - AuthContextType: 認證上下文類型
 * - AuthState: 認證狀態類型
 * - AuthMethods: 認證方法類型
 * - UserProfile: 用戶資料類型
 * - AuthError: 認證錯誤類型
 * 
 * Context 值：
 * - user: 當前用戶對象
 * - loading: 載入狀態
 * - error: 錯誤狀態
 * - isAuthenticated: 是否已認證
 * - login: 登入方法
 * - logout: 登出方法
 * - register: 註冊方法
 * - updateProfile: 更新資料方法
 * - resetPassword: 重置密碼方法
 * - sendEmailVerification: 發送郵箱驗證
 * - deleteAccount: 刪除帳號方法
 * 
 * 使用方式：
 * ```tsx
 * const auth = useContext(AuthContext);
 * ```
 */

// 認證上下文定義將在這裡