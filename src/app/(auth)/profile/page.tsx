/**
 * @fileoverview 用戶資料頁面 (入口點)
 * @description 此頁面是 Next.js App Router 的入口點，其唯一職責是渲染 ProfileView。
 * 所有資料獲取和顯示邏輯都封裝在 ProfileView 元件內部。
 */
import { ProfileView } from '@root/src/features/(system-admin)/(system-administration)/profile/profile-view';

// 強制動態渲染，因為此頁面需要訪問 cookies 進行用戶認證
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  // 此頁面只負責渲染主視圖元件，保持入口點的乾淨。
  // 資料獲取邏輯已移至 ProfileView 伺服器元件中。
  return <ProfileView />;
}
