export type AppEventName =
  | 'user.registered'
  | 'user.approved'
  | 'user.rejected';

export interface AppEventPayloadMap {
  'user.registered': {
    userId: string;
    displayName?: string | null;
    email?: string | null;
  };
  'user.approved': { userId: string; adminId?: string };
  'user.rejected': { userId: string; adminId?: string };
}
