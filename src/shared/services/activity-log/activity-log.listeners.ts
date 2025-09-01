import { createLogEntry } from '@/shared/services/activity-log/activity-log.service';
import { subscribe } from '@root/src/shared/events/event-dispatcher';

// user.registered → actor 是該 user 自己
subscribe('user.registered', async ({ userId, email, displayName }) => {
  await createLogEntry({
    actorId: userId,
    entityType: 'user',
    entityId: userId,
    action: 'user.registered',
    details: { email, displayName },
  });
});

// user.approved → actor 是 admin（若提供），entity 是該 user
subscribe('user.approved', async ({ userId, adminId }) => {
  await createLogEntry({
    actorId: adminId || 'system',
    entityType: 'user',
    entityId: userId,
    action: 'user.approved',
  });
});

// user.rejected → actor 是 admin（若提供），entity 是該 user
subscribe('user.rejected', async ({ userId, adminId }) => {
  await createLogEntry({
    actorId: adminId || 'system',
    entityType: 'user',
    entityId: userId,
    action: 'user.rejected',
  });
});
