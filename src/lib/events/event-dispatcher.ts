import type { AppEventName, AppEventPayloadMap } from '@/events/app-events';

type Listener<T extends AppEventName> = (payload: AppEventPayloadMap[T]) => void | Promise<void>;

type DispatcherStore = {
  listeners: Map<AppEventName, Set<Listener<any>>>;
};

const globalKey = '__app_event_dispatcher__';

function getStore(): DispatcherStore {
  const g = globalThis as any;
  if (!g[globalKey]) {
    g[globalKey] = { listeners: new Map() } as DispatcherStore;
  }
  return g[globalKey] as DispatcherStore;
}

export function subscribe<T extends AppEventName>(name: T, listener: Listener<T>): () => void {
  const store = getStore();
  const set = store.listeners.get(name) || new Set();
  set.add(listener as Listener<any>);
  store.listeners.set(name, set);
  return () => {
    set.delete(listener as Listener<any>);
  };
}

export async function dispatch<T extends AppEventName>(name: T, payload: AppEventPayloadMap[T]): Promise<void> {
  const store = getStore();
  const set = store.listeners.get(name);
  if (!set) return;
  for (const listener of Array.from(set)) {
    await Promise.resolve(listener(payload));
  }
}


