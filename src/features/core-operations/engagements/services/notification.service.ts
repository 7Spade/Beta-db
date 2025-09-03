/**
 * @fileoverview 通知服務
 */
import { createNotification } from '@root/src/shared/services/notification/notification.service';
import type { Engagement, EngagementPhase, EngagementStatus } from '../types';

export class NotificationService {
  /**
   * 發送 Engagement 狀態變更通知
   */
  async sendStatusChangeNotification(
    engagement: Engagement,
    oldStatus: EngagementStatus,
    newStatus: EngagementStatus,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        console.log(`Engagement ${engagement.name} 狀態從 ${oldStatus} 變更為 ${newStatus} (無用戶ID，跳過通知)`);
        return { success: true };
      }

      await createNotification({
        recipientId: userId,
        type: 'engagement_status_change',
        message: `專案合約 "${engagement.name}" 狀態已從 ${oldStatus} 變更為 ${newStatus}`,
        link: `/core-operations/engagements/${engagement.id}`
      });

      console.log(`已發送狀態變更通知: Engagement ${engagement.name} 狀態從 ${oldStatus} 變更為 ${newStatus}`);

      return { success: true };
    } catch (error) {
      console.error('發送狀態變更通知失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }

  /**
   * 發送階段變更通知
   */
  async sendPhaseChangeNotification(
    engagement: Engagement,
    oldPhase: EngagementPhase,
    newPhase: EngagementPhase,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        console.log(`Engagement ${engagement.name} 階段從 ${oldPhase} 變更為 ${newPhase} (無用戶ID，跳過通知)`);
        return { success: true };
      }

      await createNotification({
        recipientId: userId,
        type: 'engagement_phase_change',
        message: `專案合約 "${engagement.name}" 階段已從 ${oldPhase} 變更為 ${newPhase}`,
        link: `/core-operations/engagements/${engagement.id}`
      });

      console.log(`已發送階段變更通知: Engagement ${engagement.name} 階段從 ${oldPhase} 變更為 ${newPhase}`);

      return { success: true };
    } catch (error) {
      console.error('發送階段變更通知失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }

    /**
   * 發送截止日期提醒
   */
  async sendDeadlineReminder(
    engagement: Engagement,
    userId?: string,
    daysUntilDeadline?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        console.log(`Engagement ${engagement.name} 即將到期 (無用戶ID，跳過通知)`);
        return { success: true };
      }

      const daysText = daysUntilDeadline ? `還有 ${daysUntilDeadline} 天` : '即將';
      const endDate = engagement.endDate instanceof Date
        ? engagement.endDate.toLocaleDateString('zh-TW')
        : engagement.endDate.toDate().toLocaleDateString('zh-TW');

      await createNotification({
        recipientId: userId,
        type: 'engagement_deadline_reminder',
        message: `專案合約 "${engagement.name}" ${daysText}到期 (${endDate})`,
        link: `/core-operations/engagements/${engagement.id}`
      });

      console.log(`已發送截止日期提醒: Engagement ${engagement.name} ${daysText}到期`);

      return { success: true };
    } catch (error) {
      console.error('發送截止日期提醒失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }

  /**
   * 發送任務分配通知
   */
  async sendTaskAssignmentNotification(
    engagementId: string,
    taskTitle: string,
    assigneeId: string,
    engagementName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await createNotification({
        recipientId: assigneeId,
        type: 'task_assignment',
        message: `您已被分配新任務: "${taskTitle}"${engagementName ? ` (專案: ${engagementName})` : ''}`,
        link: `/core-operations/engagements/${engagementId}`
      });
      
      console.log(`已發送任務分配通知: 任務 "${taskTitle}" 已分配給用戶 ${assigneeId}`);
      
      return { success: true };
    } catch (error) {
      console.error('發送任務分配通知失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }

  /**
   * 發送審批請求通知
   */
  async sendApprovalRequestNotification(
    engagementId: string,
    itemType: string,
    itemTitle: string,
    approverId: string,
    engagementName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await createNotification({
        recipientId: approverId,
        type: 'approval_request',
        message: `需要您的審批: ${itemType} "${itemTitle}"${engagementName ? ` (專案: ${engagementName})` : ''}`,
        link: `/core-operations/engagements/${engagementId}`
      });
      
      console.log(`已發送審批請求通知: ${itemType} "${itemTitle}" 需要 ${approverId} 審批`);
      
      return { success: true };
    } catch (error) {
      console.error('發送審批請求通知失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }

  /**
   * 發送付款提醒通知
   */
  async sendPaymentReminder(
    engagement: Engagement,
    userId?: string,
    paymentAmount?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        console.log(`Engagement ${engagement.name} 付款提醒 (無用戶ID，跳過通知)`);
        return { success: true };
      }

      const amountText = paymentAmount ? `金額: ${engagement.currency} ${paymentAmount.toLocaleString()}` : '';

      await createNotification({
        recipientId: userId,
        type: 'payment_reminder',
        message: `專案合約 "${engagement.name}" 有待付款項目${amountText ? ` (${amountText})` : ''}`,
        link: `/core-operations/engagements/${engagement.id}`
      });
      
      console.log(`已發送付款提醒: Engagement ${engagement.name}`);
      
      return { success: true };
    } catch (error) {
      console.error('發送付款提醒失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }

  /**
   * 發送里程碑完成通知
   */
  async sendMilestoneCompletedNotification(
    engagement: Engagement,
    milestoneName: string,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId) {
        console.log(`里程碑 "${milestoneName}" 已完成 (無用戶ID，跳過通知)`);
        return { success: true };
      }

      await createNotification({
        recipientId: userId,
        type: 'milestone_completed',
        message: `專案合約 "${engagement.name}" 的里程碑 "${milestoneName}" 已完成`,
        link: `/core-operations/engagements/${engagement.id}`
      });
      
      console.log(`已發送里程碑完成通知: "${milestoneName}" 在 Engagement ${engagement.name} 中已完成`);
      
      return { success: true };
    } catch (error) {
      console.error('發送里程碑完成通知失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `發送失敗: ${errorMessage}` };
    }
  }
}

// 導出單例實例
export const notificationService = new NotificationService();