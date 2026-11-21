/**
 * Placement check: 10 items, two per level, in level order. They are NOT in any
 * level's test bank, so taking the placement check never uses up test questions.
 * All scenarios are fictional. Every item is scored (no reflection or paired items),
 * because the placement recommendation is computed from scores.
 */
import type { Item, TagItem } from '../types/content';
import { bayesPosterior, expectedCounts, round, type TestParams } from '../scoring/probability';

const saidChecked: TagItem['tagSet'] = [
  { id: 'said', label: 'Someone said it', hint: 'A person told, wrote or posted it — we don’t see how they know.' },
  { id: 'checked', label: 'Someone checked it', hint: 'A person looked, counted, measured or tested — and we can see how.' },
];

const fourTags: TagItem['tagSet'] = [
  { id: 'claim', label: 'Claim', hint: 'Stated as a fact about how things are — but no support is given here.' },
  { id: 'evidence', label: 'Evidence', hint: 'Offered as support, and you could check it: a measurement, a record, a described test.' },
  { id: 'opinion', label: 'Opinion', hint: 'A judgement of taste or value — best, ugly, worth it, should.' },
  { id: 'appeal', label: 'Emotional appeal', hint: 'Aims at your feelings — fear, guilt, excitement, fitting in — instead of giving a reason.' },
];

const SCREEN: TestParams = { prevalence: 0.05, sensitivity: 0.9, specificity: 0.9 };
const k = expectedCounts(1000, SCREEN);
const answerPct = bayesPosterior(SCREEN) * 100;

export const placementItems: Item[] = [
  // ---------------------------------------------------------------- Level 1
  {
    id: 'pl-01',
    type: 'mc',
    level: 1,
    skills: ['evidence-evaluation', 'trust-calibration'],
    kind: 'application',
    lessonRef: 'l1-s3',
    scenario: {
      label: 'Messages (fictional)',
      body: 'A notice at the (made-up) Kelby bus stop says the number 42 bus won’t run tomorrow. Your friend messages: “Nah, my mum says it’s running as normal.”',
    },
    prompt: 'What is the best way to find out?',
    options: [
      {
        id: 'a',
        text: 'Check the bus company’s own website or travel updates for tomorrow.',
        correct: true,
        explanation: 'The bus company decides whether the bus runs, so it’s the source. Both the notice and your friend’s mum are reports of what it decided.',
      },
      {
        id: 'b',
        text: 'Believe the notice, because it’s written down.',
        correct: false,
        explanation: 'Tempting — notices are often right. But written isn’t the same as checked, and notices can be out of date.',
      },
      {
        id: 'c',
        text: 'Believe your friend’s mum, because she takes that bus every day.',
        correct: false,
        explanation: 'Taking the bus every day doesn’t mean she knows about tomorrow’s change.',
      },
      {
        id: 'd',
        text: 'Ask a few more friends what they think.',
        correct: false,
        explanation: 'More guesses aren’t a check. None of them decides the timetable.',
      },
    ],
  },
  {
    id: 'pl-02',
    type: 'tag',
    level: 1,
    skills: ['evidence-evaluation'],
    kind: 'application',
    lessonRef: 'l1-s2',
    scenario: { label: 'Club noticeboard (fictional)', body: 'Notes about the Dunmore swimming club’s new training plan.' },
    prompt: 'For each sentence, decide: is it something someone said, or something someone checked?',
    tagSet: saidChecked,
    segments: [
      { id: 's1', text: 'The coach says the new plan is making everyone faster.', answer: 'said', why: 'The coach’s view, with no sign of how it was checked.' },
      {
        id: 's2',
        text: 'We timed every swimmer over 50 metres in September and again in December; 14 of the 18 were faster.',
        answer: 'checked',
        why: 'Measured, twice, with the result given.',
      },
      { id: 's3', text: 'Lots of parents agree it’s working.', answer: 'said', why: 'Agreement is lots of people saying, not checking.' },
    ],
  },

  // ---------------------------------------------------------------- Level 2
  {
    id: 'pl-03',
    type: 'tag',
    level: 2,
    skills: ['evidence-evaluation'],
    kind: 'application',
    lessonRef: 'l2-s2',
    scenario: { label: 'Advert (fictional)', body: 'An advert for the Stridewell walking app.' },
    prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
    tagSet: fourTags,
    segments: [
      { id: 's1', text: 'Stridewell gets people walking more.', answer: 'claim', why: 'A checkable statement with no support given.' },
      {
        id: 's2',
        text: 'In a three-month trial, 200 users’ phone step counts rose by an average of 1,100 steps a day, compared with 200 people using a basic step counter.',
        answer: 'evidence',
        why: 'A described test with a comparison group and a measured result.',
      },
      { id: 's3', text: 'It’s the most beautiful app on your phone.', answer: 'opinion', why: 'Taste.' },
      { id: 's4', text: 'Don’t let another year slip by on the sofa.', answer: 'appeal', why: 'Works on guilt, not reasons.' },
    ],
  },
  {
    id: 'pl-04',
    type: 'mc',
    level: 2,
    skills: ['source-incentives'],
    kind: 'application',
    lessonRef: 'l2-s3',
    scenario: {
      label: 'News snippet (fictional)',
      body: 'A report saying that school uniforms improve pupils’ concentration was paid for by Uniformly, a company that makes school uniforms.',
    },
    prompt: 'What is the most sensible response?',
    options: [
      {
        id: 'a',
        text: 'Note the incentive, look at how the report was done, and see whether independent research agrees.',
        correct: true,
        explanation: 'The company gains if people believe the report. That calls for checking, not automatic rejection.',
      },
      {
        id: 'b',
        text: 'Ignore it — a uniform company would say that.',
        correct: false,
        explanation: 'Tempting, but an incentive doesn’t make a finding false. It means you want independent support.',
      },
      {
        id: 'c',
        text: 'Accept it — it’s a report, so it counts as evidence.',
        correct: false,
        explanation: 'It’s evidence of some kind, but who paid for it and how it was done both matter.',
      },
      {
        id: 'd',
        text: 'Ask whether you liked wearing a uniform at school.',
        correct: false,
        explanation: 'Your own experience can’t settle whether uniforms change concentration in general.',
      },
    ],
  },

  // ---------------------------------------------------------------- Level 3
  {
    id: 'pl-05',
    type: 'grid',
    level: 3,
    skills: ['argument-structure'],
    kind: 'application',
    lessonRef: 'l3-s2',
    prompt: 'Is this argument valid? Are its premises true?',
    premises: ['Some birds cannot fly.', 'Penguins are birds.'],
    conclusion: 'So penguins cannot fly.',
    answer: { valid: false, premisesTrue: true },
    cells: {
      'valid-true': 'Very tempting — everything here is true, including the conclusion. But “some birds can’t fly” doesn’t tell you which ones; the same shape would “prove” that robins can’t fly.',
      'valid-false': 'Both premises are true, and the conclusion doesn’t follow.',
      'invalid-true': 'Right. The premises and conclusion are all true, but the conclusion doesn’t follow from the premises.',
      'invalid-false': 'Invalid, yes — but both premises are true.',
    },
  },
  {
    id: 'pl-06',
    type: 'mc',
    level: 3,
    skills: ['fallacy-detection', 'alternative-explanations'],
    kind: 'application',
    lessonRef: 'l3-s3',
    scenario: {
      label: 'Magazine article (fictional)',
      body: '“Households in the (made-up) county of Brenshire that own a piano have children with better exam results. If you want your children to do well, buy a piano.”',
    },
    prompt: 'What is the main problem with this reasoning?',
    options: [
      {
        id: 'a',
        text: 'It assumes that because pianos and good results go together, the piano causes the results.',
        correct: true,
        explanation: 'Families who can afford pianos probably differ in many ways — income, time, books at home — that could explain the results.',
      },
      {
        id: 'b',
        text: 'It attacks people who don’t own pianos.',
        correct: false,
        explanation: 'Nobody is attacked; the problem is the leap from association to cause.',
      },
      {
        id: 'c',
        text: 'It offers only two options.',
        correct: false,
        explanation: 'There’s no either-or framing here.',
      },
      {
        id: 'd',
        text: 'Nothing — the pattern was found across a whole county.',
        correct: false,
        explanation: 'Tempting, since it isn’t a tiny sample. But a big sample doesn’t turn a correlation into a cause.',
      },
    ],
  },

  // ---------------------------------------------------------------- Level 4
  {
    id: 'pl-07',
    type: 'numeric',
    level: 4,
    skills: ['probabilistic-reasoning'],
    kind: 'application',
    lessonRef: 'l4-s2',
    scenario: {
      label: 'Fact sheet (fictional)',
      body: 'A (made-up) eye-screening test spots 90% of people who have Dellow’s condition (invented) and correctly clears 90% of people who don’t. About 5 in every 100 people have Dellow’s condition.',
    },
    prompt: 'Someone picked at random tests positive. What is the chance they actually have the condition? Give a percentage.',
    answer: () => answerPct,
    unit: 'percent',
    tolerance: 3,
    solution: `In 1,000 people: ${k.truePositive + k.falseNegative} have it and ${k.truePositive} test positive. Of the ${k.falsePositive + k.trueNegative} who don’t, 10% — ${k.falsePositive} — test positive anyway. So ${k.truePositive} of ${k.truePositive + k.falsePositive} positives have it: ${round(answerPct, 1)}%.`,
    commonErrors: [
      { value: () => 90, tolerance: 2, explanation: '90% is how often the test catches people who have the condition — the reverse of what was asked.' },
      { value: () => SCREEN.prevalence * 100, tolerance: 1, explanation: '5% is the base rate before testing. A positive result should raise it.' },
    ],
    populationGrid: { population: 1000, ...SCREEN },
  },
  {
    id: 'pl-08',
    type: 'mc',
    level: 4,
    skills: ['bias-awareness'],
    kind: 'application',
    lessonRef: 'l4-s4',
    scenario: {
      label: 'Group chat (fictional)',
      body: 'Sol is a big fan of the (made-up) Rookwood Rangers. When a fan survey of 40 people rated Rookwood’s stadium the best in the league, he shared it everywhere. When a similar survey of 40 people rated it the worst, he said: “40 people? That proves nothing.”',
    },
    prompt: 'What is the best description of Sol’s reasoning?',
    options: [
      {
        id: 'a',
        text: 'A double standard: he applies a sample-size objection only to the result he dislikes.',
        correct: true,
        explanation: 'The surveys are the same size. If 40 people proves nothing now, it proved nothing before.',
      },
      {
        id: 'b',
        text: 'Reasonable — 40 people really is a small sample.',
        correct: false,
        explanation: 'Tempting, because the objection itself is fair. The problem is that he only raises it in one direction.',
      },
      {
        id: 'c',
        text: 'Loyalty, which doesn’t affect reasoning.',
        correct: false,
        explanation: 'Loyalty is exactly what tends to make us judge evidence by its conclusion.',
      },
      {
        id: 'd',
        text: 'Ad hominem.',
        correct: false,
        explanation: 'He doesn’t attack anyone personally.',
      },
    ],
  },

  // ---------------------------------------------------------------- Level 5
  {
    id: 'pl-09',
    type: 'rank',
    level: 5,
    skills: ['trust-calibration'],
    kind: 'application',
    lessonRef: 'l5-s2',
    prompt:
      'Is the old oak tree in the (made-up) Harrowgate school playground at risk of falling? Rank these sources, most trustworthy for this question first.',
    entries: [
      {
        id: 'arborist',
        label: 'An independent tree surgeon who inspects the tree in person, paid a flat fee',
        why: 'Right expertise, a direct inspection, and no stake in the answer.',
      },
      {
        id: 'survey',
        label: 'The council’s tree survey from six years ago, which rated it healthy',
        why: 'Expert and checked, but out of date for a living tree.',
      },
      {
        id: 'firm',
        label: 'A tree-felling company that offers a free look and a quote',
        why: 'May know trees well, but earns money if it recommends felling.',
      },
      {
        id: 'parent',
        label: 'A parent who says “it’s been there for a hundred years, it’s fine”',
        why: 'Age alone tells you little about current risk; no inspection.',
      },
    ],
    correctOrder: ['arborist', 'survey', 'firm', 'parent'],
    rationale:
      'Current, independent, expert inspection beats an old survey; an old expert survey beats an expert with an incentive; and a reassuring generalisation is weakest.',
  },
  {
    id: 'pl-10',
    type: 'mc',
    level: 5,
    skills: ['trust-calibration', 'bias-awareness'],
    kind: 'application',
    lessonRef: 'l5-s5',
    scenario: {
      label: 'Scenario (fictional)',
      body: 'A single unreviewed paper from the (made-up) Marlow Institute claims a common garden plant cures headaches. You have no background in medicine or chemistry.',
    },
    prompt: 'What is the most sensible position?',
    options: [
      {
        id: 'a',
        text: 'You can’t judge the chemistry yourself; wait to see whether independent experts check it and others can repeat it.',
        correct: true,
        explanation: 'One unreviewed paper, no replication, and no way for you to assess the content: “not yet known” is the honest position.',
      },
      {
        id: 'b',
        text: 'Read the paper and decide for yourself.',
        correct: false,
        explanation: 'Tempting — it feels like critical thinking. But without background knowledge, your judgement of the method isn’t reliable.',
      },
      {
        id: 'c',
        text: 'Dismiss it — claims like this are always wrong.',
        correct: false,
        explanation: 'Blanket dismissal is as unsupported as blanket acceptance.',
      },
      {
        id: 'd',
        text: 'Believe it — it’s from an institute.',
        correct: false,
        explanation: 'An institutional name isn’t a check. Independent review and replication are.',
      },
    ],
  },
];
