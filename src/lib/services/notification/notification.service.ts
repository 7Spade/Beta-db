import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/db/firebase-client/firebase-client';

export interface CreateNotificationInput {
  recipientId: string;
  type: string;
  message: string;
  link?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  const { recipientId, type, message, link } = input;
  await addDoc(collection(firestore, 'notifications'), {
    recipientId,
    type,
    message,
    link: link || null,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}
