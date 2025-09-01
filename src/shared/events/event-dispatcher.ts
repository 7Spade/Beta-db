import type { AppEventName, AppEventPayloadMap } from '@root/src/shared/events/app-events';

type Listener<T extends AppEventName> = (
  payload: AppEventPayloadMap[T]
) => void | Promise<void>;

type DispatcherStore = {
  listeners: Map<AppEventName, Set<Listener<AppEventName>>>;
};

const globalKey = '__app_event_dispatcher__';

function getStore(): DispatcherStore {
  const g = globalThis as { [key: string]: unknown };
  if (!g[globalKey]) {
    g[globalKey] = { listeners: new Map() } as DispatcherStore;
  }
  return g[globalKey] as DispatcherStore;
}

export function subscribe<T extends AppEventName>(
  name: T,
  listener: Listener<T>
): () => void {
  const store = getStore();
  const set = store.listeners.get(name) || new Set();
  set.add(listener as Listener<AppEventName>);
  store.listeners.set(name, set);
  return () => {
    set.delete(listener as Listener<AppEventName>);
  };
}

export async function dispatch<T extends AppEventName>(
  name: T,
  payload: AppEventPayloadMap[T]
): Promise<void> {
  const store = getStore();
  const set = store.listeners.get(name);
  if (!set) return;
  for (const listener of Array.from(set)) {
    await Promise.resolve(listener(payload));
  }
}
