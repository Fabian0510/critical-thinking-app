/**
 * One sample item of every type, used by unit and component tests.
 * All scenarios are fictional. These are NOT part of the app's content.
 */
import type {
  GridItem,
  Item,
  MCItem,
  NumericItem,
  PairedItem,
  RankItem,
  ReflectionItem,
  SliderItem,
  TagItem,
} from './types/content';
import { bayesPosterior } from './scoring/probability';

export const sampleMC: MCItem = {
  type: 'mc',
  id: 'sample-mc',
  level: 1,
  skills: ['evidence-evaluation'],
  kind: 'application',
  lessonRef: 'sample-screen',
  scenario: { label: 'Group chat (fictional)', body: 'Sam: the Glenbrook pool is closed all week!!' },
  prompt: 'What is the best way to check?',
  options: [
    { id: 'a', text: "Look at the pool's own website", correct: true, explanation: 'Goes to the source.' },
    { id: 'b', text: 'Ask the group if they agree', correct: false, explanation: 'Agreement is not checking.' },
    { id: 'c', text: 'Believe Sam', correct: false, explanation: 'Someone said it; nobody checked.' },
  ],
};

export const sampleTag: TagItem = {
  type: 'tag',
  id: 'sample-tag',
  level: 2,
  skills: ['evidence-evaluation'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'Tag each sentence.',
  tagSet: [
    { id: 'claim', label: 'Claim', hint: 'Something asserted as true' },
    { id: 'evidence', label: 'Evidence', hint: 'Offered in support' },
  ],
  segments: [
    { id: 's1', text: 'Brightleaf tea helps you sleep.', answer: 'claim', why: 'Asserted, not shown.' },
    { id: 's2', text: 'In our trial, 40 drinkers logged their sleep.', answer: 'evidence', why: 'Offered as support.' },
  ],
};

export const sampleRank: RankItem = {
  type: 'rank',
  id: 'sample-rank',
  level: 1,
  skills: ['evidence-evaluation'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'Rank these from most to least useful.',
  entries: [
    { id: 'x', label: 'Measure it for a month', why: 'Lots of direct checks.' },
    { id: 'y', label: 'Measure it once', why: 'A direct check, but only one.' },
    { id: 'z', label: 'Hear a rumour', why: 'Nobody checked.' },
  ],
  correctOrder: ['x', 'y', 'z'],
  rationale: 'More direct checking beats less; checking beats hearsay.',
};

export const sampleGrid: GridItem = {
  type: 'grid',
  id: 'sample-grid',
  level: 3,
  skills: ['argument-structure'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'Classify this argument.',
  premises: ['All squares have four sides.', 'This shape is a square.'],
  conclusion: 'This shape has four sides.',
  answer: { valid: true, premisesTrue: true },
  cells: {
    'valid-true': 'Valid and the premises are true, so sound.',
    'valid-false': 'The premises are true.',
    'invalid-true': 'The conclusion does follow.',
    'invalid-false': 'Both are fine here.',
  },
};

const testParams = { prevalence: 0.01, sensitivity: 0.95, specificity: 0.95 };
export const sampleNumeric: NumericItem = {
  type: 'numeric',
  id: 'sample-numeric',
  level: 4,
  skills: ['probabilistic-reasoning'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'What is the chance of having the condition given a positive result?',
  answer: () => bayesPosterior(testParams) * 100,
  unit: 'percent',
  tolerance: 3,
  solution: 'Count true and false positives.',
  commonErrors: [{ value: () => 95, tolerance: 2, explanation: 'That is the accuracy, not the answer.' }],
  populationGrid: { population: 1000, ...testParams },
};

export const sampleSlider: SliderItem = {
  type: 'slider',
  id: 'sample-slider',
  level: 4,
  skills: ['probabilistic-reasoning'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'Update your estimate as each card appears.',
  hypothesis: 'The Fernhill bakery van comes on Tuesdays.',
  prior: 0.5,
  evidence: [
    { id: 'e1', text: 'A neighbour saw it on a Tuesday.', likelihoodRatio: 3, why: 'Moderate support.' },
    { id: 'e2', text: 'The van timetable lists Thursdays only.', likelihoodRatio: 0.2, why: 'Strong evidence against.' },
  ],
};

export const samplePairA: PairedItem = {
  type: 'paired',
  id: 'sample-pair-a',
  level: 4,
  skills: ['bias-awareness'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'How strong is this evidence for its conclusion?',
  pairId: 'sample-pair',
  side: 'A',
  stancePrompt: {
    question: 'Should Millbrook build the bypass?',
    options: [
      { id: 'for', text: 'For' },
      { id: 'against', text: 'Against' },
    ],
  },
  supports: 'for',
  study: { label: 'Study summary (fictional)', body: 'A survey of 200 residents found the bypass would cut traffic.' },
};

export const samplePairB: PairedItem = {
  ...samplePairA,
  id: 'sample-pair-b',
  side: 'B',
  stancePrompt: undefined,
  supports: 'against',
  study: { label: 'Study summary (fictional)', body: 'A survey of 200 residents found the bypass would not cut traffic.' },
};

export const sampleReflection: ReflectionItem = {
  type: 'reflection',
  id: 'sample-reflection',
  level: 2,
  skills: ['bias-awareness'],
  kind: 'application',
  lessonRef: 'sample-screen',
  prompt: 'What evidence would change your mind?',
  modelAnswers: ['A fair comparison showing the opposite.', 'Records from an independent source.'],
  rubric: ['Names specific evidence', 'The evidence could actually be found'],
};

export const allSamples: Item[] = [
  sampleMC,
  sampleTag,
  sampleRank,
  sampleGrid,
  sampleNumeric,
  sampleSlider,
  samplePairA,
  samplePairB,
  sampleReflection,
];

export const sampleGetItem = (id: string) => allSamples.find((i) => i.id === id);
