import type {
  GridItem,
  Item,
  MCItem,
  NumericItem,
  RankItem,
  SliderItem,
  TagItem,
} from '../types/content';
import type {
  GridResponse,
  ItemResponse,
  McResponse,
  NumericResponse,
  RankResponse,
  SliderResponse,
  TagResponse,
} from '../types/progress';
import { oddsUpdate } from './probability';

/** Partial-credit items count as "correct" (for calibration) at or above this score. */
export const CORRECT_THRESHOLD = 0.7;

export interface ItemScore {
  /** 0–1, or null when the item is not right/wrong. */
  score: number | null;
  correct: boolean | null;
}

const unscored: ItemScore = { score: null, correct: null };

function fromScore(score: number): ItemScore {
  return { score, correct: score >= CORRECT_THRESHOLD - 1e-9 };
}

export function scoreMC(item: MCItem, r: McResponse): ItemScore {
  const chosen = item.options.find((o) => o.id === r.choice);
  return fromScore(chosen?.correct ? 1 : 0);
}

/** Fraction of segments tagged correctly. */
export function scoreTag(item: TagItem, r: TagResponse): ItemScore {
  const right = item.segments.filter((s) => r.tags[s.id] === s.answer).length;
  return fromScore(right / item.segments.length);
}

/**
 * Kendall tau between the learner's order and the correct order, in [-1, 1].
 * 1 = identical, -1 = reversed.
 */
export function kendallTau(order: string[], correct: string[]): number {
  const pos = new Map(order.map((id, i) => [id, i]));
  let concordant = 0;
  let discordant = 0;
  for (let i = 0; i < correct.length; i++) {
    for (let j = i + 1; j < correct.length; j++) {
      const a = pos.get(correct[i]);
      const b = pos.get(correct[j]);
      if (a === undefined || b === undefined) {
        discordant++;
        continue;
      }
      if (a < b) concordant++;
      else discordant++;
    }
  }
  const pairs = concordant + discordant;
  return pairs === 0 ? 1 : (concordant - discordant) / pairs;
}

/** Score = max(0, tau): one adjacent swap among 5 entries still scores 0.8; random order scores ~0. */
export function scoreRank(item: RankItem, r: RankResponse): ItemScore {
  return fromScore(Math.max(0, kendallTau(r.order, item.correctOrder)));
}

/** Half credit for each axis; only "correct" if both are right. */
export function scoreGrid(item: GridItem, r: GridResponse): ItemScore {
  const v = r.valid === item.answer.valid ? 0.5 : 0;
  const t = r.premisesTrue === item.answer.premisesTrue ? 0.5 : 0;
  return { score: v + t, correct: v + t === 1 };
}

export function scoreNumeric(item: NumericItem, r: NumericResponse): ItemScore {
  if (!Number.isFinite(r.value)) return { score: 0, correct: false };
  const diff = Math.abs(r.value - item.answer());
  if (diff <= item.tolerance + 1e-9) return { score: 1, correct: true };
  if (diff <= 2 * item.tolerance + 1e-9) return { score: 0.5, correct: false };
  return { score: 0, correct: false };
}

/** Likelihood ratios this close to 1 count as "no real change expected". */
const NEUTRAL_LR_BAND = 1.25;
/** A change of at most this much counts as "held steady". */
const STEADY_BAND = 0.05;

export interface SliderStep {
  from: number;
  to: number;
  /** Where Bayes' rule would put you, starting from YOUR previous estimate. */
  target: number;
  directionOk: boolean;
  magnitude: 1 | 0.5 | 0;
  score: number;
}

/**
 * Score each update on direction and rough size. The target for each step is
 * computed from the learner's own previous estimate, so an early mistake isn't
 * punished again at every later step.
 */
export function sliderSteps(item: SliderItem, r: SliderResponse): SliderStep[] {
  const steps: SliderStep[] = [];
  let prev = item.prior;
  item.evidence.forEach((card, i) => {
    const to = r.estimates[i] ?? prev;
    const target = oddsUpdate(prev, card.likelihoodRatio);
    const delta = to - prev;
    let directionOk: boolean;
    if (card.likelihoodRatio >= NEUTRAL_LR_BAND) directionOk = delta > 0;
    else if (card.likelihoodRatio <= 1 / NEUTRAL_LR_BAND) directionOk = delta < 0;
    else directionOk = Math.abs(delta) <= STEADY_BAND;
    const err = Math.abs(to - target);
    const magnitude: 1 | 0.5 | 0 = err <= 0.12 ? 1 : err <= 0.25 ? 0.5 : 0;
    steps.push({ from: prev, to, target, directionOk, magnitude, score: (directionOk ? 0.5 : 0) + magnitude * 0.5 });
    prev = to;
  });
  return steps;
}

export function scoreSlider(item: SliderItem, r: SliderResponse): ItemScore {
  const steps = sliderSteps(item, r);
  return fromScore(steps.reduce((s, x) => s + x.score, 0) / steps.length);
}

export function scoreItem(item: Item, response: ItemResponse): ItemScore {
  switch (item.type) {
    case 'mc':
      return scoreMC(item, response as McResponse);
    case 'tag':
      return scoreTag(item, response as TagResponse);
    case 'rank':
      return scoreRank(item, response as RankResponse);
    case 'grid':
      return scoreGrid(item, response as GridResponse);
    case 'numeric':
      return scoreNumeric(item, response as NumericResponse);
    case 'slider':
      return scoreSlider(item, response as SliderResponse);
    case 'paired':
    case 'reflection':
      return unscored;
  }
}

/** Mean score over the scored items of a run. Unscored items are ignored. */
export function runScore(scores: (number | null)[]): number {
  const s = scores.filter((x): x is number => x !== null);
  return s.length === 0 ? 0 : s.reduce((a, b) => a + b, 0) / s.length;
}

export const PASS_MARK = 0.7;
