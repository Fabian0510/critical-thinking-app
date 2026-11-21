/**
 * Validates ALL content. If you add or edit items, run `npm test`; a failure here
 * names the item id and the rule it breaks.
 */
import { describe, expect, it } from 'vitest';
import { isScored, LEVELS, type Item } from '../types/content';
import { allItems, allLevels, allScreens, getItem, PLACEMENT_ITEMS } from './index';
import { itemSchema, levelSchema } from './schema';
import { recommendations } from '../scoring/recommend';
import { bayesPosterior, expectedCounts, updateTrajectory } from '../scoring/probability';

const items = allItems();
const screenIds = new Set(allScreens().map((s) => s.id));

/** Every string in an item, for text lints. Functions are skipped. */
function texts(x: unknown): string[] {
  if (typeof x === 'string') return [x];
  if (Array.isArray(x)) return x.flatMap(texts);
  if (x && typeof x === 'object') return Object.values(x).flatMap(texts);
  return [];
}

describe('content schema', () => {
  it.each(allLevels().map((l) => [l.level, l] as const))('level %i matches the level schema', (_, level) => {
    const r = levelSchema.safeParse(level);
    expect(r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)).toEqual([]);
  });

  it.each(items.map((i) => [i.id, i] as const))('%s matches the item schema', (_, item) => {
    const r = itemSchema.safeParse(item);
    expect(r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)).toEqual([]);
  });

  it('has unique item ids', () => {
    const ids = items.map((i) => i.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it('every item points at a real lesson screen', () => {
    expect(items.filter((i) => !screenIds.has(i.lessonRef)).map((i) => i.id)).toEqual([]);
  });

  it('item level matches the level file it lives in', () => {
    for (const l of allLevels()) {
      const wrong = [...l.screens.map((s) => s.check), ...l.practice, ...l.bank].filter((i) => i.level !== l.level);
      expect(wrong.map((i) => i.id)).toEqual([]);
    }
  });
});

describe('test bank requirements', () => {
  it('has all five levels', () => {
    expect(allLevels().map((l) => l.level).sort()).toEqual([...LEVELS]);
  });

  it('level 4 bank has at least two complete paired-framing pairs (so retakes can differ)', () => {
    const l4 = allLevels().find((l) => l.level === 4)!;
    const pairs = new Set(l4.bank.filter((i) => i.type === 'paired').map((i) => (i as Extract<Item, { type: 'paired' }>).pairId));
    expect(pairs.size).toBeGreaterThanOrEqual(2);
  });

  it.each(allLevels().map((l) => [l.level, l] as const))('level %i bank has ≥12 items and ≥4 item types', (_, l) => {
    expect(l.bank.length).toBeGreaterThanOrEqual(12);
    expect(new Set(l.bank.map((i) => i.type)).size).toBeGreaterThanOrEqual(4);
  });

  it('keeps definition (recall) questions to at most 15% of scored items', () => {
    const recall = items.filter((i) => i.kind === 'recall').length;
    expect(recall / items.length).toBeLessThanOrEqual(0.15);
  });

  it('has enough non-reflection items per bank to fill a test', () => {
    for (const l of allLevels()) {
      expect(l.bank.filter((i) => i.type !== 'reflection' && i.type !== 'paired').length).toBeGreaterThanOrEqual(8);
    }
  });

  it('paired-framing items come in complete A/B pairs with matching stances', () => {
    const paired = items.filter((i): i is Extract<Item, { type: 'paired' }> => i.type === 'paired');
    const byPair = new Map<string, typeof paired>();
    for (const p of paired) byPair.set(p.pairId, [...(byPair.get(p.pairId) ?? []), p]);
    for (const [pairId, halves] of byPair) {
      expect(halves.map((h) => h.side).sort(), pairId).toEqual(['A', 'B']);
      const a = halves.find((h) => h.side === 'A')!;
      expect(a.stancePrompt, `${pairId} side A needs a stance prompt`).toBeDefined();
      const optionIds = a.stancePrompt!.options.map((o) => o.id);
      for (const h of halves) expect(optionIds, `${h.id}.supports`).toContain(h.supports);
      expect(halves[0].supports).not.toBe(halves[1].supports);
    }
  });

  it('placement has two scored items per level, in level order, none of them in a test bank', () => {
    expect(PLACEMENT_ITEMS).toHaveLength(10);
    for (const l of LEVELS) expect(PLACEMENT_ITEMS.filter((i) => i.level === l), `level ${l}`).toHaveLength(2);
    expect(PLACEMENT_ITEMS.map((i) => i.level)).toEqual([...PLACEMENT_ITEMS.map((i) => i.level)].sort());
    expect(PLACEMENT_ITEMS.filter((i) => !isScored(i)).map((i) => i.id)).toEqual([]);
    const bankIds = new Set(allLevels().flatMap((l) => l.bank.map((i) => i.id)));
    expect(PLACEMENT_ITEMS.filter((i) => bankIds.has(i.id)).map((i) => i.id)).toEqual([]);
  });
});

describe('probability content is mathematically consistent', () => {
  const numeric = items.filter((i): i is Extract<Item, { type: 'numeric' }> => i.type === 'numeric');
  const sliders = items.filter((i): i is Extract<Item, { type: 'slider' }> => i.type === 'slider');

  it.each(numeric.filter((i) => i.populationGrid).map((i) => [i.id, i] as const))(
    '%s: the answer matches its population-grid numbers',
    (_, i) => {
      const g = i.populationGrid!;
      const c = expectedCounts(g.population, g);
      if (i.unit === 'people') {
        // "How many test positive?" — must equal the positives shown in the grid.
        expect(i.answer()).toBe(c.truePositive + c.falsePositive);
        return;
      }
      expect(i.unit).toBe('percent');
      expect(i.answer()).toBeCloseTo(bayesPosterior(g) * 100, 9);
      const gridAnswer = (c.truePositive / (c.truePositive + c.falsePositive)) * 100;
      expect(Math.abs(gridAnswer - i.answer())).toBeLessThanOrEqual(i.tolerance);
    },
  );

  it.each(sliders.map((i) => [i.id, i] as const))('%s: the Bayes-correct path stays on the slider (1–99%%)', (_, i) => {
    for (const p of updateTrajectory(i.prior, i.evidence.map((e) => e.likelihoodRatio))) {
      expect(p).toBeGreaterThanOrEqual(0.01);
      expect(p).toBeLessThanOrEqual(0.99);
    }
  });

  it.each(sliders.map((i) => [i.id, i] as const))('%s: every evidence card actually moves the estimate', (_, i) => {
    for (const e of i.evidence) expect(Math.abs(Math.log(e.likelihoodRatio))).toBeGreaterThan(0.05);
  });
});

describe('content integrity lints', () => {
  // Real partisan politics and contested public-policy topics must not appear in items.
  const partisan =
    /\b(Democrats?|Republicans?|Labour Party|Conservative Party|Tory|Tories|Lib Dems?|GOP|Trump|Biden|Obama|Brexit|abortion|gun control|immigration|vaccines?|climate change|left-wing|right-wing)\b/i;
  // The only real research the app may name.
  const allowedResearchers = /\b(Kahan|Willingham|Mercier|Sperber)\b/;

  it('contains no real partisan topics', () => {
    const hits = items.flatMap((i) => texts(i).filter((t) => partisan.test(t)).map((t) => `${i.id}: ${t.slice(0, 80)}`));
    const screenHits = allScreens().flatMap((s) =>
      texts({ ...s, check: undefined }).filter((t) => partisan.test(t)).map((t) => `${s.id}: ${t.slice(0, 80)}`),
    );
    expect([...hits, ...screenHits]).toEqual([]);
  });

  it('names no real studies except the three allowed by the brief', () => {
    const suspicious = /\bet al\.?|\bjournal of\b|\bpublished in\b|\(\d{4}\)/i;
    const all = [...items.flatMap((i) => texts(i).map((t) => [i.id, t] as const)), ...allScreens().flatMap((s) => texts(s).map((t) => [s.id, t] as const))];
    const hits = all.filter(([, t]) => suspicious.test(t) && !allowedResearchers.test(t)).map(([id, t]) => `${id}: ${t.slice(0, 80)}`);
    expect(hits).toEqual([]);
  });

  it('every scenario is labelled fictional', () => {
    const bad = items.filter((i) => i.scenario && !/fictional/i.test(i.scenario.label)).map((i) => i.id);
    expect(bad).toEqual([]);
  });
});

describe('recommendations link to the right lessons', () => {
  it('overconfidence points at the calibration screen itself, not a screen that merely mentions calibration', () => {
    const attempts = Array.from({ length: 10 }, (_, i) => ({
      itemId: 'l1-b01',
      runId: `r${i}`,
      context: 'test' as const,
      ts: i,
      response: { choice: 'b' },
      score: 0,
      correct: false,
      confidence: 0.9 as const,
    }));
    const recs = recommendations({ profile: [], attempts, paired: [], screens: allScreens(), getItem });
    expect(recs[0]).toMatchObject({ title: 'Revisit: calibration', screenId: 'l4-s5' });
  });
});
