import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import type { Progress } from '../types/progress';
import { loadProgress, reducer, saveProgress, type Action } from './progress';
import { createStorage, type SafeStorage } from './storage';

interface Ctx {
  progress: Progress;
  dispatch: Dispatch<Action>;
  persistent: boolean;
}

const ProgressCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children, storage }: { children: ReactNode; storage?: SafeStorage }) {
  const store = useMemo(() => storage ?? createStorage(), [storage]);
  const [progress, dispatch] = useReducer(reducer, store, loadProgress);
  useEffect(() => {
    saveProgress(store, progress);
  }, [store, progress]);
  const value = useMemo(() => ({ progress, dispatch, persistent: store.persistent }), [progress, store.persistent]);
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}

export const newRunId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
