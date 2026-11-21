/**
 * Progress state: a pure reducer plus load/save helpers.
 * Everything derived (scores, calibration, skill profile) is recomputed from `attempts`.
 */
import { LEVELS, type LevelId } from '../types/content';
import type { Attempt, Progress, Run } from '../types/progress';
import type { SafeStorage } from './storage';

export const STORAGE_KEY = 'think-again:progress:v1';

export function emptyProgress(): Progress {
  return {
    version: 1,
    levels: {
      1: { lessonDone: false, practiceDone: false, passed: false },
      2: { lessonDone: false, practiceDone: false, passed: false },
      3: { lessonDone: false, practiceDone: false, passed: false },
      4: { lessonDone: false, practiceDone: false, passed: false },
      5: { lessonDone: false, practiceDone: false, passed: false },
    },
    unlockedThrough: 1,
    runs: [],
    attempts: [],
  };
}

export type Action =
  | { type: 'lesson-done'; level: LevelId }
  | { type: 'practice-done'; level: LevelId }
  | { type: 'start-run'; run: Run }
  | { type: 'record-attempt'; attempt: Attempt }
  | { type: 'finish-run'; runId: string; score: number; passed?: boolean; at: number }
  | { type: 'abandon-run'; runId: string }
  | { type: 'placement-result'; runId: string; recommended: LevelId }
  | { type: 'choose-start'; level: LevelId }
  | { type: 'reset' };

const maxLevel = (a: LevelId, b: LevelId): LevelId => (a > b ? a : b);

export function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'lesson-done':
      return { ...state, levels: { ...state.levels, [action.level]: { ...state.levels[action.level], lessonDone: true } } };
    case 'practice-done':
      return { ...state, levels: { ...state.levels, [action.level]: { ...state.levels[action.level], practiceDone: true } } };
    case 'start-run':
      return { ...state, runs: [...state.runs, action.run] };
    case 'record-attempt': {
      // Re-answering the same item within a run replaces the earlier answer.
      const rest = state.attempts.filter((a) => !(a.runId === action.attempt.runId && a.itemId === action.attempt.itemId));
      return { ...state, attempts: [...rest, action.attempt] };
    }
    case 'finish-run': {
      const run = state.runs.find((r) => r.id === action.runId);
      if (!run) return state;
      const runs = state.runs.map((r) =>
        r.id === action.runId ? { ...r, finishedAt: action.at, score: action.score, passed: action.passed } : r,
      );
      let { levels, unlockedThrough } = state;
      if (run.kind === 'level' && run.level && action.passed) {
        levels = { ...levels, [run.level]: { ...levels[run.level], passed: true } };
        if (run.level < 5) unlockedThrough = maxLevel(unlockedThrough, (run.level + 1) as LevelId);
      }
      return { ...state, runs, levels, unlockedThrough };
    }
    case 'abandon-run':
      return {
        ...state,
        runs: state.runs.filter((r) => r.id !== action.runId),
        attempts: state.attempts.filter((a) => a.runId !== action.runId),
      };
    case 'placement-result':
      return { ...state, placement: { recommended: action.recommended, runId: action.runId } };
    case 'choose-start':
      // Placement can only unlock as far as it recommended; the learner may choose to start lower.
      return {
        ...state,
        placement: state.placement ? { ...state.placement, chosen: action.level } : state.placement,
        unlockedThrough: maxLevel(state.unlockedThrough, action.level),
      };
    case 'reset':
      return emptyProgress();
  }
}

/** Parse stored progress defensively; anything unrecognisable gives a fresh start. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw) as Partial<Progress>;
    if (p.version !== 1 || !Array.isArray(p.attempts) || !Array.isArray(p.runs) || !p.levels) return emptyProgress();
    const fresh = emptyProgress();
    const levels = { ...fresh.levels };
    for (const l of LEVELS) levels[l] = { ...fresh.levels[l], ...(p.levels[l] ?? {}) };
    const unlocked = LEVELS.includes(p.unlockedThrough as LevelId) ? (p.unlockedThrough as LevelId) : 1;
    return { ...fresh, ...p, levels, unlockedThrough: unlocked } as Progress;
  } catch {
    return emptyProgress();
  }
}

export function loadProgress(storage: SafeStorage): Progress {
  return parseProgress(storage.get(STORAGE_KEY));
}

export function saveProgress(storage: SafeStorage, p: Progress): boolean {
  return storage.set(STORAGE_KEY, JSON.stringify(p));
}

/** Most recent unfinished run of a kind (and level), for resuming after a reload. */
export function activeRun(p: Progress, kind: Run['kind'], level?: LevelId): Run | undefined {
  return [...p.runs].reverse().find((r) => r.kind === kind && r.level === level && r.finishedAt === undefined);
}

/** Ids of items the learner has met in any scored test context — used to avoid repeats on retakes. */
export function seenItemIds(p: Progress): Set<string> {
  return new Set(p.attempts.filter((a) => a.context === 'test' || a.context === 'final').map((a) => a.itemId));
}
