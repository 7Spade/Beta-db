/**
 * Auth Page - 認證主頁面
 * 
 * 功能說明：
 * - 認證功能的主要入口頁面
 * - 預設重定向到登入頁
 */
import { redirect } from 'next/navigation';

export default function AuthPage() {
  redirect('/login');
}
