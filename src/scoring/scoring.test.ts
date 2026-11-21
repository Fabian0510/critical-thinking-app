import { describe, expect, it } from 'vitest';
import {
  allSamples,
  sampleGetItem,
  sampleGrid,
  sampleMC,
  sampleNumeric,
  samplePairA,
  samplePairB,
  sampleRank,
  sampleSlider,
  sampleTag,
} from '../test-fixtures';
import type { Item, LevelId, PairedItem } from '../types/content';
import type { Attempt } from '../types/progress';
import {
  brierScore,
  calibrationBuckets,
  calibrationVerdict,
  describeBucket,
  expectedCalibrationError,
} from './calibration';
import { drawFinal, drawLevelTest, findPairs, pickDiverse } from './draw';
import { pairedResults } from './paired';
import { recommendLevel } from './placement';
import { bayesPosterior, bayesPosteriorNegative, expectedCounts, oddsUpdate, updateTrajectory } from './probability';
import { seededRng } from './rng';
import { kendallTau, runScore, scoreItem, sliderSteps } from './scoreItem';
import { skillProfile } from './skills';

const attempt = (over: Partial<Attempt>): Attempt => ({
  itemId: 'sample-mc',
  runId: 'r1',
  context: 'test',
  ts: 0,
  response: { choice: 'a' },
  score: 1,
  correct: true,
  ...over,
});

describe('probability', () => {
  it('solves the classic rare-condition test (1% prevalence, 95% sensitivity and specificity)', () => {
    // 1000 people: 10 sick → 9.5 true positives; 990 healthy → 49.5 false positives. 9.5 / 59 ≈ 16.1%.
    expect(bayesPosterior({ prevalence: 0.01, sensitivity: 0.95, specificity: 0.95 })).toBeCloseTo(9.5 / 59, 10);
  });
  it('computes the negative-result posterior', () => {
    expect(bayesPosteriorNegative({ prevalence: 0.01, sensitivity: 0.95, specificity: 0.95 })).toBeCloseTo(0.5 / 941, 10);
  });
  it('keeps population counts whole and summing to the population', () => {
    const c = expectedCounts(1000, { prevalence: 0.01, sensitivity: 0.95, specificity: 0.95 });
    expect(c.truePositive + c.falseNegative + c.falsePositive + c.trueNegative).toBe(1000);
    expect(c.truePositive + c.falseNegative).toBe(10);
    expect(Number.isInteger(c.falsePositive)).toBe(true);
  });
  it('updates odds by a likelihood ratio', () => {
    expect(oddsUpdate(0.5, 3)).toBeCloseTo(0.75);
    expect(oddsUpdate(0.5, 1)).toBeCloseTo(0.5);
    expect(oddsUpdate(0.2, 4)).toBeCloseTo(0.5);
    expect(updateTrajectory(0.5, [3, 1 / 3])).toEqual([expect.closeTo(0.75), expect.closeTo(0.5)]);
  });
});

describe('scoreItem', () => {
  it('scores multiple choice', () => {
    expect(scoreItem(sampleMC, { choice: 'a' })).toEqual({ score: 1, correct: true });
    expect(scoreItem(sampleMC, { choice: 'b' })).toEqual({ score: 0, correct: false });
  });
  it('gives partial credit for tagging', () => {
    expect(scoreItem(sampleTag, { tags: { s1: 'claim', s2: 'evidence' } })).toEqual({ score: 1, correct: true });
    expect(scoreItem(sampleTag, { tags: { s1: 'claim', s2: 'claim' } })).toEqual({ score: 0.5, correct: false });
  });
  it('scores ranking with Kendall tau', () => {
    expect(kendallTau(['x', 'y', 'z'], ['x', 'y', 'z'])).toBe(1);
    expect(kendallTau(['z', 'y', 'x'], ['x', 'y', 'z'])).toBe(-1);
    expect(scoreItem(sampleRank, { order: ['z', 'y', 'x'] }).score).toBe(0);
    expect(scoreItem(sampleRank, { order: ['y', 'x', 'z'] }).score).toBeCloseTo(1 / 3);
    // One adjacent swap among five entries: 9 of 10 pairs concordant → tau 0.8 → counted correct.
    expect(kendallTau(['a', 'b', 'c', 'e', 'd'], ['a', 'b', 'c', 'd', 'e'])).toBeCloseTo(0.8);
  });
  it('scores the validity/soundness grid per axis', () => {
    expect(scoreItem(sampleGrid, { valid: true, premisesTrue: true })).toEqual({ score: 1, correct: true });
    expect(scoreItem(sampleGrid, { valid: true, premisesTrue: false })).toEqual({ score: 0.5, correct: false });
    expect(scoreItem(sampleGrid, { valid: false, premisesTrue: false })).toEqual({ score: 0, correct: false });
  });
  it('accepts numeric answers within tolerance and gives half credit within double', () => {
    const ans = sampleNumeric.answer(); // ≈ 16.1
    expect(scoreItem(sampleNumeric, { value: ans + 2.9 })).toEqual({ score: 1, correct: true });
    expect(scoreItem(sampleNumeric, { value: ans + 5 })).toEqual({ score: 0.5, correct: false });
    expect(scoreItem(sampleNumeric, { value: 95 })).toEqual({ score: 0, correct: false });
    expect(scoreItem(sampleNumeric, { value: NaN })).toEqual({ score: 0, correct: false });
  });
  it('scores slider updates on direction and rough size, relative to the learner’s own previous estimate', () => {
    // Ideal: 0.5 → 0.75 → 0.375
    expect(scoreItem(sampleSlider, { estimates: [0.75, 0.375] })).toEqual({ score: 1, correct: true });
    // Right direction, too timid: 0.5 → 0.55 (target .75, err .2 → half) → 0.5 (target from .55 is ~.196, err .3 → 0)
    const steps = sliderSteps(sampleSlider, { estimates: [0.55, 0.5] });
    expect(steps.map((s) => s.directionOk)).toEqual([true, true]);
    expect(steps.map((s) => s.magnitude)).toEqual([0.5, 0]);
    // Wrong direction on both
    expect(scoreItem(sampleSlider, { estimates: [0.3, 0.6] }).score).toBe(0);
  });
  it('does not score reflection or paired items', () => {
    expect(scoreItem(samplePairA, { rating: 5 })).toEqual({ score: null, correct: null });
    expect(runScore([1, null, 0.5])).toBe(0.75);
  });
});

describe('calibration', () => {
  it('computes the Brier score', () => {
    expect(brierScore([])).toBeNull();
    expect(brierScore([{ confidence: 0.9, correct: true }])).toBeCloseTo(0.01);
    expect(
      brierScore([
        { confidence: 0.9, correct: true },
        { confidence: 0.9, correct: false },
      ]),
    ).toBeCloseTo(0.41);
    expect(brierScore([{ confidence: 0.5, correct: false }])).toBeCloseTo(0.25);
  });
  it('buckets by stated confidence and describes buckets in plain language', () => {
    const pts = [
      ...Array.from({ length: 7 }, () => ({ confidence: 0.9, correct: true })),
      ...Array.from({ length: 4 }, () => ({ confidence: 0.9, correct: false })),
      { confidence: 0.6, correct: true },
    ];
    const b = calibrationBuckets(pts);
    expect(b).toHaveLength(6);
    const ninety = b.find((x) => x.confidence === 0.9)!;
    expect(ninety).toEqual({ confidence: 0.9, n: 11, accuracy: 7 / 11 });
    expect(describeBucket(ninety)).toBe('When you said 90% sure, you were right 64% of the time (11 answers).');
    expect(describeBucket(b.find((x) => x.confidence === 0.5)!)).toBeNull();
    expect(expectedCalibrationError(b)).toBeCloseTo((11 / 12) * Math.abs(0.9 - 7 / 11) + (1 / 12) * 0.4);
  });
  it('gives a verdict only with enough data', () => {
    expect(calibrationVerdict([{ confidence: 0.9, correct: true }]).verdict).toBe('too-few');
    const over = Array.from({ length: 10 }, (_, i) => ({ confidence: 0.9, correct: i < 5 }));
    expect(calibrationVerdict(over).verdict).toBe('overconfident');
    const under = Array.from({ length: 10 }, () => ({ confidence: 0.6, correct: true }));
    expect(calibrationVerdict(under).verdict).toBe('underconfident');
    const good = Array.from({ length: 10 }, (_, i) => ({ confidence: 0.7, correct: i < 7 }));
    expect(calibrationVerdict(good).verdict).toBe('well-calibrated');
  });
});

describe('skillProfile', () => {
  it('averages measured attempts per skill and ignores practice', () => {
    const p = skillProfile(
      [
        attempt({ itemId: 'sample-mc', score: 1 }),
        attempt({ itemId: 'sample-rank', score: 0 }),
        attempt({ itemId: 'sample-mc', score: 0, context: 'practice' }),
        attempt({ itemId: 'sample-reflection', score: null, correct: null }),
      ],
      sampleGetItem,
    );
    const ev = p.find((s) => s.skill === 'evidence-evaluation')!;
    expect(ev).toEqual({ skill: 'evidence-evaluation', n: 2, mean: 0.5 });
    expect(p.find((s) => s.skill === 'bias-awareness')!.mean).toBeNull();
  });
  it('folds calibration quality into the calibration skill once there is enough data', () => {
    const atts = Array.from({ length: 10 }, (_, i) => attempt({ confidence: 0.9, correct: i < 9, score: i < 9 ? 1 : 0 }));
    const cal = skillProfile(atts, sampleGetItem).find((s) => s.skill === 'calibration')!;
    expect(cal.n).toBe(1);
    expect(cal.mean).toBeCloseTo(1);
  });
});

describe('pairedResults', () => {
  it('reveals a double standard and whether it favoured the learner’s side', () => {
    const r = pairedResults(
      [
        attempt({ itemId: samplePairA.id, response: { rating: 6, stance: 'for' }, score: null, correct: null }),
        attempt({ itemId: samplePairB.id, response: { rating: 3 }, score: null, correct: null }),
        attempt({ itemId: samplePairA.id, runId: 'other', response: { rating: 4 }, score: null, correct: null }),
      ],
      sampleGetItem,
    );
    expect(r).toHaveLength(1); // the half-pair in run "other" is ignored
    expect(r[0]).toMatchObject({ gap: 3, inconsistent: true, stance: 'for', favouredOwnSide: true });
  });
  it('treats close ratings as consistent', () => {
    const r = pairedResults(
      [
        attempt({ itemId: samplePairA.id, response: { rating: 5 }, score: null, correct: null }),
        attempt({ itemId: samplePairB.id, response: { rating: 4 }, score: null, correct: null }),
      ],
      sampleGetItem,
    );
    expect(r[0].inconsistent).toBe(false);
  });
});

// ---- drawing tests ----
function fakeBank(level: LevelId, n: number, types: Item['type'][] = ['mc', 'tag', 'rank', 'reflection']): Item[] {
  return Array.from({ length: n }, (_, i) => {
    const t = types[i % types.length];
    const base = allSamples.find((s) => s.type === t)!;
    return { ...base, id: `l${level}-b${String(i).padStart(2, '0')}`, level } as Item;
  });
}
function fakePair(level: LevelId, pairId: string): PairedItem[] {
  return [
    { ...samplePairA, id: `${pairId}-a`, pairId, level },
    { ...samplePairB, id: `${pairId}-b`, pairId, level },
  ];
}

describe('drawLevelTest', () => {
  it('draws 8 distinct items with mixed types and at most one reflection', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const t = drawLevelTest({ bank: fakeBank(1, 14), rng: seededRng(seed) });
      expect(t).toHaveLength(8);
      expect(new Set(t.map((i) => i.id)).size).toBe(8);
      expect(t.filter((i) => i.type === 'reflection').length).toBeLessThanOrEqual(1);
      expect(new Set(t.map((i) => i.type)).size).toBeGreaterThanOrEqual(3);
    }
  });
  it('prefers unseen items on a retake', () => {
    const bank = fakeBank(2, 16);
    const first = drawLevelTest({ bank, rng: seededRng(1) });
    const second = drawLevelTest({ bank, rng: seededRng(2), seen: new Set(first.map((i) => i.id)) });
    const overlap = second.filter((i) => first.some((f) => f.id === i.id));
    // 16 items, 8 seen: 8 unseen, but only 1 reflection allowed, so at most a little overlap.
    expect(overlap.length).toBeLessThanOrEqual(2);
  });
  it('interleaves 2 earlier-level items, never paired or reflection', () => {
    const earlier = [...fakeBank(1, 14), ...fakeBank(2, 14)];
    for (let seed = 1; seed <= 20; seed++) {
      const t = drawLevelTest({ bank: fakeBank(4, 14), earlier, interleave: 2, rng: seededRng(seed) });
      const back = t.filter((i) => i.level < 4);
      expect(back).toHaveLength(2);
      expect(back.every((i) => i.type !== 'reflection' && i.type !== 'paired')).toBe(true);
    }
  });
  it('places both halves of a pair in the same test, far apart', () => {
    const bank = [...fakeBank(4, 12), ...fakePair(4, 'p1'), ...fakePair(4, 'p2')];
    for (let seed = 1; seed <= 30; seed++) {
      const t = drawLevelTest({ bank, includePair: true, rng: seededRng(seed), earlier: fakeBank(1, 14), interleave: 2 });
      expect(t).toHaveLength(8);
      const idx = t.map((x, i) => (x.type === 'paired' ? i : -1)).filter((i) => i >= 0);
      expect(idx).toHaveLength(2);
      const [a, b] = idx.map((i) => t[i] as PairedItem);
      expect(a.pairId).toBe(b.pairId);
      expect(a.side).toBe('A'); // the stance question comes before either study
      expect(idx[1] - idx[0]).toBeGreaterThanOrEqual(4);
    }
  });
  it('finds only complete pairs', () => {
    expect(findPairs([...fakePair(4, 'p1'), fakePair(4, 'p2')[0]])).toHaveLength(1);
  });
  it('pickDiverse respects type caps', () => {
    const picked = pickDiverse(fakeBank(1, 12, ['reflection', 'mc']), 8, seededRng(3), new Set(), { reflection: 1 });
    expect(picked.filter((i) => i.type === 'reflection')).toHaveLength(1);
    expect(picked).toHaveLength(7); // only 6 mc + 1 reflection available
  });
});

describe('drawFinal', () => {
  it('draws 20 items weighted to levels 3–5, with one pair', () => {
    const banks = {
      1: fakeBank(1, 14),
      2: fakeBank(2, 14),
      3: fakeBank(3, 14),
      4: [...fakeBank(4, 12), ...fakePair(4, 'p1')],
      5: fakeBank(5, 14),
    } as Record<LevelId, Item[]>;
    const t = drawFinal(banks, seededRng(7));
    expect(t).toHaveLength(20);
    expect(new Set(t.map((i) => i.id)).size).toBe(20);
    expect(t.filter((i) => i.level >= 3).length).toBe(15);
    expect(t.filter((i) => i.type === 'paired')).toHaveLength(2);
    expect(t.filter((i) => i.type === 'reflection').length).toBeLessThanOrEqual(2);
  });
});

describe('recommendLevel', () => {
  const items: Item[] = ([1, 2, 3, 4, 5] as LevelId[]).flatMap((l) => [
    { ...sampleMC, id: `pl-${l}a`, level: l },
    { ...sampleMC, id: `pl-${l}b`, level: l },
  ]);
  const get = (id: string) => items.find((i) => i.id === id);
  const answers = (right: string[]) =>
    items.map((i) => attempt({ itemId: i.id, score: right.includes(i.id) ? 1 : 0, context: 'placement' }));
  it('starts at Level 1 when Level 1 is missed', () => {
    expect(recommendLevel(answers([]), get).recommended).toBe(1);
  });
  it('walks up while levels are cleared', () => {
    expect(recommendLevel(answers(['pl-1a', 'pl-1b', 'pl-2a', 'pl-2b', 'pl-4a', 'pl-4b']), get).recommended).toBe(3);
  });
  it('requires both items at a level (0.5 < 0.75)', () => {
    expect(recommendLevel(answers(['pl-1a', 'pl-1b', 'pl-2a']), get).recommended).toBe(2);
  });
  it('caps at Level 5', () => {
    expect(recommendLevel(answers(items.map((i) => i.id)), get).recommended).toBe(5);
  });
});
