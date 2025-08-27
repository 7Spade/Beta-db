/**
 * Profile Page - 用戶資料頁面
 * 
 * 功能說明：
 * - 專門用於顯示和編輯當前登入用戶個人資料的頁面。
 * - 職責是渲染 ProfileView 元件。
 */

'use client';

import { ProfileView } from '@/components/features/auth/profile-view';

export default function ProfilePage() {
  return <ProfileView />;
}
