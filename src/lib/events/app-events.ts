export type AppEventName =
  | 'user.registered'
  | 'user.approved'
  | 'user.rejected';

export interface AppEventPayloadMap {
  'user.registered': { userId: string; displayName?: string | null; email?: string | null };
  'user.approved': { userId: string };
  'user.rejected': { userId: string };
}


