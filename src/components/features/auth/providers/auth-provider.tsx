/**
 * @fileoverview 身份驗證 Context Provider
 * @description 提供一個全局的 Context，讓應用程式的任何地方都能存取用戶認證狀態。
 */
'use client';

import React from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 這裡將會使用 useAuthState 並將狀態透過 Context 提供出去
  return (
    <>
      {children}
    </>
  );
}
