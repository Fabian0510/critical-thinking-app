import { SKILLS, type Item, type Skill } from '../types/content';
import type { Attempt, AttemptContext } from '../types/progress';
import { calibrationBuckets, calibrationPoints, expectedCalibrationError } from './calibration';

export interface SkillScore {
  skill: Skill;
  /** Number of scored attempts contributing. */
  n: number;
  /** Mean score 0–1, or null when there is no data. */
  mean: number | null;
}

/** Contexts that count towards the skill profile (lesson checks and practice are for learning, not measuring). */
export const MEASURED_CONTEXTS: AttemptContext[] = ['test', 'placement', 'final'];

/** Minimum calibration answers before calibration quality feeds the "calibration" skill. */
const MIN_CALIBRATION_POINTS = 8;

/**
 * Per-skill mean score over measured attempts. An item tagged with several skills
 * counts towards each. The "calibration" skill also folds in how closely the
 * learner's confidence tracked their accuracy (1 − 2 × expected calibration error).
 */
export function skillProfile(attempts: Attempt[], getItem: (id: string) => Item | undefined): SkillScore[] {
  const measured = attempts.filter((a) => MEASURED_CONTEXTS.includes(a.context));
  const sums = new Map<Skill, { total: number; n: number }>();
  for (const a of measured) {
    if (a.score === null) continue;
    const item = getItem(a.itemId);
    if (!item) continue;
    for (const s of item.skills) {
      const cur = sums.get(s) ?? { total: 0, n: 0 };
      cur.total += a.score;
      cur.n += 1;
      sums.set(s, cur);
    }
  }
  const points = calibrationPoints(measured);
  if (points.length >= MIN_CALIBRATION_POINTS) {
    const ece = expectedCalibrationError(calibrationBuckets(points)) ?? 0;
    const cur = sums.get('calibration') ?? { total: 0, n: 0 };
    cur.total += Math.max(0, 1 - 2 * ece);
    cur.n += 1;
    sums.set('calibration', cur);
  }
  return SKILLS.map((skill) => {
    const s = sums.get(skill);
    return { skill, n: s?.n ?? 0, mean: s && s.n > 0 ? s.total / s.n : null };
  });
}
