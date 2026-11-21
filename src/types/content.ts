/**
 * Content types for lessons and test items.
 *
 * Every lesson screen, practice item and test item in `src/content/` must match
 * these types. `src/content/schema.ts` mirrors them as runtime (zod) schemas and
 * `src/content/content.test.ts` validates every item against them.
 */

export const SKILLS = [
  'evidence-evaluation',
  'source-incentives',
  'argument-structure',
  'fallacy-detection',
  'alternative-explanations',
  'probabilistic-reasoning',
  'bias-awareness',
  'calibration',
  'trust-calibration',
] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, string> = {
  'evidence-evaluation': 'Evaluating evidence',
  'source-incentives': 'Spotting incentives',
  'argument-structure': 'Argument structure',
  'fallacy-detection': 'Spotting fallacies',
  'alternative-explanations': 'Alternative explanations',
  'probabilistic-reasoning': 'Probabilistic reasoning',
  'bias-awareness': 'Bias awareness',
  calibration: 'Calibration',
  'trust-calibration': 'Knowing whom to trust',
};

export const LEVELS = [1, 2, 3, 4, 5] as const;
export type LevelId = (typeof LEVELS)[number];

/** Confidence the learner states that their answer is right. */
export const CONFIDENCES = [0.5, 0.6, 0.7, 0.8, 0.9, 0.99] as const;
export type Confidence = (typeof CONFIDENCES)[number];

/** A realistic (and always fictional) piece of text the item is about. */
export interface Scenario {
  /** What kind of text this is, e.g. "Group chat (fictional)". Must say it is fictional. */
  label: string;
  title?: string;
  /** Paragraphs separated by a blank line. `**bold**` is supported. */
  body: string;
}

interface ItemBase {
  /** Unique across all content. Convention: l1-b01 (bank), l1-p01 (practice), l1-c01 (lesson check), pl-01 (placement). */
  id: string;
  level: LevelId;
  skills: Skill[];
  /** 'recall' = a straight definition question. Capped at ~15% of all items. */
  kind: 'application' | 'recall';
  scenario?: Scenario;
  prompt: string;
  /** Id of the lesson screen that teaches this, used for recommendations. */
  lessonRef: string;
}

/** Multiple choice, exactly one correct option, every option explained. */
export interface MCItem extends ItemBase {
  type: 'mc';
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

/** Assign a label to each pre-cut segment of a passage. */
export interface TagItem extends ItemBase {
  type: 'tag';
  tagSet: { id: string; label: string; hint: string }[];
  segments: { id: string; text: string; answer: string; why: string }[];
}

/** Put entries in order, best first. */
export interface RankItem extends ItemBase {
  type: 'rank';
  entries: { id: string; label: string; detail?: string; why: string }[];
  /** Entry ids, best first. */
  correctOrder: string[];
  rationale: string;
}

export type GridCell = 'valid-true' | 'valid-false' | 'invalid-true' | 'invalid-false';

/** Classify an argument: does the conclusion follow (valid)? are the premises true? Sound = both. */
export interface GridItem extends ItemBase {
  type: 'grid';
  premises: string[];
  conclusion: string;
  answer: { valid: boolean; premisesTrue: boolean };
  /** One explanation per cell, including why each wrong cell is tempting. */
  cells: Record<GridCell, string>;
}

/** Numeric estimate. The answer is COMPUTED in code, never typed in by hand. */
export interface NumericItem extends ItemBase {
  type: 'numeric';
  /** Returns the correct answer in display units (e.g. percent 0–100). */
  answer: () => number;
  unit: 'percent' | 'people' | 'number';
  /** Absolute tolerance in display units. */
  tolerance: number;
  solution: string;
  /** Answers people commonly give, with targeted feedback. */
  commonErrors?: { value: () => number; tolerance: number; explanation: string }[];
  /** If present, the feedback shows a population grid of these numbers. */
  populationGrid?: { population: number; prevalence: number; sensitivity: number; specificity: number };
}

/** Update a probability as evidence cards are revealed one by one. */
export interface SliderItem extends ItemBase {
  type: 'slider';
  hypothesis: string;
  /** Starting probability, 0–1. */
  prior: number;
  evidence: {
    id: string;
    text: string;
    /** P(evidence | hypothesis) / P(evidence | not hypothesis). >1 supports, <1 undermines. */
    likelihoodRatio: number;
    why: string;
  }[];
}

/**
 * One half of a double-standard pair. The two halves are near-identical studies
 * whose only difference is which conclusion they support. Not scored as right/wrong;
 * the gap between the learner's two ratings is revealed at the end of the test.
 */
export interface PairedItem extends ItemBase {
  type: 'paired';
  pairId: string;
  side: 'A' | 'B';
  /** Asked (on side A only) before the study, to learn which side the learner favours. */
  stancePrompt?: { question: string; options: { id: string; text: string }[] };
  /** Which stance option this study's conclusion supports. */
  supports: string;
  study: Scenario;
}

/** Free text; not auto-graded. Learner self-assesses against a rubric. */
export interface ReflectionItem extends ItemBase {
  type: 'reflection';
  modelAnswers: string[];
  rubric: string[];
}

export type Item = MCItem | TagItem | RankItem | GridItem | NumericItem | SliderItem | PairedItem | ReflectionItem;
export type ItemType = Item['type'];

/** Items whose answers are right or wrong (and so take a confidence rating). */
export function isScored(item: Item): boolean {
  return item.type !== 'paired' && item.type !== 'reflection';
}

export type Visual =
  | { kind: 'population-grid'; population: number; prevalence: number; sensitivity: number; specificity: number }
  | { kind: 'validity-grid' }
  /** A worked (ungraded) walk through evidence cards, showing the Bayes-correct probability after each. */
  | { kind: 'probability-slider'; hypothesis: string; prior: number; steps: { text: string; likelihoodRatio: number }[] }
  /** Shows the learner's own calibration so far (or an illustration if there isn't enough data yet). */
  | { kind: 'calibration-demo' }
  | { kind: 'arc'; highlight: LevelId };

export interface LessonScreen {
  id: string;
  title: string;
  /** Paragraphs. Keep it short — one idea per screen. */
  body: string[];
  example: { title: string; body: string[] };
  visual?: Visual;
  skills: Skill[];
  /** A quick check the learner answers before moving on. */
  check: Item;
}

export interface LevelContent {
  level: LevelId;
  title: string;
  /** Where this level sits on the arc. */
  arcStep: string;
  audience: string;
  coreIdea: string;
  screens: LessonScreen[];
  practice: Item[];
  bank: Item[];
}
