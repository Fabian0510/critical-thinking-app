import type { Item, LevelId } from '../types/content';
import type { Attempt } from '../types/progress';

/** A level counts as "already there" at or above this mean score on its placement items. */
export const PLACEMENT_PASS = 0.75;

export interface PlacementResult {
  recommended: LevelId;
  byLevel: { level: LevelId; n: number; mean: number | null }[];
}

/**
 * Recommend the first level the learner hasn't yet shown they can handle:
 * walk up from Level 1 while each level's placement items average ≥ PLACEMENT_PASS.
 * Clearing all five recommends Level 5 (the final assessment needs Level 5 passed).
 */
export function recommendLevel(attempts: Attempt[], getItem: (id: string) => Item | undefined): PlacementResult {
  const byLevel = ([1, 2, 3, 4, 5] as LevelId[]).map((level) => {
    const scores = attempts
      .filter((a) => a.score !== null && getItem(a.itemId)?.level === level)
      .map((a) => a.score as number);
    return { level, n: scores.length, mean: scores.length ? scores.reduce((x, y) => x + y, 0) / scores.length : null };
  });
  let recommended: LevelId = 1;
  for (const b of byLevel) {
    if (b.mean !== null && b.mean >= PLACEMENT_PASS && b.level < 5) recommended = (b.level + 1) as LevelId;
    else break;
  }
  return { recommended, byLevel };
}
