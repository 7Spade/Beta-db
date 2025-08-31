import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/db/firebase-client/firebase-client';

export interface CreateLogInput {
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  details?: Record<string, unknown>;
}

export async function createLogEntry(input: CreateLogInput) {
  const { actorId, entityType, entityId, action, details } = input;
  await addDoc(collection(firestore, 'activity_logs'), {
    actorId,
    entityType,
    entityId,
    action,
    details: details || null,
    timestamp: serverTimestamp(),
  });
}
