import type { Item, LevelId, PairedItem } from '../types/content';
import { shuffle, type Rng } from './rng';

type Pair = [PairedItem, PairedItem];

/** Complete A/B pairs in a list of items. */
export function findPairs(items: Item[]): Pair[] {
  const byId = new Map<string, { A?: PairedItem; B?: PairedItem }>();
  for (const it of items) {
    if (it.type !== 'paired') continue;
    const e = byId.get(it.pairId) ?? {};
    e[it.side] = it;
    byId.set(it.pairId, e);
  }
  const out: Pair[] = [];
  for (const e of byId.values()) if (e.A && e.B) out.push([e.A, e.B]);
  return out;
}

/**
 * Pick `count` items, preferring ones the learner hasn't seen, then mixing item
 * types as evenly as possible. `maxPerType` caps types such as reflection.
 */
export function pickDiverse(
  candidates: Item[],
  count: number,
  rng: Rng,
  seen: Set<string> = new Set(),
  maxPerType: Partial<Record<Item['type'], number>> = {},
  alreadyPicked: Item[] = [],
): Item[] {
  const shuffled = shuffle(candidates, rng);
  const tiers = [shuffled.filter((i) => !seen.has(i.id)), shuffled.filter((i) => seen.has(i.id))];
  const picked: Item[] = [];
  const typeCount = new Map<string, number>();
  for (const it of alreadyPicked) typeCount.set(it.type, (typeCount.get(it.type) ?? 0) + 1);
  const eligible = (i: Item) => {
    const cap = maxPerType[i.type];
    return cap === undefined || (typeCount.get(i.type) ?? 0) < cap;
  };
  for (const tier of tiers) {
    const pool = [...tier];
    while (picked.length < count) {
      const options = pool.filter(eligible);
      if (options.length === 0) break;
      const minCount = Math.min(...options.map((i) => typeCount.get(i.type) ?? 0));
      const choice = options.find((i) => (typeCount.get(i.type) ?? 0) === minCount)!;
      picked.push(choice);
      typeCount.set(choice.type, (typeCount.get(choice.type) ?? 0) + 1);
      pool.splice(pool.indexOf(choice), 1);
    }
  }
  return picked;
}

/**
 * Insert the two halves of a pair far apart: around 15% and 85% of the way through.
 * Side A always comes first, because it carries the "which side are you on?" question,
 * which must be asked before the learner sees either study.
 */
export function placePairApart(items: Item[], pair: Pair): Item[] {
  const [first, second] = pair[0].side === 'A' ? pair : [pair[1], pair[0]];
  const total = items.length + 2;
  const early = Math.max(0, Math.floor(total * 0.15));
  const late = Math.min(total - 1, Math.ceil(total * 0.85) - 1);
  const out = [...items];
  out.splice(early, 0, first);
  out.splice(late, 0, second);
  return out;
}

function choosePair(pairs: Pair[], rng: Rng, seen: Set<string>): Pair | undefined {
  if (pairs.length === 0) return undefined;
  const fresh = pairs.filter(([a, b]) => !seen.has(a.id) && !seen.has(b.id));
  const pool = fresh.length > 0 ? fresh : pairs;
  return pool[Math.floor(rng() * pool.length)];
}

export const TEST_SIZE = 8;
/** Levels whose tests include items from earlier levels. */
export const INTERLEAVE_FROM_LEVEL: LevelId = 4;
export const INTERLEAVE_COUNT = 2;

export interface LevelDrawOptions {
  bank: Item[];
  /** Banks of earlier levels, used for interleaving. */
  earlier?: Item[];
  interleave?: number;
  includePair?: boolean;
  size?: number;
  seen?: Set<string>;
  rng: Rng;
}

/**
 * Draw a level test: one paired-framing pair if requested (placed far apart),
 * at most one reflection, `interleave` items from earlier levels, the rest from
 * this level's bank — preferring unseen items and mixing item types.
 */
export function drawLevelTest(o: LevelDrawOptions): Item[] {
  const size = o.size ?? TEST_SIZE;
  const seen = o.seen ?? new Set<string>();
  const interleave = o.earlier ? (o.interleave ?? 0) : 0;
  const pair = o.includePair ? choosePair(findPairs(o.bank), o.rng, seen) : undefined;
  const ownCount = size - interleave - (pair ? 2 : 0);
  const singles = o.bank.filter((i) => i.type !== 'paired');
  const own = pickDiverse(singles, ownCount, o.rng, seen, { reflection: 1 });
  const earlierPool = (o.earlier ?? []).filter((i) => i.type !== 'paired' && i.type !== 'reflection');
  const back = pickDiverse(earlierPool, interleave, o.rng, seen);
  const body = shuffle([...own, ...back], o.rng);
  return pair ? placePairApart(body, pair) : body;
}

export const FINAL_WEIGHTS: Record<LevelId, number> = { 1: 2, 2: 3, 3: 5, 4: 5, 5: 5 };

/**
 * Draw the final assessment: items from every level weighted towards 3–5,
 * one paired-framing pair (counted in its level's share), at most 2 reflections overall.
 */
export function drawFinal(banks: Record<LevelId, Item[]>, rng: Rng, seen: Set<string> = new Set()): Item[] {
  const allPairs = ([1, 2, 3, 4, 5] as LevelId[]).flatMap((l) => findPairs(banks[l]).map((p) => ({ l, p })));
  const pairChoice = allPairs.length ? choosePair(allPairs.map((x) => x.p), rng, seen) : undefined;
  const pairLevel = pairChoice ? allPairs.find((x) => x.p === pairChoice)!.l : undefined;
  const picked: Item[] = [];
  for (const l of [1, 2, 3, 4, 5] as LevelId[]) {
    const n = FINAL_WEIGHTS[l] - (l === pairLevel ? 2 : 0);
    const singles = banks[l].filter((i) => i.type !== 'paired');
    picked.push(...pickDiverse(singles, n, rng, seen, { reflection: 2 }, picked));
  }
  const body = shuffle(picked, rng);
  return pairChoice ? placePairApart(body, pairChoice) : body;
}
