/**
 * Level 4 — "Your own mind is the adversary"
 * Audience: graduate students. All people, places, organisations, products and studies are invented,
 * except the one description of Kahan et al.'s "motivated numeracy" research, kept to the level of
 * detail in the brief.
 *
 * Every probability in this file is COMPUTED (see `scoring/probability.ts`), including the numbers
 * quoted in worked examples, so text and answers can't drift apart.
 */
import type { LevelContent, PairedItem, SliderItem } from '../types/content';
import { bayesPosterior, expectedCounts, round, updateTrajectory, type TestParams } from '../scoring/probability';

const pct = (p: number, dp = 1) => `${round(p * 100, dp)}%`;

/* ------------------------------------------------------------------ base-rate parameter sets */

/** Worked example: a 95%-accurate test for a condition 1 in 50 people have. Counts are exact in 1,000 people. */
const EXAMPLE: TestParams = { prevalence: 0.02, sensitivity: 0.95, specificity: 0.95 };
const EX = expectedCounts(1000, EXAMPLE);

/** The brief's own example: 95%-accurate test, condition 1 in 100. Counts are exact in 2,000 people. */
const RARE: TestParams = { prevalence: 0.01, sensitivity: 0.95, specificity: 0.95 };
const CHECK: TestParams = { prevalence: 0.02, sensitivity: 0.9, specificity: 0.95 };
const ALLERGY: TestParams = { prevalence: 0.04, sensitivity: 0.9, specificity: 0.85 };
const DOG: TestParams = { prevalence: 0.005, sensitivity: 0.8, specificity: 0.98 };
const FACTORY: TestParams = { prevalence: 0.05, sensitivity: 0.8, specificity: 0.9 };
const SPAM: TestParams = { prevalence: 0.3, sensitivity: 0.95, specificity: 0.9 };
const COUNT: TestParams = { prevalence: 0.02, sensitivity: 0.9, specificity: 0.95 };
const COUNTED = expectedCounts(1000, COUNT);

/** "In 1,000 people: 20 have it and 18 test positive. Of the 980 who don’t, 5% — 49 — …" with every number computed. */
function counts(population: number, p: TestParams) {
  const c = expectedCounts(population, p);
  return {
    pop: population.toLocaleString('en-GB'),
    has: c.truePositive + c.falseNegative,
    tp: c.truePositive,
    not: (c.falsePositive + c.trueNegative).toLocaleString('en-GB'),
    fpRate: `${round((1 - p.specificity) * 100, 1)}%`,
    fp: c.falsePositive,
    pos: c.truePositive + c.falsePositive,
    post: pct(bayesPosterior(p)),
  };
}
const kCheck = counts(1000, CHECK);
const kAllergy = counts(1000, ALLERGY);
const kRare = counts(2000, RARE);
const kDog = counts(1000, DOG);
const kFactory = counts(1000, FACTORY);
const kSpam = counts(1000, SPAM);
const kCount = counts(1000, COUNT);
/** Oat-milk walkthrough, computed. */
const OAT = { prior: 1 / 3, lrs: [3, 0.25, 4] };
const oatPath = updateTrajectory(OAT.prior, OAT.lrs).map((x) => pct(x, 0));

/* ------------------------------------------------------------------ evidence cards */

/**
 * An evidence card whose likelihood ratio is computed from the two frequencies quoted in its text,
 * so the wording and the maths always agree. `ifTrue`/`ifFalse` are "about a in n" pairs.
 */
function card(
  id: string,
  text: string,
  ifTrue: [number, number],
  ifFalse: [number, number],
  why: string,
): SliderItem['evidence'][number] {
  const freq = ([a, n]: [number, number]) => `about ${a} in ${n}`;
  return {
    id,
    text: `${text} *If the idea is true, you’d see this ${freq(ifTrue)} times; if it’s false, ${freq(ifFalse)}.*`,
    likelihoodRatio: ifTrue[0] / ifTrue[1] / (ifFalse[0] / ifFalse[1]),
    why,
  };
}

/* ------------------------------------------------------------------ paired-framing helpers */

function pair(
  pairId: string,
  lessonRef: string,
  stancePrompt: NonNullable<PairedItem['stancePrompt']>,
  a: { id: string; supports: string; title?: string; body: string },
  b: { id: string; supports: string; title?: string; body: string },
): [PairedItem, PairedItem] {
  const common = {
    type: 'paired' as const,
    level: 4 as const,
    skills: ['bias-awareness' as const],
    kind: 'application' as const,
    lessonRef,
    prompt: 'Read the study summary, then rate how strongly it supports its conclusion. Judge the method, not whether you like the result.',
    pairId,
  };
  return [
    { ...common, id: a.id, side: 'A', stancePrompt, supports: a.supports, study: { label: 'Study summary (fictional)', title: a.title, body: a.body } },
    { ...common, id: b.id, side: 'B', supports: b.supports, study: { label: 'Study summary (fictional)', title: b.title, body: b.body } },
  ];
}

const [floodA, floodB] = pair(
  'floodlights',
  'l4-s4',
  {
    question:
      'Kestrel Park (a made-up park) wants floodlights so its football pitches can be used on winter evenings. Some neighbours object. Before you see any evidence: which way do you lean?',
    options: [
      { id: 'for', text: 'Put the floodlights in' },
      { id: 'against', text: 'Don’t put them in' },
    ],
  },
  {
    id: 'l4-p01',
    supports: 'for',
    title: 'Neighbours’ views on floodlights',
    body: 'The park trust posted a survey through the doors of the 120 households within half a mile of the pitches; 64 replied. Of those who replied, 70% said evening light from the pitches would not bother them.\n\nThe trust concludes that floodlights would cause little disturbance to neighbours.',
  },
  {
    id: 'l4-p05',
    supports: 'against',
    title: 'Neighbours’ views on floodlights',
    body: 'A neighbours’ group posted a survey through the doors of the 120 households within half a mile of the pitches; 64 replied. Of those who replied, 70% said evening light from the pitches would bother them.\n\nThe group concludes that floodlights would cause significant disturbance to neighbours.',
  },
);

const [bypassA, bypassB] = pair(
  'bypass',
  'l4-s4',
  {
    question:
      'The (made-up) town of Millbrook is debating a bypass road to take through-traffic out of its centre. It would cost a lot and run across farmland. Before you see any evidence: which way do you lean?',
    options: [
      { id: 'for', text: 'Build the bypass' },
      { id: 'against', text: 'Don’t build it' },
    ],
  },
  {
    id: 'l4-b01',
    supports: 'for',
    title: 'Would a bypass cut traffic in Millbrook?',
    body: 'Researchers compared Millbrook with Ashcombe, a similar-sized town nearby that opened a bypass four years ago. They counted vehicles in each town centre on 10 weekdays in March.\n\nAshcombe’s centre had 31% fewer vehicles than Millbrook’s. The researchers conclude that a bypass would substantially reduce traffic in Millbrook’s centre.',
  },
  {
    id: 'l4-b02',
    supports: 'against',
    title: 'Would a bypass cut traffic in Millbrook?',
    body: 'Researchers compared Millbrook with Dunford, a similar-sized town nearby that opened a bypass four years ago. They counted vehicles in each town centre on 10 weekdays in March.\n\nDunford’s centre had only 3% fewer vehicles than Millbrook’s. The researchers conclude that a bypass would make little difference to traffic in Millbrook’s centre.',
  },
);

const [dietA, dietB] = pair(
  'dawnfast',
  'l4-s4',
  {
    question:
      '“Dawnfast” is a (made-up) diet trend: eat nothing before noon. Fans say it sharpens your morning focus. Before you see any evidence: what’s your gut reaction?',
    options: [
      { id: 'works', text: 'Sounds like it could work' },
      { id: 'nonsense', text: 'Sounds like nonsense' },
    ],
  },
  {
    id: 'l4-b03',
    supports: 'works',
    title: 'Dawnfast and morning concentration',
    body: 'A university team recruited 48 office workers. By coin toss, 24 followed Dawnfast for four weeks and 24 ate breakfast as usual. At the end, everyone took a 20-minute concentration test at 11am.\n\nThe Dawnfast group scored 8% higher on average. The team concludes that Dawnfast improves morning concentration.',
  },
  {
    id: 'l4-b04',
    supports: 'nonsense',
    title: 'Dawnfast and morning concentration',
    body: 'A university team recruited 48 office workers. By coin toss, 24 followed Dawnfast for four weeks and 24 ate breakfast as usual. At the end, everyone took a 20-minute concentration test at 11am.\n\nThe breakfast group scored 8% higher on average. The team concludes that Dawnfast harms morning concentration.',
  },
);

/* ------------------------------------------------------------------ content */

export const level4: LevelContent = {
  level: 4,
  title: 'Your own mind is the adversary',
  arcStep: 'Distrusting your own mind',
  audience: 'Graduate student',
  coreIdea:
    'The biggest threat isn’t other people’s bad arguments but your own biases. Intelligence doesn’t protect you. The remedy is procedural: think in probabilities, check base rates, update in proportion to evidence, and track your calibration.',

  screens: [
    {
      id: 'l4-s1',
      title: 'Your mind is already on a side',
      skills: ['bias-awareness'],
      visual: { kind: 'arc', highlight: 4 },
      body: [
        'Levels 1–3 pointed outwards: other people’s claims and arguments. This level points inwards. **Confirmation bias** is the habit of noticing and remembering what fits what you already think. **Motivated reasoning** is judging evidence by whether you like its conclusion. And many questions trigger a fast **gut answer** when they need slow, deliberate thought.',
        'Being clever doesn’t protect you. Research on “motivated numeracy” (Kahan et al.) found that people with stronger maths skills interpreted data more accurately on neutral topics — but on politically charged ones, those skills mostly helped them argue for their own side.',
        'So the remedy isn’t “try harder” or “be smarter”. It’s procedures that work even when your judgement is pulling one way: think in probabilities, check base rates, update in proportion to the evidence, and keep score of how often you’re right.',
      ],
      example: {
        title: 'Worked example: the analyst who wanted a result',
        body: [
          'Farah, a data analyst at a (made-up) firm, Corvel, championed a new sign-up page. The first week’s numbers show sign-ups up 4%. She’s delighted — and starts writing it up.',
          'Then she applies a procedure: *would I accept this evidence if it pointed the other way?* If sign-ups had fallen 4% in one week, she’d have said “one week is noise; wait for more data”. So one week isn’t enough in this direction either.',
          'She runs it for a month, comparing against the old page shown to a random half of visitors. Her skill with numbers didn’t protect her; the procedure did.',
        ],
      },
      check: {
        id: 'l4-c01',
        type: 'mc',
        level: 4,
        skills: ['bias-awareness'],
        kind: 'application',
        lessonRef: 'l4-s1',
        scenario: {
          label: 'Workplace scenario (fictional)',
          body: 'Dana is an excellent statistician and a keen supporter of a plan for her town, Millbrook, to build a bypass. She’s been asked to analyse traffic data for the council report.',
        },
        prompt: 'What is the best safeguard against motivated reasoning in her analysis?',
        options: [
          {
            id: 'a',
            text: 'Write down, before looking at the data, what results would count against the bypass — and have someone who opposes it check her analysis.',
            correct: true,
            explanation:
              'Committing in advance stops her from moving the goalposts after seeing the result, and someone with the opposite lean will spot the places she was kind to her own side.',
          },
          {
            id: 'b',
            text: 'Rely on her statistical skill — someone that good with numbers will read the data correctly.',
            correct: false,
            explanation:
              'Very tempting. But the motivated-numeracy research suggests skill can make things worse on a charged question: it gives you better tools for arguing your side.',
          },
          {
            id: 'c',
            text: 'Try hard to be objective while she works.',
            correct: false,
            explanation: 'Good intentions help a little, but biases mostly operate without our noticing. A procedure works even when you don’t notice the pull.',
          },
          {
            id: 'd',
            text: 'Hand the analysis to someone who has no opinion at all.',
            correct: false,
            explanation:
              'Not bad, but it’s often impossible to find someone with no lean, and they may have other biases. Pre-committing and adversarial checking work even when everyone has a view.',
          },
        ],
      },
    },
    {
      id: 'l4-s2',
      title: 'Check the base rate first',
      skills: ['probabilistic-reasoning'],
      visual: { kind: 'population-grid', population: 1000, ...EXAMPLE },
      body: [
        'A test that is “95% accurate” sounds as if a positive result means you’re 95% likely to have the condition. Usually it doesn’t. The missing ingredient is the **base rate**: how common the condition is to begin with.',
        'When something is rare, most people don’t have it — so even a small false-positive rate, applied to all those people, produces lots of false alarms. They can outnumber the true positives.',
        'The reliable method is to stop thinking in percentages and **count people**. Imagine 1,000 people, work out how many have it, how many of those test positive, how many of the rest test positive anyway, and compare.',
      ],
      example: {
        title: `Worked example: a 95%-accurate test, a 1-in-50 condition`,
        body: [
          `A (made-up) screening test catches 95% of people who have a condition, and correctly clears 95% of people who don’t. The condition affects 1 person in 50. You test positive. How worried should you be?`,
          `Count 1,000 people. **${EX.truePositive + EX.falseNegative}** have the condition; the test catches **${EX.truePositive}** of them. **${EX.falsePositive + EX.trueNegative}** don’t have it, but 5% of them — **${EX.falsePositive}** — test positive anyway.`,
          `So ${EX.truePositive + EX.falsePositive} people test positive, and only ${EX.truePositive} of them have the condition: **${pct(bayesPosterior(EXAMPLE))}**, not 95%. The grid below shows the same 1,000 people.`,
        ],
      },
      check: {
        id: 'l4-c02',
        type: 'numeric',
        level: 4,
        skills: ['probabilistic-reasoning'],
        kind: 'application',
        lessonRef: 'l4-s2',
        scenario: {
          label: 'Clinic leaflet (fictional)',
          body: 'The (made-up) Quillon screening test detects 90% of people who have Merrow syndrome (an invented condition) and correctly gives a negative result to 95% of people who don’t have it. About 2 in every 100 people have Merrow syndrome.',
        },
        prompt: 'Someone picked at random tests positive. What is the chance they actually have Merrow syndrome? Give a percentage.',
        answer: () => bayesPosterior(CHECK) * 100,
        unit: 'percent',
        tolerance: 3,
        solution: `In ${kCheck.pop} people: ${kCheck.has} have it and the test catches ${kCheck.tp}. Of the ${kCheck.not} who don’t, ${kCheck.fpRate} — ${kCheck.fp} — test positive anyway. So ${kCheck.tp} of the ${kCheck.pos} positives have it: about ${kCheck.post}.`,
        commonErrors: [
          { value: () => 90, tolerance: 2, explanation: '90% is how often the test catches people who *have* it — the chance of a positive given the condition, not the condition given a positive.' },
          { value: () => 95, tolerance: 2, explanation: '95% is the specificity — how often people *without* it get a negative. It doesn’t answer this question.' },
          { value: () => CHECK.prevalence * 100, tolerance: 0.5, explanation: '2% is the base rate before any test. A positive result should raise that — just much less than 90%.' },
        ],
        populationGrid: { population: 1000, ...CHECK },
      },
    },
    {
      id: 'l4-s3',
      title: 'Update in proportion to the evidence',
      skills: ['probabilistic-reasoning', 'calibration'],
      visual: {
        kind: 'probability-slider',
        hypothesis: 'It was your housemate Jess (not one of the other two housemates) who finished the oat milk.',
        prior: OAT.prior,
        steps: [
          { text: 'The empty carton is in the recycling bin by Jess’s room.', likelihoodRatio: OAT.lrs[0] },
          { text: 'Jess says she was out all morning, and her bus ticket backs that up.', likelihoodRatio: OAT.lrs[1] },
          { text: 'There’s an oat-milk latte cup on Jess’s desk.', likelihoodRatio: OAT.lrs[2] },
        ],
      },
      body: [
        'Evidence rarely settles a question in one go. Each piece should move your confidence **up or down by an amount that matches how strong it is** — not all the way to certainty, and not nowhere.',
        'The useful question for any piece of evidence: **how much more likely am I to see this if the idea is true than if it’s false?** If it’s 3 times as likely, it’s moderate support. If it’s about equally likely either way, it’s barely evidence at all, however vivid it feels.',
        'Two common errors: ignoring evidence that cuts against you, and lurching to certainty on the latest thing you heard. The walkthrough below shows a sensible path.',
      ],
      example: {
        title: 'Worked example: who finished the oat milk?',
        body: [
          `Three housemates, so before any evidence it’s 1 in 3 (${pct(OAT.prior, 0)}) that it was Jess. Evidence that would be 3 times as likely if it were Jess moves that to ${oatPath[0]} — not to certainty. A good alibi (4 times as likely if it *wasn’t* her) pulls it back down to about ${oatPath[1]}. A latte cup on her desk pushes it up again, to about ${oatPath[2]}.`,
          'Notice the size of each move depends on the strength of the evidence, and that one piece of evidence never decides everything. Step through it below.',
        ],
      },
      check: {
        id: 'l4-c03',
        type: 'slider',
        level: 4,
        skills: ['probabilistic-reasoning'],
        kind: 'application',
        lessonRef: 'l4-s3',
        prompt: 'Move the slider after each piece of evidence to show how likely the idea now is.',
        hypothesis: 'Your new (made-up) Lumo smart plug is faulty — rather than the problem being your Wi-Fi.',
        prior: 0.5,
        evidence: [
          card(
            'e1',
            'The plug drops offline at exactly the moments your laptop loses Wi-Fi too.',
            [1, 5],
            [4, 5],
            `This fits the Wi-Fi explanation much better: four times as likely if the Wi-Fi is the problem. Your estimate should fall a good way — from ${pct(0.5, 0)} to ${pct(updateTrajectory(0.5, [1 / 5 / (4 / 5)])[0], 0)} — but not to zero.`,
          ),
          card(
            'e2',
            'You put a second plug of the same model in the same socket, and it stays connected all week.',
            [9, 10],
            [1, 10],
            `Strong evidence for the faulty plug: if the Wi-Fi were the problem, the second plug would probably drop out too. Nine times as likely if the first plug is faulty, so the estimate should rise steeply (to about ${pct(updateTrajectory(0.5, [1 / 5 / (4 / 5), 9 / 10 / (1 / 10)])[1], 0)}) — even after the first clue pointed the other way.`,
          ),
        ],
      },
    },
    {
      id: 'l4-s4',
      title: 'The double-standard test',
      skills: ['bias-awareness'],
      body: [
        'Motivated reasoning rarely feels like bias. It feels like being appropriately sceptical — of evidence you dislike — and appropriately open-minded about evidence you like.',
        'The test: **imagine the same evidence pointed the other way.** Same study design, same sample, opposite result. Would you rate it the same? If you’d pick holes in one and wave the other through, the holes weren’t really your reason.',
        'Some questions in this level’s practice and test are built to catch exactly this. You’ll rate two near-identical studies at different points; how consistent you were is revealed at the end.',
      ],
      example: {
        title: 'Worked example: the referee study',
        body: [
          'Rhys supports Ironbridge United (a made-up club). A fan blog analyses 12 matches and finds referees gave Ironbridge fewer free kicks than their opponents. Rhys shares it: “The stats prove it.”',
          'A month later, another blog analyses 12 matches and finds referees *favoured* Ironbridge. Rhys: “Twelve matches is nothing. Meaningless.”',
          'He’s right that twelve matches is a small sample — but it was just as small the first time. Applying the swap test before sharing would have caught it.',
        ],
      },
      check: {
        id: 'l4-c04',
        type: 'mc',
        level: 4,
        skills: ['bias-awareness'],
        kind: 'application',
        lessonRef: 'l4-s4',
        scenario: {
          label: 'Group chat (fictional)',
          body: 'Neema loves her (made-up) Fernhill running club and dislikes the rival Oakvale club. A friend shares a survey of 30 runners saying Oakvale has the friendlier coaches. Neema replies: “30 people? Who ran it? Probably Oakvale’s mates.”',
        },
        prompt: 'What would most clearly show whether Neema’s scepticism is fair or a double standard?',
        options: [
          {
            id: 'a',
            text: 'Asking whether she’d raise the same objections to an identical survey that found Fernhill friendlier.',
            correct: true,
            explanation:
              'Her questions (sample size, who ran it) are good ones. The test is whether she applies them to both sides. If she’d accept the reverse result without question, it’s a double standard.',
          },
          {
            id: 'b',
            text: 'Checking whether 30 people really is too small a sample.',
            correct: false,
            explanation:
              'Worth knowing, but it doesn’t answer the question asked. Her objection could be valid *and* applied selectively.',
          },
          {
            id: 'c',
            text: 'Asking whether she’s a member of Fernhill.',
            correct: false,
            explanation: 'We already know she is. Having a side doesn’t make someone wrong; applying standards unevenly does.',
          },
          {
            id: 'd',
            text: 'Finding out whether Oakvale’s coaches really are friendlier.',
            correct: false,
            explanation: 'Tempting, because it’s the underlying question. But Neema could turn out right about the coaches and still be reasoning with a double standard.',
          },
        ],
      },
    },
    {
      id: 'l4-s5',
      title: 'Calibration: how sure should you be?',
      skills: ['calibration'],
      visual: { kind: 'calibration-demo' },
      body: [
        'Being right matters. So does knowing *how likely* you are to be right. You’re **well calibrated** if, of all the times you say “90% sure”, you’re right about 90% of the time.',
        'Most people are overconfident: their 90%s come true much less than 90% of the time. The fix isn’t to say 50% about everything — it’s to keep score. Every confidence rating you’ve given in this app has been recorded; your curve is below (or an illustration, if you haven’t answered enough yet).',
        'The **Brier score** combines accuracy and calibration into one number: the average squared gap between your confidence and what happened. 0 is perfect; always saying 50% gets 0.25. Lower is better.',
      ],
      example: {
        title: 'Worked example: reading a calibration curve',
        body: [
          'The diagonal line is perfect calibration. A point **below** the line means you were right less often than you said (overconfident). A point **above** it means you were right more often (underconfident).',
          'If, at 90%, you were right only 65% of the time, the lesson is concrete: next time you feel 90% sure, say 70% — or look for the thing you might be missing.',
        ],
      },
      check: {
        id: 'l4-c05',
        type: 'mc',
        level: 4,
        skills: ['calibration'],
        kind: 'application',
        lessonRef: 'l4-s5',
        prompt: `Kai answered 60 quiz questions. On the 20 where he said “90% sure”, he got 13 right (${pct(13 / 20, 0)}). On the 20 where he said “60% sure”, he got 12 right (${pct(12 / 20, 0)}). What should Kai conclude?`,
        options: [
          {
            id: 'a',
            text: 'He’s well calibrated at 60% but overconfident at 90% — his “90%” feelings deserve less trust than he gives them.',
            correct: true,
            explanation: `At 60% he was right ${pct(12 / 20, 0)} of the time — spot on. At 90% he was right only ${pct(13 / 20, 0)} — well below what he claimed.`,
          },
          {
            id: 'b',
            text: 'He’s doing well — he got most of his 90% answers right.',
            correct: false,
            explanation: `Tempting, because ${pct(13 / 20, 0)} is “most”. But he claimed 90%; being right ${pct(13 / 20, 0)} of the time is a big gap.`,
          },
          {
            id: 'c',
            text: 'He should say 50% on everything to be safe.',
            correct: false,
            explanation: 'That would make him “calibrated” but useless — it throws away real knowledge. At 60% he was accurate; the problem is only at the top.',
          },
          {
            id: 'd',
            text: 'He’s underconfident at 90%.',
            correct: false,
            explanation: 'Underconfident would mean being right *more* often than claimed. He was right less often.',
          },
        ],
      },
    },
  ],

  practice: [
    floodA,
    {
      id: 'l4-p02',
      type: 'numeric',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s2',
      scenario: {
        label: 'School nurse’s note (fictional)',
        body: 'A (made-up) skin-prick screen for a nut allergy picks up 90% of children who have the allergy, and gives a negative result to 85% of children who don’t. About 4 in 100 children at Larkhill School have the allergy.',
      },
      prompt: 'A child picked at random screens positive. What is the chance they actually have the allergy? Give a percentage.',
      answer: () => bayesPosterior(ALLERGY) * 100,
      unit: 'percent',
      tolerance: 3,
      solution: `In ${kAllergy.pop} children: ${kAllergy.has} have the allergy and ${kAllergy.tp} screen positive. Of the ${kAllergy.not} who don’t, ${kAllergy.fpRate} — ${kAllergy.fp} — screen positive anyway. So ${kAllergy.tp} of ${kAllergy.pos} positives have it: ${kAllergy.post}.`,
      commonErrors: [
        { value: () => 90, tolerance: 2, explanation: '90% is the chance of screening positive *if* you have the allergy — the reverse of the question.' },
        { value: () => 85, tolerance: 2, explanation: '85% is how often children *without* the allergy get a negative. It isn’t the answer to this question.' },
      ],
      populationGrid: { population: 1000, ...ALLERGY },
    },
    {
      id: 'l4-p03',
      type: 'slider',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s3',
      prompt: 'Move the slider after each piece of evidence to show how likely the idea now is.',
      hypothesis: 'The (made-up) Pinecrest bakery has stopped selling its cheese scones.',
      prior: 0.2,
      evidence: [
        card(
          'e1',
          'You visit on a Tuesday afternoon and there are no cheese scones on the shelf.',
          [9, 10],
          [3, 10],
          `An empty shelf is three times as likely if they’ve stopped — but popular things sell out. Moderate evidence: about ${pct(0.2, 0)} → ${pct(updateTrajectory(0.2, [9 / 10 / (3 / 10)])[0], 0)}.`,
        ),
        card(
          'e2',
          'The menu board by the till still lists cheese scones.',
          [1, 2],
          [9, 10],
          'Slightly against: menus often lag behind changes, so this is only a bit more likely if they still sell them. A small step down.',
        ),
        card(
          'e3',
          'The baker tells you, “We don’t do those any more — not enough people bought them.”',
          [19, 20],
          [1, 20],
          'Very strong evidence: the baker would almost never say this if the scones were still sold. Your estimate should jump high.',
        ),
      ],
    },
    {
      id: 'l4-p04',
      type: 'mc',
      level: 4,
      skills: ['calibration'],
      kind: 'application',
      lessonRef: 'l4-s5',
      prompt:
        'Two weather apps forecast rain for the (made-up) town of Ellery. Over a year, on the days App A said “70% chance of rain”, it rained on 69% of them. On the days App B said “70%”, it rained on 45%. Which statement is right?',
      options: [
        {
          id: 'a',
          text: 'App A is well calibrated at 70%; App B is overconfident about rain at 70%.',
          correct: true,
          explanation: 'App A’s 70% means about 70%. App B’s 70% really means about 45% — it says rain is more likely than it turns out to be.',
        },
        {
          id: 'b',
          text: 'App B is better, because it’s wrong less often about dry days.',
          correct: false,
          explanation: 'Tempting, because it did rain less than B predicted. But calibration is about whether the stated chance matches what happens; B’s doesn’t.',
        },
        {
          id: 'c',
          text: 'Neither can be judged: a forecast of 70% can’t be wrong.',
          correct: false,
          explanation:
            'A single 70% forecast can’t be wrong — but over many forecasts, you can check whether 70% predictions come true about 70% of the time. That’s calibration.',
        },
        {
          id: 'd',
          text: 'App A is underconfident.',
          correct: false,
          explanation: 'It rained on 69% of its 70% days — almost exactly right.',
        },
      ],
    },
    floodB,
    {
      id: 'l4-p06',
      type: 'mc',
      level: 4,
      skills: ['bias-awareness'],
      kind: 'application',
      lessonRef: 'l4-s1',
      prompt:
        'You’re sure the (made-up) Seaview Hotel is overpriced, and you start reading its reviews. Which approach best protects you against confirmation bias?',
      options: [
        {
          id: 'a',
          text: 'Before reading, decide what you’d count as good value — then read a random sample of reviews, not just the ones that catch your eye.',
          correct: true,
          explanation: 'Fixing the standard first and sampling fairly stops you from noticing only the complaints that fit what you already think.',
        },
        {
          id: 'b',
          text: 'Read the one-star reviews first, since they’re the most informative.',
          correct: false,
          explanation: 'Tempting, because complaints can be informative. But starting with the reviews that agree with you is confirmation bias in action.',
        },
        {
          id: 'c',
          text: 'Trust your first impression; you’re usually right about hotels.',
          correct: false,
          explanation: 'Maybe — but “I’m usually right” is exactly what a calibration record can check, and most people overrate it.',
        },
        {
          id: 'd',
          text: 'Only read reviews that mention price.',
          correct: false,
          explanation: 'Narrowing to price is sensible, but it doesn’t stop you from skimming past the ones that say it was worth it.',
        },
      ],
    },
  ],

  bank: [
    bypassA,
    bypassB,
    dietA,
    dietB,
    {
      id: 'l4-b05',
      type: 'numeric',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s2',
      scenario: {
        label: 'Health news item (fictional)',
        body: 'A new (made-up) blood test for Calloway disease is described as “95% accurate”: it catches 95% of people who have the disease and correctly clears 95% of people who don’t. About 1 person in 100 has Calloway disease.',
      },
      prompt: 'A person picked at random tests positive. What is the chance they actually have Calloway disease? Give a percentage.',
      answer: () => bayesPosterior(RARE) * 100,
      unit: 'percent',
      tolerance: 3,
      solution: `In ${kRare.pop} people: ${kRare.has} have it and ${kRare.tp} test positive. Of the ${kRare.not} who don’t, ${kRare.fpRate} — ${kRare.fp} — test positive anyway. So ${kRare.tp} of ${kRare.pos} positives have it: ${kRare.post}. “95% accurate” and “95% chance you have it” are very different things.`,
      commonErrors: [
        { value: () => 95, tolerance: 2, explanation: 'That’s the test’s accuracy, not the chance a positive is right. With a rare condition, false positives from the many healthy people swamp the true ones.' },
        { value: () => RARE.prevalence * 100, tolerance: 0.5, explanation: '1% is the base rate before testing. A positive result should raise it — just not as far as intuition suggests.' },
      ],
      populationGrid: { population: 2000, ...RARE },
    },
    {
      id: 'l4-b06',
      type: 'numeric',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s2',
      scenario: {
        label: 'Port security briefing (fictional)',
        body: 'At the (made-up) Port Ellery ferry terminal, a sniffer dog checks bags for smuggled goods. In trials it alerted on 80% of bags that contained them, and stayed quiet for 98% of bags that didn’t. About 1 bag in 200 contains smuggled goods.',
      },
      prompt: 'The dog alerts on a bag. What is the chance the bag actually contains smuggled goods? Give a percentage.',
      answer: () => bayesPosterior(DOG) * 100,
      unit: 'percent',
      tolerance: 3,
      solution: `In ${kDog.pop} bags: ${kDog.has} contain goods and the dog alerts on ${kDog.tp}. Of the ${kDog.not} clean bags, ${kDog.fpRate} — about ${kDog.fp} — get an alert anyway. So ${kDog.tp} of about ${kDog.pos} alerts are real: ${kDog.post}. The dog is useful — it raises the chance from ${pct(DOG.prevalence)} to about ${pct(bayesPosterior(DOG), 0)} — but most alerts are still false.`,
      commonErrors: [
        { value: () => 80, tolerance: 2, explanation: '80% is how often the dog alerts when goods *are* there — not how often an alert means goods are there.' },
        { value: () => 98, tolerance: 1, explanation: '98% is how often the dog stays quiet on clean bags. It’s about a different question.' },
      ],
      populationGrid: { population: 1000, ...DOG },
    },
    {
      id: 'l4-b07',
      type: 'numeric',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s2',
      scenario: {
        label: 'Factory report (fictional)',
        body: 'At the (made-up) Grayton toy factory, 5% of wind-up cars come off the line faulty. An automatic tester flags 80% of faulty cars, and wrongly flags 10% of good ones.',
      },
      prompt: 'A car is flagged. What is the chance it is actually faulty? Give a percentage.',
      answer: () => bayesPosterior(FACTORY) * 100,
      unit: 'percent',
      tolerance: 3,
      solution: `In ${kFactory.pop} cars: ${kFactory.has} are faulty and ${kFactory.tp} get flagged. Of the ${kFactory.not} good cars, ${kFactory.fpRate} — ${kFactory.fp} — get flagged too. So ${kFactory.tp} of ${kFactory.pos} flagged cars are faulty: ${kFactory.post}.`,
      commonErrors: [
        { value: () => 80, tolerance: 2, explanation: '80% is the chance a faulty car gets flagged — the reverse of the question.' },
        { value: () => 90, tolerance: 2, explanation: '90% is how often good cars pass. It doesn’t answer this question.' },
      ],
      populationGrid: { population: 1000, ...FACTORY },
    },
    {
      id: 'l4-b08',
      type: 'numeric',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s2',
      scenario: {
        label: 'IT help page (fictional)',
        body: 'At the (made-up) firm Halvorsen & Co, 30% of incoming email is junk. The junk filter catches 95% of junk emails, and wrongly flags 10% of genuine ones.',
      },
      prompt: 'An email lands in the junk folder. What is the chance it really is junk? Give a percentage.',
      answer: () => bayesPosterior(SPAM) * 100,
      unit: 'percent',
      tolerance: 3,
      solution: `In ${kSpam.pop} emails: ${kSpam.has} are junk and ${kSpam.tp} get flagged. Of the ${kSpam.not} genuine emails, ${kSpam.fpRate} — ${kSpam.fp} — get flagged too. So ${kSpam.tp} of ${kSpam.pos} flagged emails are junk: ${kSpam.post}. Base rates cut both ways: when the thing is common, a positive is usually right.`,
      commonErrors: [
        { value: () => 95, tolerance: 2, explanation: '95% is the chance junk gets caught, not the chance a caught email is junk. It’s close-ish here only because junk is common.' },
        { value: () => SPAM.prevalence * 100, tolerance: 2, explanation: '30% is the base rate before the filter looked. Being flagged is strong evidence; it should raise that a lot.' },
      ],
      populationGrid: { population: 1000, ...SPAM },
    },
    {
      id: 'l4-b09',
      type: 'numeric',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s2',
      scenario: {
        label: 'Screening programme (fictional)',
        body: 'The (made-up) town of Arnwick screens 1,000 adults for Tessel’s condition (invented). About 2 in 100 adults have it. The test catches 90% of people who have it and wrongly flags 5% of people who don’t.',
      },
      prompt: 'About how many of the 1,000 people will get a positive result?',
      answer: () => COUNTED.truePositive + COUNTED.falsePositive,
      unit: 'people',
      tolerance: 3,
      solution: `${kCount.has} people have it; ${pct(COUNT.sensitivity, 0)} of them — ${kCount.tp} — test positive. ${kCount.not} don’t; ${kCount.fpRate} of them — ${kCount.fp} — test positive anyway. Total: ${COUNTED.truePositive + COUNTED.falsePositive}. Most positives are false alarms, which matters for planning follow-up appointments.`,
      commonErrors: [
        { value: () => COUNTED.truePositive, tolerance: 2, explanation: 'That counts only the true positives. The false positives from the 980 people without the condition are the bigger group.' },
        { value: () => kCount.has, tolerance: 1, explanation: `${kCount.has} is how many have the condition — not how many test positive.` },
      ],
      populationGrid: { population: 1000, ...COUNT },
    },
    {
      id: 'l4-b10',
      type: 'numeric',
      level: 4,
      skills: ['bias-awareness', 'probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s1',
      prompt:
        'A phone and its case cost £110 together. The phone costs £100 more than the case. How much does the case cost, in pounds?',
      answer: () => (110 - 100) / 2,
      unit: 'number',
      tolerance: 0.01,
      solution:
        'If the case costs c, the phone costs c + 100, so c + (c + 100) = 110, giving 2c = 10 and c = £5 (phone £105). The fast answer — £10 — makes the phone only £90 more than the case.',
      commonErrors: [
        {
          value: () => 10,
          tolerance: 0.01,
          explanation:
            '£10 is the gut answer almost everyone reaches first. But then the phone would be £100 and the difference only £90. This is what a question that needs deliberate thought feels like: an answer arrives instantly and feels right.',
        },
      ],
    },
    {
      id: 'l4-b11',
      type: 'slider',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s3',
      prompt: 'Move the slider after each piece of evidence to show how likely the idea now is.',
      hypothesis: 'Your (made-up) neighbour’s dog, Bruno, is the one digging up your vegetable patch.',
      prior: 0.3,
      evidence: [
        card(
          'e1',
          'You find paw prints in the soil about the size of Bruno’s.',
          [8, 10],
          [4, 10],
          'Twice as likely if it’s Bruno — foxes and other dogs leave similar prints. Mild support.',
        ),
        card(
          'e2',
          'Bruno’s owner shows you that her garden fence has no gaps, and Bruno never goes out alone.',
          [1, 10],
          [9, 10],
          'Strong evidence against: if Bruno can’t get out, he’s very unlikely to be the digger. Nine times as likely if it isn’t him.',
        ),
        card(
          'e3',
          'A camera catches a fox in the vegetable patch at 3am.',
          [1, 5],
          [4, 5],
          'Another clear step down: a fox at the scene is much more likely if the culprit isn’t Bruno.',
        ),
      ],
    },
    {
      id: 'l4-b12',
      type: 'slider',
      level: 4,
      skills: ['probabilistic-reasoning', 'bias-awareness'],
      kind: 'application',
      lessonRef: 'l4-s3',
      prompt: 'Move the slider after each piece of evidence to show how likely the idea now is.',
      hypothesis: 'The (made-up) Hartley Hornets will win Saturday’s match against the Daleside Dons.',
      prior: 0.5,
      evidence: [
        card(
          'e1',
          'The Hornets have won 7 of their last 10 matches; the Dons have won 4.',
          [6, 10],
          [4, 10],
          'Recent form helps a little, but it’s a modest signal: 1.5 times as likely if the Hornets go on to win.',
        ),
        card(
          'e2',
          'The Hornets’ top scorer is ruled out injured.',
          [2, 5],
          [3, 5],
          'Mildly bad news for the Hornets. A step down, but not a collapse — teams adjust.',
        ),
        card(
          'e3',
          'Every pundit on your favourite Hornets fan podcast predicts a Hornets win.',
          [11, 20],
          [10, 20],
          'Almost no evidence: fan pundits predict a home win nearly every week, whatever happens. If you moved much, that was the pull of what you wanted to hear.',
        ),
      ],
    },
    {
      id: 'l4-b13',
      type: 'slider',
      level: 4,
      skills: ['probabilistic-reasoning'],
      kind: 'application',
      lessonRef: 'l4-s3',
      prompt: 'Move the slider after each piece of evidence to show how likely the idea now is.',
      hypothesis: 'Your colleague Tomás is the person leaving anonymous thank-you notes on people’s desks at the (made-up) Wexford office.',
      prior: 0.1,
      evidence: [
        card(
          'e1',
          'The notes always appear on days Tomás is in the office.',
          [1, 1],
          [3, 5],
          'He’s in most days anyway, so this only mildly favours him: a likelihood ratio of about 1.7.',
        ),
        card(
          'e2',
          'The handwriting closely matches a birthday card Tomás wrote.',
          [9, 10],
          [1, 20],
          'Strong evidence: a close handwriting match is 18 times as likely if he’s the writer. Your estimate should rise steeply.',
        ),
      ],
    },
    {
      id: 'l4-b14',
      type: 'mc',
      level: 4,
      skills: ['bias-awareness'],
      kind: 'application',
      lessonRef: 'l4-s4',
      scenario: {
        label: 'Club newsletter (fictional)',
        body: 'Ravi chairs the (made-up) Thornbury Cycling Club and wants to keep its Sunday ride at 9am. When a member’s survey of 25 riders found most preferred 10am, Ravi wrote: “25 people is a tiny sample — let’s not rush.” Last year, he moved the ride from 8am to 9am after a survey of 22 riders.',
      },
      prompt: 'What’s the best description of Ravi’s reasoning?',
      options: [
        {
          id: 'a',
          text: 'He’s applying a standard (sample size) to the result he dislikes that he didn’t apply to the one he liked.',
          correct: true,
          explanation: 'The surveys are about the same size. If 22 was enough when the result suited him, 25 is enough now — or neither was.',
        },
        {
          id: 'b',
          text: 'He’s right: 25 riders really is too small a sample.',
          correct: false,
          explanation: 'Tempting, because small samples are a real issue. But his inconsistency is the problem here, whatever the right sample size is.',
        },
        {
          id: 'c',
          text: 'He’s being cautious, which is always sensible with surveys.',
          correct: false,
          explanation: 'Caution applied only to unwelcome results isn’t caution; it’s a filter.',
        },
        {
          id: 'd',
          text: 'He’s committing an ad hominem against the member.',
          correct: false,
          explanation: 'He doesn’t attack the member personally. The flaw is the uneven standard.',
        },
      ],
    },
    {
      id: 'l4-b15',
      type: 'mc',
      level: 4,
      skills: ['calibration'],
      kind: 'application',
      lessonRef: 'l4-s5',
      prompt:
        'Iris gives every answer in a quiz a confidence of 99%. She gets 70% of them right. Ben gives every answer 70% and also gets 70% right. Which statement about their Brier scores is true? (Lower is better.)',
      options: [
        {
          id: 'a',
          text: 'Ben’s is much better than Iris’s, even though they got the same number right.',
          correct: true,
          explanation: `Ben’s score works out at ${round(0.7 * (1 - 0.7) ** 2 + 0.3 * 0.7 ** 2, 3)}; Iris’s at ${round(0.7 * (1 - 0.99) ** 2 + 0.3 * 0.99 ** 2, 3)}. Her confident wrong answers are heavily penalised — that’s the point: the score rewards honesty about uncertainty.`,
        },
        {
          id: 'b',
          text: 'They’re the same, because they got the same number right.',
          correct: false,
          explanation: 'Tempting, because accuracy is equal. But the Brier score also measures how well confidence matched reality.',
        },
        {
          id: 'c',
          text: 'Iris’s is better, because she was more decisive.',
          correct: false,
          explanation: 'Decisiveness isn’t rewarded when it’s wrong. Each confident wrong answer costs her almost the maximum.',
        },
        {
          id: 'd',
          text: 'You can’t compare Brier scores between people.',
          correct: false,
          explanation: 'You can, as long as they answered the same kind of questions.',
        },
      ],
    },
    {
      id: 'l4-b16',
      type: 'reflection',
      level: 4,
      skills: ['bias-awareness'],
      kind: 'application',
      lessonRef: 'l4-s4',
      prompt:
        'Think of a time you accepted a piece of evidence quickly because you liked its conclusion — or rejected one because you didn’t. Apply the swap test: if the same evidence had pointed the other way, how would you have judged it?',
      modelAnswers: [
        'I shared an article saying my favourite café had the best coffee in town, based on one blogger’s ranking. If the same blogger had ranked it last, I’d have said “one person’s taste”. So it was weak evidence either way.',
        'When a friend said my phone brand had worse battery life, I said their test was unfair because they used it for games. When a test I liked used games too, I didn’t mention it. I should have held both to the same standard.',
      ],
      rubric: [
        'I described a specific piece of evidence, not just a topic.',
        'I imagined the reversed result and honestly described how I’d have treated it.',
        'I said what a consistent judgement of the evidence would have been.',
      ],
    },
  ],
};
