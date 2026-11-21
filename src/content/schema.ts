/**
 * Runtime schemas for content. They mirror `src/types/content.ts` and add the
 * rules a type can't express (exactly one correct option, answers in range, etc.).
 * `content.test.ts` runs every lesson check, practice item and bank item through these.
 */
import { z } from 'zod';
import { SKILLS } from '../types/content';

const nonEmpty = z.string().trim().min(1);
const fn = z.custom<() => number>((v) => typeof v === 'function', { message: 'must be a function that computes the answer' });

const scenario = z.object({
  label: nonEmpty.refine((s) => /fictional/i.test(s), { message: 'scenario label must say the scenario is fictional' }),
  title: z.string().optional(),
  body: nonEmpty,
});

const base = {
  id: z.string().regex(/^[a-z0-9-]+$/, 'ids are lowercase letters, digits and dashes'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  skills: z.array(z.enum(SKILLS)).min(1),
  kind: z.enum(['application', 'recall']),
  scenario: scenario.optional(),
  prompt: nonEmpty,
  lessonRef: nonEmpty,
};

const mc = z
  .object({
    ...base,
    type: z.literal('mc'),
    options: z.array(z.object({ id: nonEmpty, text: nonEmpty, correct: z.boolean(), explanation: nonEmpty })).min(3),
  })
  .refine((i) => i.options.filter((o) => o.correct).length === 1, { message: 'exactly one option must be correct' })
  .refine((i) => new Set(i.options.map((o) => o.id)).size === i.options.length, { message: 'option ids must be unique' });

const tag = z
  .object({
    ...base,
    type: z.literal('tag'),
    tagSet: z.array(z.object({ id: nonEmpty, label: nonEmpty, hint: nonEmpty })).min(2),
    segments: z.array(z.object({ id: nonEmpty, text: nonEmpty, answer: nonEmpty, why: nonEmpty })).min(3),
  })
  .refine((i) => i.segments.every((s) => i.tagSet.some((t) => t.id === s.answer)), {
    message: 'every segment answer must be one of the tagSet ids',
  })
  .refine((i) => new Set(i.segments.map((s) => s.answer)).size >= 2, { message: 'use at least two different tags' });

const rank = z
  .object({
    ...base,
    type: z.literal('rank'),
    entries: z.array(z.object({ id: nonEmpty, label: nonEmpty, detail: z.string().optional(), why: nonEmpty })).min(3).max(6),
    correctOrder: z.array(nonEmpty),
    rationale: nonEmpty,
  })
  .refine(
    (i) =>
      i.correctOrder.length === i.entries.length &&
      new Set(i.correctOrder).size === i.entries.length &&
      i.entries.every((e) => i.correctOrder.includes(e.id)),
    { message: 'correctOrder must list every entry id exactly once' },
  );

const cellText = nonEmpty;
const grid = z.object({
  ...base,
  type: z.literal('grid'),
  premises: z.array(nonEmpty).min(1),
  conclusion: nonEmpty,
  answer: z.object({ valid: z.boolean(), premisesTrue: z.boolean() }),
  cells: z.object({ 'valid-true': cellText, 'valid-false': cellText, 'invalid-true': cellText, 'invalid-false': cellText }),
});

const numeric = z
  .object({
    ...base,
    type: z.literal('numeric'),
    answer: fn,
    unit: z.enum(['percent', 'people', 'number']),
    tolerance: z.number().positive(),
    solution: nonEmpty,
    commonErrors: z.array(z.object({ value: fn, tolerance: z.number().positive(), explanation: nonEmpty })).optional(),
    populationGrid: z
      .object({
        population: z.number().int().positive(),
        prevalence: z.number().gt(0).lt(1),
        sensitivity: z.number().gt(0).lte(1),
        specificity: z.number().gt(0).lte(1),
      })
      .optional(),
  })
  .refine((i) => Number.isFinite(i.answer()), { message: 'answer() must return a finite number' })
  .refine((i) => i.unit !== 'percent' || (i.answer() >= 0 && i.answer() <= 100), { message: 'percent answers must be 0–100' })
  .refine(
    (i) => (i.commonErrors ?? []).every((e) => Math.abs(e.value() - i.answer()) > i.tolerance + e.tolerance),
    { message: 'a common-error value overlaps the accepted range' },
  );

const slider = z.object({
  ...base,
  type: z.literal('slider'),
  hypothesis: nonEmpty,
  prior: z.number().gt(0).lt(1),
  evidence: z.array(z.object({ id: nonEmpty, text: nonEmpty, likelihoodRatio: z.number().positive(), why: nonEmpty })).min(2),
});

const paired = z.object({
  ...base,
  type: z.literal('paired'),
  pairId: nonEmpty,
  side: z.enum(['A', 'B']),
  stancePrompt: z.object({ question: nonEmpty, options: z.array(z.object({ id: nonEmpty, text: nonEmpty })).min(2) }).optional(),
  supports: nonEmpty,
  study: scenario,
});

const reflection = z.object({
  ...base,
  type: z.literal('reflection'),
  modelAnswers: z.array(nonEmpty).min(2).max(3),
  rubric: z.array(nonEmpty).min(2),
});

export const itemSchema = z.discriminatedUnion('type', [mc, tag, rank, grid, numeric, slider, paired, reflection]);

const visual = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('population-grid'),
    population: z.number().int().positive(),
    prevalence: z.number(),
    sensitivity: z.number(),
    specificity: z.number(),
  }),
  z.object({ kind: z.literal('validity-grid') }),
  z.object({
    kind: z.literal('probability-slider'),
    hypothesis: nonEmpty,
    prior: z.number().gt(0).lt(1),
    steps: z.array(z.object({ text: nonEmpty, likelihoodRatio: z.number().positive() })).min(1),
  }),
  z.object({ kind: z.literal('calibration-demo') }),
  z.object({ kind: z.literal('arc'), highlight: z.number().int().min(1).max(5) }),
]);

export const screenSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  body: z.array(nonEmpty).min(1).max(5),
  example: z.object({ title: nonEmpty, body: z.array(nonEmpty).min(1) }),
  visual: visual.optional(),
  skills: z.array(z.enum(SKILLS)).min(1),
  check: itemSchema,
});

export const levelSchema = z.object({
  level: base.level,
  title: nonEmpty,
  arcStep: nonEmpty,
  audience: nonEmpty,
  coreIdea: nonEmpty,
  screens: z.array(screenSchema).min(3),
  practice: z.array(itemSchema).min(3),
  bank: z.array(itemSchema).min(12),
});

