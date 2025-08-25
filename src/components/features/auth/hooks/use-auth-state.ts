/**
 * @fileoverview 身份驗證狀態管理 Hook
 * @description 一個自定義 React Hook，用於監聽和提供全局的用戶認證狀態。
 */
'use client';

import { useState } from 'react';

// 這是 Hook 的基礎骨架，後續會接入 Firebase 的 onAuthStateChanged。
export function useAuthState() {
  const [user, setUser] = useState<null | object>(null); // 暫時用 object 代表 user
  const [loading, setLoading] = useState(true);

  // 這裡將會是監聽 Firebase 認證狀態變化的邏輯

  return { user, loading };
}
