import type { LevelId } from '../types/content';

/** Level names and arc phases, available even before a level's content is written. */
export const LEVEL_META: Record<LevelId, { title: string; audience: string; phase: number }> = {
  1: { title: 'How do you know?', audience: 'Anyone', phase: 0 },
  2: { title: 'Claims vs. evidence', audience: 'Teenager', phase: 0 },
  3: { title: 'Taking arguments apart', audience: 'University student', phase: 1 },
  4: { title: 'Your own mind is the adversary', audience: 'Graduate student', phase: 2 },
  5: { title: 'Thinking about thinking', audience: 'Expert', phase: 3 },
};

export const ARC_PHASES = [
  { name: 'Doubting claims', levels: 'Levels 1–2' },
  { name: 'Judging arguments', levels: 'Level 3' },
  { name: 'Distrusting your own mind', levels: 'Level 4' },
  { name: 'Knowing when and whom to trust', levels: 'Level 5' },
];
