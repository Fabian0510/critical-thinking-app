import type { Item, PairedItem } from '../types/content';
import type { Attempt, PairedResponse } from '../types/progress';

/** A rating gap of this many points (on a 1–7 scale) or more counts as a double standard. */
export const INCONSISTENCY_GAP = 2;

export interface PairedResult {
  pairId: string;
  runId: string;
  itemA: PairedItem;
  itemB: PairedItem;
  ratingA: number;
  ratingB: number;
  gap: number;
  inconsistent: boolean;
  /** The stance the learner said they favoured, if asked. */
  stance?: string;
  /**
   * true if the study supporting the learner's favoured side got the higher rating,
   * false if the opposite, undefined if no stance or equal ratings.
   */
  favouredOwnSide?: boolean;
}

/** Find completed pairs (both halves answered in the same run) and measure the rating gap. */
export function pairedResults(attempts: Attempt[], getItem: (id: string) => Item | undefined): PairedResult[] {
  const byKey = new Map<string, { A?: [PairedItem, PairedResponse]; B?: [PairedItem, PairedResponse] }>();
  for (const a of attempts) {
    const item = getItem(a.itemId);
    if (!item || item.type !== 'paired') continue;
    const key = `${a.runId}::${item.pairId}`;
    const entry = byKey.get(key) ?? {};
    entry[item.side] = [item, a.response as PairedResponse];
    byKey.set(key, entry);
  }
  const out: PairedResult[] = [];
  for (const [key, e] of byKey) {
    if (!e.A || !e.B) continue;
    const [itemA, rA] = e.A;
    const [itemB, rB] = e.B;
    const gap = Math.abs(rA.rating - rB.rating);
    const stance = rA.stance ?? rB.stance;
    let favouredOwnSide: boolean | undefined;
    if (stance && rA.rating !== rB.rating) {
      const higher = rA.rating > rB.rating ? itemA : itemB;
      favouredOwnSide = higher.supports === stance;
    }
    out.push({
      pairId: itemA.pairId,
      runId: key.split('::')[0],
      itemA,
      itemB,
      ratingA: rA.rating,
      ratingB: rB.rating,
      gap,
      inconsistent: gap >= INCONSISTENCY_GAP,
      stance,
      favouredOwnSide,
    });
  }
  return out;
}
