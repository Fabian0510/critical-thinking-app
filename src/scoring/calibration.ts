import { CONFIDENCES, type Confidence } from '../types/content';
import type { Attempt } from '../types/progress';

export interface CalibrationPoint {
  confidence: number;
  correct: boolean;
}

/** Attempts that carry both a confidence and a right/wrong outcome. */
export function calibrationPoints(attempts: Attempt[]): CalibrationPoint[] {
  return attempts
    .filter((a) => a.confidence !== undefined && a.correct !== null)
    .map((a) => ({ confidence: a.confidence as number, correct: a.correct as boolean }));
}

/**
 * Brier score: mean squared gap between stated confidence and outcome (1 = right, 0 = wrong).
 * 0 is perfect; always saying 50% scores 0.25. Returns null when there's no data.
 */
export function brierScore(points: CalibrationPoint[]): number | null {
  if (points.length === 0) return null;
  const sum = points.reduce((s, p) => s + (p.confidence - (p.correct ? 1 : 0)) ** 2, 0);
  return sum / points.length;
}

export interface CalibrationBucket {
  confidence: Confidence;
  n: number;
  /** Fraction right, or null when n = 0. */
  accuracy: number | null;
}

export function calibrationBuckets(points: CalibrationPoint[]): CalibrationBucket[] {
  return CONFIDENCES.map((c) => {
    const inBucket = points.filter((p) => Math.abs(p.confidence - c) < 1e-9);
    const n = inBucket.length;
    return { confidence: c, n, accuracy: n === 0 ? null : inBucket.filter((p) => p.correct).length / n };
  });
}

/** Expected calibration error: average |confidence − accuracy|, weighted by bucket size. */
export function expectedCalibrationError(buckets: CalibrationBucket[]): number | null {
  const total = buckets.reduce((s, b) => s + b.n, 0);
  if (total === 0) return null;
  return buckets.reduce((s, b) => (b.accuracy === null ? s : s + (b.n / total) * Math.abs(b.confidence - b.accuracy)), 0);
}

export const pct = (x: number) => `${Math.round(x * 100)}%`;

/** Plain-language sentence for one bucket, e.g. "When you said 90% sure, you were right 64% of the time (11 answers)." */
export function describeBucket(b: CalibrationBucket): string | null {
  if (b.accuracy === null) return null;
  const answers = b.n === 1 ? '1 answer' : `${b.n} answers`;
  return `When you said ${pct(b.confidence)} sure, you were right ${pct(b.accuracy)} of the time (${answers}).`;
}

export type CalibrationVerdict = 'too-few' | 'overconfident' | 'underconfident' | 'well-calibrated' | 'mixed';

/** Minimum answers before we'll say anything about overall calibration. */
export const MIN_FOR_VERDICT = 8;
/** Gap between average confidence and accuracy that counts as a real lean. */
const LEAN = 0.1;

export function calibrationVerdict(points: CalibrationPoint[]): {
  verdict: CalibrationVerdict;
  meanConfidence: number | null;
  accuracy: number | null;
  summary: string;
} {
  const n = points.length;
  if (n < MIN_FOR_VERDICT) {
    return {
      verdict: 'too-few',
      meanConfidence: null,
      accuracy: null,
      summary: `Answer at least ${MIN_FOR_VERDICT} scored questions to see how well your confidence matches your accuracy (you have ${n}).`,
    };
  }
  const meanConfidence = points.reduce((s, p) => s + p.confidence, 0) / n;
  const accuracy = points.filter((p) => p.correct).length / n;
  const gap = meanConfidence - accuracy;
  const ece = expectedCalibrationError(calibrationBuckets(points)) ?? 0;
  const base = `On average you said ${pct(meanConfidence)} sure and were right ${pct(accuracy)} of the time.`;
  if (gap > LEAN) {
    return {
      verdict: 'overconfident',
      meanConfidence,
      accuracy,
      summary: `${base} You tend to be more sure than your results justify — the most common pattern, and the one that leads people to stop checking too early.`,
    };
  }
  if (gap < -LEAN) {
    return {
      verdict: 'underconfident',
      meanConfidence,
      accuracy,
      summary: `${base} You know more than you give yourself credit for. Being underconfident is safer than the reverse, but it can make you defer when you don't need to.`,
    };
  }
  if (ece > 0.15) {
    return {
      verdict: 'mixed',
      meanConfidence,
      accuracy,
      summary: `${base} Overall that balances out, but individual confidence levels are off in different directions — look at the curve to see where.`,
    };
  }
  return {
    verdict: 'well-calibrated',
    meanConfidence,
    accuracy,
    summary: `${base} Your confidence tracks your accuracy closely, which means others (and you) can take your "how sure" at face value.`,
  };
}
