'use client';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { collection, deleteDoc, doc, DocumentData, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

export interface NotificationDoc {
  id: string;
  recipientId: string;
  type: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt?: Date | null;
}

export function useNotifications(userId?: string | null) {
  const [items, setItems] = useState<NotificationDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(!!userId);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(firestore, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data: NotificationDoc[] = snap.docs.map((d) => {
        const v = d.data() as DocumentData;
        return {
          id: d.id,
          recipientId: v.recipientId,
          type: v.type,
          message: v.message,
          link: v.link ?? null,
          isRead: !!v.isRead,
          createdAt: v.createdAt?.toDate?.() ?? null,
        };
      });
      setItems(data);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(firestore, 'notifications', id), { isRead: true });
  };

  const dismiss = async (id: string) => {
    await deleteDoc(doc(firestore, 'notifications', id));
  };

  return { notifications: items, unreadCount, loading, markAsRead, dismiss };
}


