import { createNotification } from '@/lib/services/notification/notification.service';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import type { AppEventPayloadMap } from '@root/src/shared/events/app-events';
import { subscribe } from '@root/src/shared/events/event-dispatcher';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function getAdminUserIds(): Promise<string[]> {
  const q = query(collection(firestore, 'users'), where('role', '==', 'Admin'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.id);
}

function onUserRegistered(payload: AppEventPayloadMap['user.registered']) {
  getAdminUserIds().then((adminIds) => {
    adminIds.forEach((adminId) => {
      createNotification({
        recipientId: adminId,
        type: 'new_user_for_approval',
        message: `新用戶 ${payload.displayName || payload.email || payload.userId
          } 等待審核。`,
        link: '/user-management',
      });
    });
  });
}

function onUserApproved(payload: AppEventPayloadMap['user.approved']) {
  createNotification({
    recipientId: payload.userId,
    type: 'approval_result',
    message: '您的帳號已通過審核，歡迎使用！',
    link: '/dashboard',
  });
}

function onUserRejected(payload: AppEventPayloadMap['user.rejected']) {
  createNotification({
    recipientId: payload.userId,
    type: 'approval_result',
    message: '很抱歉，您的申請未通過審核。如需協助請聯繫管理員。',
    link: '/login',
  });
}

// Register listeners at module load (ensure this file is imported once in server paths)
subscribe('user.registered', onUserRegistered);
subscribe('user.approved', onUserApproved);
subscribe('user.rejected', onUserRejected);
