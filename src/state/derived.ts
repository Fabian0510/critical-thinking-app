import { allScreens, getItem } from '../content';
import { brierScore, calibrationBuckets, calibrationPoints, calibrationVerdict } from '../scoring/calibration';
import { pairedResults } from '../scoring/paired';
import { recommendations } from '../scoring/recommend';
import { skillProfile } from '../scoring/skills';
import type { Attempt } from '../types/progress';

/** Everything the results views show, derived from a set of attempts. */
export function deriveResults(attempts: Attempt[], allAttempts: Attempt[] = attempts) {
  const points = calibrationPoints(attempts);
  const profile = skillProfile(attempts, getItem);
  const paired = pairedResults(attempts, getItem);
  return {
    profile,
    points,
    buckets: calibrationBuckets(points),
    brier: brierScore(points),
    verdict: calibrationVerdict(points),
    paired,
    recs: recommendations({ profile: skillProfile(allAttempts, getItem), attempts: allAttempts, paired, screens: allScreens(), getItem }),
  };
}
