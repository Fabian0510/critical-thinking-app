import type { Confidence, LevelId } from './content';

export type McResponse = { choice: string };
export type TagResponse = { tags: Record<string, string> };
export type RankResponse = { order: string[] };
export type GridResponse = { valid: boolean; premisesTrue: boolean };
export type NumericResponse = { value: number };
/** One estimate (0–1) after each evidence card, in order. */
export type SliderResponse = { estimates: number[] };
/** Rating 1 (very weak) – 7 (very strong). */
export type PairedResponse = { rating: number; stance?: string };
export type ReflectionResponse = { text: string; selfCheck: boolean[] };

export type ItemResponse =
  | McResponse
  | TagResponse
  | RankResponse
  | GridResponse
  | NumericResponse
  | SliderResponse
  | PairedResponse
  | ReflectionResponse;

export type AttemptContext = 'check' | 'practice' | 'test' | 'placement' | 'final';

export interface Attempt {
  itemId: string;
  runId: string;
  context: AttemptContext;
  ts: number;
  response: ItemResponse;
  /** 0–1, or null for unscored items (reflection, paired). */
  score: number | null;
  /** Counted as right for calibration purposes; null for unscored items. */
  correct: boolean | null;
  confidence?: Confidence;
}

export type RunKind = 'level' | 'placement' | 'final';

export interface Run {
  id: string;
  kind: RunKind;
  level?: LevelId;
  itemIds: string[];
  startedAt: number;
  finishedAt?: number;
  /** Mean score over scored items, 0–1. */
  score?: number;
  passed?: boolean;
}

export interface LevelProgress {
  lessonDone: boolean;
  practiceDone: boolean;
  passed: boolean;
}

export interface Progress {
  version: 1;
  levels: Record<LevelId, LevelProgress>;
  /** Highest level the learner may enter. */
  unlockedThrough: LevelId;
  placement?: { recommended: LevelId; runId: string; chosen?: LevelId };
  runs: Run[];
  attempts: Attempt[];
}
