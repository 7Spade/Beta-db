/**
 * Pending Approval Page - 帳號待審核頁面
 *
 * 功能說明：
 * - 告知新註冊的使用者其帳號正在等待管理員審核。
 * - 職責是渲染 PendingApprovalView 元件。
 */
import { PendingApprovalView } from '@/features/auth/pending-approval-view';

export default function PendingApprovalPage() {
  return <PendingApprovalView />;
}
