/**
 * localStorage wrapper that never throws. If storage is unavailable (private
 * mode, blocked cookies, quota), it falls back to an in-memory map and reports
 * `persistent: false` so the UI can say progress won't survive a reload.
 */
export interface SafeStorage {
  persistent: boolean;
  get(key: string): string | null;
  set(key: string, value: string): boolean;
  remove(key: string): void;
}

export function createStorage(backing?: Storage | null): SafeStorage {
  const memory = new Map<string, string>();
  let store: Storage | null = null;
  try {
    const candidate = backing === undefined ? window.localStorage : backing;
    if (candidate) {
      const probe = '__think_again_probe__';
      candidate.setItem(probe, '1');
      candidate.removeItem(probe);
      store = candidate;
    }
  } catch {
    store = null;
  }
  const api: SafeStorage = {
    persistent: store !== null,
    get(key) {
      try {
        return store ? store.getItem(key) : (memory.get(key) ?? null);
      } catch {
        return memory.get(key) ?? null;
      }
    },
    set(key, value) {
      memory.set(key, value);
      try {
        store?.setItem(key, value);
        return true;
      } catch {
        api.persistent = false;
        return false;
      }
    },
    remove(key) {
      memory.delete(key);
      try {
        store?.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
  return api;
}
