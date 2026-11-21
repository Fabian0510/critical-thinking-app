/**
 * Level 3 — "Taking arguments apart"
 * Audience: university students. All people, places, organisations and texts are invented.
 * Grid items use only premises whose truth is common knowledge (e.g. whales are mammals),
 * so "are the premises true?" has a definite answer.
 */
import type { LevelContent, MCItem, TagItem } from '../types/content';

const pcTags: TagItem['tagSet'] = [
  { id: 'premise', label: 'Premise', hint: 'A reason offered in support.' },
  { id: 'conclusion', label: 'Conclusion', hint: 'What the reasons are meant to establish.' },
  { id: 'neither', label: 'Neither', hint: 'Background, scene-setting or an aside — not part of the argument.' },
];

type Fallacy = 'ad-hominem' | 'strawman' | 'false-dilemma' | 'correlation' | 'authority' | 'slippery' | 'hasty' | 'none';

const FALLACY_TEXT: Record<Fallacy, string> = {
  'ad-hominem': 'Ad hominem — attacking the person instead of the argument',
  strawman: 'Strawman — arguing against a distorted version of the view',
  'false-dilemma': 'False dilemma — pretending there are only two options',
  correlation: 'Correlation as causation — assuming that because two things go together, one causes the other',
  authority: 'Appeal to authority — relying on someone whose expertise doesn’t cover the question',
  slippery: 'Slippery slope — claiming one step will inevitably lead to an extreme outcome, without support',
  hasty: 'Hasty generalisation — a broad conclusion from too few cases',
  none: 'No fallacy — the reasoning is reasonable',
};

/**
 * Build a "which fallacy?" multiple-choice item. `options` lists the fallacies to offer,
 * each with its explanation; `answer` is the correct one.
 */
function fallacyItem(
  base: Omit<MCItem, 'type' | 'options' | 'level' | 'kind'> & { kind?: MCItem['kind'] },
  answer: Fallacy,
  options: Partial<Record<Fallacy, string>>,
): MCItem {
  return {
    ...base,
    type: 'mc',
    level: 3,
    kind: base.kind ?? 'application',
    options: (Object.keys(options) as Fallacy[]).map((f) => ({
      id: f,
      text: FALLACY_TEXT[f],
      correct: f === answer,
      explanation: options[f]!,
    })),
  };
}

export const level3: LevelContent = {
  level: 3,
  title: 'Taking arguments apart',
  arcStep: 'Judging arguments',
  audience: 'University student',
  coreIdea:
    'Arguments have premises and a conclusion. Test validity (does the conclusion follow?) and soundness (are the premises true?) separately — and look for the other explanations the arguer skipped.',

  screens: [
    {
      id: 'l3-s1',
      title: 'Find the conclusion first',
      skills: ['argument-structure'],
      visual: { kind: 'arc', highlight: 3 },
      body: [
        'An argument is a set of **premises** (reasons) offered in support of a **conclusion** (what you’re meant to accept). Real writing mixes these with background, asides and rhetoric, and rarely puts the conclusion last.',
        'Start by finding the conclusion: ask “what is this person trying to get me to believe or do?” Words like *so*, *therefore*, *which means* and *clearly* often flag it; *because*, *since* and *given that* often flag premises.',
        'Then ask of each remaining sentence: is this offered as a reason for the conclusion, or is it just context?',
      ],
      example: {
        title: 'Worked example: the club email',
        body: [
          '“The Harlow Chess Club has met on Thursdays since it began. Attendance this term has averaged 9, down from 20 last year. Most of the members who stopped coming told us they now have Thursday evening classes. We should move to Tuesdays.”',
          'Conclusion: **we should move to Tuesdays** (it comes last here, but often doesn’t).',
          'Premises: attendance fell from 20 to 9; departing members cite Thursday classes. Background: the club has always met on Thursdays — true, but it isn’t a reason to move.',
          'Laid out like this, you can see the gap: nothing shows Tuesdays would be better. That gap was hard to spot in the paragraph.',
        ],
      },
      check: {
        id: 'l3-c01',
        type: 'tag',
        level: 3,
        skills: ['argument-structure'],
        kind: 'application',
        lessonRef: 'l3-s1',
        scenario: {
          label: 'Letter to a local paper (fictional)',
          body: 'From the Corbridge Gazette letters page.',
        },
        prompt: 'Tag each sentence as premise, conclusion, or neither.',
        tagSet: pcTags,
        segments: [
          { id: 's1', text: 'I have lived on Station Road for twelve years.', answer: 'neither', why: 'Context about the writer. It isn’t offered as a reason.' },
          {
            id: 's2',
            text: 'The council should put a pedestrian crossing outside the primary school.',
            answer: 'conclusion',
            why: 'This is what the letter wants you to accept; the other sentences are there to support it.',
          },
          {
            id: 's3',
            text: 'Over two hundred children cross that road every school morning.',
            answer: 'premise',
            why: 'A reason: many people are exposed to the risk.',
          },
          {
            id: 's4',
            text: 'The council’s own records show three near-misses there this year.',
            answer: 'premise',
            why: 'A reason: evidence that the risk is real.',
          },
        ],
      },
    },
    {
      id: 'l3-s2',
      title: 'Valid and sound are different questions',
      skills: ['argument-structure'],
      visual: { kind: 'validity-grid' },
      body: [
        'Two separate questions. **Valid:** if the premises were true, would the conclusion *have* to be true? That’s about the argument’s shape, not the facts. **Sound:** is it valid, *and* are the premises actually true?',
        'A valid argument can have false premises (and so a false conclusion). An invalid argument can have true premises *and* a true conclusion — the conclusion just doesn’t follow from them.',
        'Keeping the questions apart stops two common mistakes: accepting an argument because you like its conclusion, and rejecting a well-built argument because one premise is shaky (fix the premise, not the logic).',
      ],
      example: {
        title: 'Worked example: two arguments that look alike',
        body: [
          '**A.** All mammals breathe air. Whales are mammals. So whales breathe air. — Valid (the conclusion must follow) and the premises are true, so **sound**.',
          '**B.** All mammals breathe air. Whales breathe air. So whales are mammals. — The premises and conclusion are all true, but it’s **invalid**: turtles breathe air too, and they aren’t mammals. Breathing air doesn’t make something a mammal.',
          'B gets to a true conclusion by luck. Swap “whales” for “crocodiles” and the same shape leads you to a falsehood.',
        ],
      },
      check: {
        id: 'l3-c02',
        type: 'grid',
        level: 3,
        skills: ['argument-structure'],
        kind: 'application',
        lessonRef: 'l3-s2',
        prompt: 'Is this argument valid? Are its premises true?',
        premises: ['All birds can fly.', 'Penguins are birds.'],
        conclusion: 'So penguins can fly.',
        answer: { valid: true, premisesTrue: false },
        cells: {
          'valid-true':
            'The shape is fine — if both premises were true, the conclusion would follow. But “all birds can fly” is false: penguins, ostriches and kiwis can’t.',
          'valid-false':
            'Right. If all birds could fly and penguins are birds, penguins would have to fly — so it’s valid. The first premise is false, so it isn’t sound.',
          'invalid-true':
            'Tempting, because the conclusion is false and that feels like a broken argument. But validity is about shape: the conclusion would follow if the premises were true.',
          'invalid-false':
            'Half right — a premise is false. But the argument is valid: false premises don’t stop a conclusion from following from them.',
        },
      },
    },
    {
      id: 'l3-s3',
      title: 'Fallacies in the wild',
      skills: ['fallacy-detection'],
      body: [
        'A fallacy is a pattern of reasoning that feels persuasive but doesn’t support the conclusion. In real life they rarely come labelled; they’re woven into reasonable-sounding prose.',
        'Seven common ones: **ad hominem** (attacking the person), **strawman** (attacking a distorted version), **false dilemma** (only two options offered), **correlation as causation**, **appeal to authority** (an expert outside their field, or authority instead of evidence), **slippery slope** (one step must lead to disaster), and **hasty generalisation** (big conclusion, few cases).',
        'Don’t hunt for labels, though. Ask: does this sentence give a reason to believe the conclusion? If it doesn’t, then work out why not.',
      ],
      example: {
        title: 'Worked example: the gym debate',
        body: [
          'A post in a (made-up) Calderwood residents’ forum: “Priya says the leisure centre should open earlier so shift workers can use it. But Priya doesn’t even live in Calderwood any more — she moved to Brookley last year. Why should she get a say?”',
          'Priya’s argument is about shift workers’ needs. The reply never touches that; it attacks where Priya lives. That’s **ad hominem**.',
          'Where she lives might matter to whether she gets a vote. It doesn’t matter to whether her *argument* is right — shift workers need an earlier opening time just as much either way.',
        ],
      },
      check: fallacyItem(
        {
          id: 'l3-c03',
          skills: ['fallacy-detection'],
          lessonRef: 'l3-s3',
          scenario: {
            label: 'Staff meeting notes (fictional)',
            body: 'Jo suggested that the Elmstead office try one meeting-free afternoon a week, to give people time for focused work. Marcus replied: “So Jo thinks we should stop talking to each other entirely and just hide at our desks? That’s how teams fall apart. I’m against it.”',
          },
          prompt: 'What’s wrong with Marcus’s reply?',
        },
        'strawman',
        {
          strawman: 'Right. Jo proposed one afternoon a week; Marcus argues against “stop talking to each other entirely”, a much weaker position that nobody put forward.',
          'slippery': 'Tempting, because “that’s how teams fall apart” sounds like a slide to disaster. But the core move is misdescribing Jo’s proposal, not predicting a chain of steps.',
          'ad-hominem': 'Marcus doesn’t attack Jo personally; he attacks a version of her idea.',
          'false-dilemma': 'He doesn’t offer two options; he swaps her modest proposal for an extreme one.',
        },
      ),
    },
    {
      id: 'l3-s4',
      title: 'The same evidence, other explanations',
      skills: ['alternative-explanations'],
      body: [
        'Much bad reasoning isn’t a fallacy you can name — it’s stopping at the first explanation that fits. Evidence that fits your explanation usually fits others too.',
        'When you see “X happened, then Y happened, so X caused Y”, list the rivals: **something else changed at the same time**; **Y causes X** rather than the other way round; **a third thing causes both**; **chance**; **who was measured** (were the groups different to begin with?).',
        'Then ask what evidence would tell the explanations apart. That’s the step that turns a hunch into a test.',
      ],
      example: {
        title: 'Worked example: the library biscuits',
        body: [
          'Brackley Library (made-up) started offering free biscuits in March. Visits in March were up 30% on February. A librarian concludes the biscuits brought people in.',
          'Rivals: the leisure centre next door closed for repairs in March, so its users may have come in to wait or keep warm; it was the school exam season; March has three more days than February.',
          'A test that separates them: compare March with March last year (same days and season), and check whether the rise was mostly at times the leisure centre would have been open.',
        ],
      },
      check: {
        id: 'l3-c04',
        type: 'mc',
        level: 3,
        skills: ['alternative-explanations'],
        kind: 'application',
        lessonRef: 'l3-s4',
        scenario: {
          label: 'Company blog (fictional)',
          body: 'Tallyhop, a budgeting app, reports: “Users who turn on our weekly spending summary save 40% more per month than users who don’t. Turn it on today and start saving more!”',
        },
        prompt: 'What is the most important alternative explanation to rule out?',
        options: [
          {
            id: 'a',
            text: 'People who choose to turn on a spending summary may already be more careful savers.',
            correct: true,
            explanation:
              'The users chose themselves. Careful savers are probably more likely to switch on budgeting features, so the summary might not cause anything. A fair test would switch it on for a random half of users.',
          },
          {
            id: 'b',
            text: 'The 40% figure might be rounded.',
            correct: false,
            explanation: 'Rounding could change the size slightly, but it doesn’t offer another explanation for the difference.',
          },
          {
            id: 'c',
            text: 'Tallyhop benefits from people using its features.',
            correct: false,
            explanation:
              'Tempting — it’s a real incentive and worth noticing (Level 2). But even if Tallyhop were completely neutral, the self-selection problem would remain.',
          },
          {
            id: 'd',
            text: 'Saving money is not the only goal of budgeting.',
            correct: false,
            explanation: 'True, but it doesn’t explain why the two groups save different amounts.',
          },
        ],
      },
    },
    {
      id: 'l3-s5',
      title: 'Argue against the strongest version',
      skills: ['argument-structure', 'bias-awareness'],
      body: [
        'Defeating a weak version of a view teaches you nothing. **Steelmanning** means stating the opposing view in its strongest form — the version a thoughtful supporter would actually sign up to — before responding.',
        'A good steelman uses the opponent’s best reasons, not their worst; it’s specific; and its supporters would recognise it as fair.',
        'If your own view survives the steelman, you can hold it with more confidence. If it doesn’t, you’ve learned something.',
      ],
      example: {
        title: 'Worked example: the four-day week',
        body: [
          'Naz runs a small (made-up) design studio, Inkwell, and is against a staff proposal to trial a four-day week. Her first summary of their view: “They just want a day off.”',
          'Steelman: “Staff think focused work is the bottleneck, not hours; that a shorter week would cut the meetings and context-switching that eat Fridays anyway; and that a trial with clear measures — deadlines hit, client feedback — would show whether output holds.”',
          'Naz still has concerns about client cover on Fridays. But now she’s responding to their real case, and her objection (cover) is one they can actually address.',
        ],
      },
      check: {
        id: 'l3-c05',
        type: 'mc',
        level: 3,
        skills: ['argument-structure', 'bias-awareness'],
        kind: 'application',
        lessonRef: 'l3-s5',
        prompt:
          'The (made-up) Weston Rowing Club is debating whether to admit under-14s. You oppose it. Which is the strongest version of the case *for* admitting them?',
        options: [
          {
            id: 'a',
            text: 'Other clubs that admit under-14s with a separate supervised session keep more members into adulthood, and a supervised session would answer safety worries.',
            correct: true,
            explanation:
              'It gives a concrete benefit (long-term membership), points to evidence that could be checked, and addresses the main objection (safety). A supporter would sign up to this.',
          },
          {
            id: 'b',
            text: 'Kids should be allowed to do whatever adults can.',
            correct: false,
            explanation: 'Easy to knock down — and that’s the problem. No thoughtful supporter is arguing this.',
          },
          {
            id: 'c',
            text: 'Rowing is fun, and everyone deserves fun.',
            correct: false,
            explanation: 'Sincere, but vague. It doesn’t engage with the reasons people object.',
          },
          {
            id: 'd',
            text: 'Some members have children who want to join.',
            correct: false,
            explanation:
              'Tempting, because it’s a real reason. But on its own it sounds like members wanting a favour; the strongest version explains the benefit to the club and answers the safety concern.',
          },
        ],
      },
    },
  ],

  practice: [
    {
      id: 'l3-p01',
      type: 'grid',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s2',
      prompt: 'Is this argument valid? Are its premises true?',
      premises: ['All reptiles have backbones.', 'Snakes have backbones.'],
      conclusion: 'So snakes are reptiles.',
      answer: { valid: false, premisesTrue: true },
      cells: {
        'valid-true':
          'Very tempting: every statement here is true, including the conclusion. But it doesn’t follow — fish, birds and mammals have backbones too. Having a backbone doesn’t make something a reptile.',
        'valid-false': 'Both premises are true, and the argument isn’t valid.',
        'invalid-true':
          'Right. The premises are true (and so is the conclusion), but the conclusion doesn’t follow. The same shape would “prove” that cats are reptiles.',
        'invalid-false': 'Invalid, yes — but both premises are true. Reptiles do have backbones, and so do snakes.',
      },
    },
    fallacyItem(
      {
        id: 'l3-p02',
        skills: ['fallacy-detection'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Review site comment (fictional)',
          body: '“I’ve eaten at two restaurants in Port Ellery this summer and both were overpriced and slow. Honestly, the whole town is a tourist trap. Avoid.”',
        },
        prompt: 'What’s the main problem with this reasoning?',
      },
      'hasty',
      {
        hasty: 'Right. Two restaurants on a summer visit is far too few to judge a whole town (and summer may be its busiest time).',
        correlation: 'There’s no claim here about one thing causing another.',
        'ad-hominem': 'The comment doesn’t attack anyone’s character; it overgeneralises from experience.',
        none: 'Tempting, because the experiences were real and the reviewer is honest about them. But the conclusion (“the whole town”) goes far beyond two meals.',
      },
    ),
    {
      id: 'l3-p03',
      type: 'tag',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s1',
      scenario: { label: 'Student union post (fictional)', body: 'A post from the Halden University student union.' },
      prompt: 'Tag each sentence as premise, conclusion, or neither.',
      tagSet: pcTags,
      segments: [
        {
          id: 's1',
          text: 'The library should stay open until midnight during exams.',
          answer: 'conclusion',
          why: 'This is what the post wants you to accept — and here it comes first.',
        },
        {
          id: 's2',
          text: 'Last exam season, the 24-hour study room was over capacity every night after 9pm.',
          answer: 'premise',
          why: 'A reason: there’s demand for late study space.',
        },
        { id: 's3', text: 'The library was built in 1972.', answer: 'neither', why: 'Background. It doesn’t support or undermine the conclusion.' },
        {
          id: 's4',
          text: 'Many students share rooms in halls and can’t study quietly at home.',
          answer: 'premise',
          why: 'A reason: other options aren’t good enough.',
        },
      ],
    },
    {
      id: 'l3-p04',
      type: 'mc',
      level: 3,
      skills: ['alternative-explanations'],
      kind: 'application',
      lessonRef: 'l3-s4',
      scenario: {
        label: 'Local news (fictional)',
        body: 'Since Ravensworth installed brighter street lights on its high street last autumn, reported bike thefts there have fallen by half compared with the autumn before. The council credits the lights.',
      },
      prompt: 'Which piece of information would best help test the council’s explanation?',
      options: [
        {
          id: 'a',
          text: 'Whether bike thefts also fell by a similar amount on nearby streets that didn’t get new lights.',
          correct: true,
          explanation:
            'If thefts fell everywhere, something else (a police operation, fewer people cycling, a prolific thief moving away) is a better explanation. If they fell only under the new lights, the council’s explanation looks stronger.',
        },
        {
          id: 'b',
          text: 'How much the new lights cost.',
          correct: false,
          explanation: 'Useful for deciding if they were worth it, but it doesn’t tell you whether they caused the fall.',
        },
        {
          id: 'c',
          text: 'Whether residents say they feel safer.',
          correct: false,
          explanation: 'Tempting, because it sounds related. But feeling safer is a different outcome from fewer thefts — and people may feel safer just because the lights are new.',
        },
        {
          id: 'd',
          text: 'Whether the council chose the lights after consulting experts.',
          correct: false,
          explanation: 'Good process doesn’t show the result. The question is what caused the fall.',
        },
      ],
    },
    {
      id: 'l3-p05',
      type: 'mc',
      level: 3,
      skills: ['argument-structure', 'bias-awareness'],
      kind: 'application',
      lessonRef: 'l3-s5',
      prompt:
        'You think the (made-up) Fenwick Park should stay free to enter. The park trust proposes a £2 entry charge. Which is the strongest version of the trust’s case?',
      options: [
        {
          id: 'a',
          text: 'Maintenance costs have outgrown the trust’s grant; a small charge with free entry for residents would keep the park open full-time without cutting the gardens.',
          correct: true,
          explanation:
            'It gives the actual problem (funding), a specific plan, and answers the obvious objection (locals priced out). This is what you’d need to argue against.',
        },
        {
          id: 'b',
          text: 'The trust wants to make money from visitors.',
          correct: false,
          explanation: 'That’s how an opponent might describe it — a strawman, not a steelman.',
        },
        {
          id: 'c',
          text: 'Other parks charge, so this one should too.',
          correct: false,
          explanation: 'A weak reason on its own: it doesn’t say why charging would be good here.',
        },
        {
          id: 'd',
          text: 'People value things more when they pay for them.',
          correct: false,
          explanation:
            'Tempting, because it’s a real argument people make. But it’s general and contestable, and it skips the trust’s main concern — paying for upkeep.',
        },
      ],
    },
  ],

  bank: [
    {
      id: 'l3-b01',
      type: 'grid',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s2',
      prompt: 'Is this argument valid? Are its premises true?',
      premises: ['Every planet in our solar system orbits the Sun.', 'Mars is a planet in our solar system.'],
      conclusion: 'So Mars orbits the Sun.',
      answer: { valid: true, premisesTrue: true },
      cells: {
        'valid-true': 'Right: the conclusion must follow, and both premises are true — so it’s sound.',
        'valid-false': 'The shape is valid, but both premises are true.',
        'invalid-true': 'The conclusion does follow: if every planet orbits the Sun and Mars is one, Mars must orbit the Sun.',
        'invalid-false': 'Both the logic and the premises are fine here.',
      },
    },
    {
      id: 'l3-b02',
      type: 'grid',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s2',
      scenario: {
        label: 'Maths homework forum (fictional)',
        body: 'Leah: “10 is even. If a number is divisible by 4, it’s even. So 10 must be divisible by 4.”',
      },
      prompt: 'Is Leah’s argument valid? Are its premises true?',
      premises: ['If a number is divisible by 4, it is even.', '10 is even.'],
      conclusion: 'So 10 is divisible by 4.',
      answer: { valid: false, premisesTrue: true },
      cells: {
        'valid-true': 'Both premises are true, but the conclusion is false — so the argument can’t be valid. A valid argument with true premises can’t have a false conclusion.',
        'valid-false': 'Both premises are true; it’s the logic that fails.',
        'invalid-true':
          'Right. “If divisible by 4, then even” doesn’t mean “if even, then divisible by 4”. This is called affirming the consequent: 10 is even but not divisible by 4.',
        'invalid-false': 'Invalid, yes — but both premises are true. Numbers divisible by 4 are even, and 10 is even.',
      },
    },
    {
      id: 'l3-b03',
      type: 'grid',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s2',
      prompt: 'Is this argument valid? Are its premises true?',
      premises: ['All prime numbers are odd.', '2 is a prime number.'],
      conclusion: 'So 2 is odd.',
      answer: { valid: true, premisesTrue: false },
      cells: {
        'valid-true': 'The shape is valid, but “all prime numbers are odd” is false — 2 is prime and even.',
        'valid-false': 'Right. If all primes were odd, 2 would have to be odd. The first premise is false, so the argument is valid but not sound.',
        'invalid-true':
          'Tempting, because the conclusion is obviously false. But the conclusion does follow from the premises; the problem is a false premise.',
        'invalid-false': 'A premise is false, yes — but the logic is valid.',
      },
    },
    {
      id: 'l3-b04',
      type: 'grid',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s2',
      scenario: {
        label: 'Pub quiz argument (fictional)',
        body: 'Callum: “Sharks are fish. Fish live in water, and so do dolphins. So dolphins are fish.”',
      },
      prompt: 'Is Callum’s argument valid? Are its premises true?',
      premises: ['Sharks are fish.', 'Fish live in water.', 'Dolphins live in water.'],
      conclusion: 'So dolphins are fish.',
      answer: { valid: false, premisesTrue: true },
      cells: {
        'valid-true': 'The premises are true but the conclusion is false (dolphins are mammals), so the argument can’t be valid.',
        'valid-false': 'The premises are all true. The problem is the logic.',
        'invalid-true':
          'Right. Living in water is shared by fish and many non-fish, so it can’t show dolphins are fish. The shark premise is true but doesn’t help at all.',
        'invalid-false': 'Invalid, yes — but every premise is true.',
      },
    },
    fallacyItem(
      {
        id: 'l3-b05',
        skills: ['fallacy-detection'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Running club forum (fictional)',
          body: '**Tom:** I think we should move the Saturday run to 8am. The park gets packed after 9 and we keep having to weave around pushchairs.\n\n**Gail:** This from the man who turned up late to half the runs last year. Not sure we need scheduling advice from Tom.',
        },
        prompt: 'What’s wrong with Gail’s reply?',
      },
      'ad-hominem',
      {
        'ad-hominem':
          'Right. Tom’s reason (the park gets crowded after 9) is untouched. Whether Tom is punctual has nothing to do with whether the park is crowded.',
        strawman: 'Gail doesn’t misrepresent Tom’s proposal; she ignores it and goes after him.',
        hasty: 'Tempting, since she cites his past behaviour. But she isn’t generalising from cases — she’s using his record to dismiss his argument.',
        none: 'His lateness might be relevant to whether he’d show up at 8 — but that isn’t the point she makes. She uses it to dismiss his argument about crowding.',
      },
    ),
    fallacyItem(
      {
        id: 'l3-b06',
        skills: ['fallacy-detection'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Team memo (fictional)',
          body: 'From the manager of the Norwick depot: “Either we all switch to the new TaskGrid scheduling app by Monday, or we accept that this team will keep missing delivery deadlines for ever. I know which one I’d choose.”',
        },
        prompt: 'What’s the main problem with this argument?',
      },
      'false-dilemma',
      {
        'false-dilemma':
          'Right. There are plenty of other options — a different app, a slower roll-out, fixing whatever is actually causing the missed deadlines.',
        slippery: 'Tempting, because “for ever” sounds like a slide to doom. But there’s no chain of steps — just two options presented as the only ones.',
        authority: 'The manager has authority, but the argument doesn’t rest on “because I say so”; it rests on the two-option framing.',
        none: 'The deadlines may be a real problem, but the memo pretends only one fix exists.',
      },
    ),
    fallacyItem(
      {
        id: 'l3-b07',
        skills: ['fallacy-detection', 'alternative-explanations'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Lifestyle article (fictional)',
          body: '“Towns with more independent coffee shops have higher average household incomes, a survey of 40 towns in the (made-up) county of Westshire found. Want a richer town? Open more coffee shops.”',
        },
        prompt: 'What’s the main problem with the article’s conclusion?',
      },
      'correlation',
      {
        correlation:
          'Right. More likely, wealthier towns support more coffee shops — the cause runs the other way. Or a third thing (like being near a city) drives both.',
        hasty: 'Tempting, since 40 towns isn’t huge. But even with 4,000 towns, the pattern wouldn’t show that coffee shops cause wealth.',
        'false-dilemma': 'No either-or choice is offered.',
        none: 'The survey might be fine. The leap from “goes together” to “causes” is the problem.',
      },
    ),
    fallacyItem(
      {
        id: 'l3-b08',
        skills: ['fallacy-detection', 'trust-calibration'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Mattress advert (fictional)',
          body: '“Dr Helena Marsh, award-winning astrophysicist, sleeps on a CloudForm mattress every night. ‘My back pain is gone,’ she says. If it’s good enough for one of the country’s top scientists, it’s good enough for you.”',
        },
        prompt: 'What’s the main problem with this advert’s reasoning?',
      },
      'authority',
      {
        authority:
          'Right. Dr Marsh’s expertise is in astrophysics, not backs or mattresses. Her scientific standing makes her sound authoritative on a question her expertise doesn’t cover — and one person’s back is a single case.',
        hasty: 'There is only one case here, so this is a reasonable thought — but the advert leans mainly on her being a top scientist, not on the number of cases.',
        'ad-hominem': 'This is the opposite: it praises a person instead of attacking one.',
        none: 'Tempting, because experts are often worth listening to. But expertise counts only within the field it’s about.',
      },
    ),
    fallacyItem(
      {
        id: 'l3-b09',
        skills: ['fallacy-detection'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Parent forum (fictional)',
          body: '“If Hillcrest School lets Year 9 use calculators in the maths test, next they’ll want phones in exams, then the internet, and before long exams won’t test anything at all. We have to hold the line now.”',
        },
        prompt: 'What’s the main problem with this argument?',
      },
      'slippery',
      {
        slippery:
          'Right. Each step is presented as inevitable, but there’s no reason given why allowing calculators would lead to allowing the internet. Schools make each of those decisions separately.',
        'false-dilemma': 'Tempting, because it implies “hold the line or lose everything”. But the core move is the chain of unsupported steps.',
        strawman: 'Nobody’s position is being distorted; the problem is the predicted chain of consequences.',
        none: 'Worrying about consequences is fine. Claiming an extreme chain is inevitable without support isn’t.',
      },
    ),
    fallacyItem(
      {
        id: 'l3-b10',
        skills: ['fallacy-detection', 'trust-calibration'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Neighbourhood chat (fictional)',
          body: '**Ola:** Should I be worried about this crack in my ceiling? **Sam:** I asked my friend Bev, who’s a chartered structural engineer. She looked at the photos and said hairline cracks like that are usually just plaster shrinking, but to get it checked if it widens. So probably nothing to panic about.',
        },
        prompt: 'Is there a fallacy in Sam’s reasoning?',
      },
      'none',
      {
        none: 'Right. Bev’s expertise is exactly the relevant field, she looked at the evidence, and Sam’s conclusion is suitably cautious (“probably”, and check if it widens). Relying on real expertise is not a fallacy.',
        authority:
          'Tempting, because Sam is relying on an expert. But appeal to authority is a fallacy only when the authority is outside their field, or is used instead of evidence. Here neither is true.',
        hasty: 'Sam isn’t generalising from a few cases; he’s passing on a specific expert judgement about this crack.',
        'ad-hominem': 'Nobody is being attacked.',
      },
    ),
    fallacyItem(
      {
        id: 'l3-b11',
        skills: ['fallacy-detection'],
        lessonRef: 'l3-s3',
        scenario: {
          label: 'Book club email (fictional)',
          body: 'Ama suggested the Linden Book Club read one non-fiction book each term. Reply from Pete: “I didn’t join a book club to read textbooks. If Ama wants homework, there are evening classes for that.”',
        },
        prompt: 'What’s wrong with Pete’s reply?',
      },
      'strawman',
      {
        strawman: 'Right. One non-fiction book a term isn’t “textbooks” or “homework”. Pete argues against a version that’s easier to dismiss.',
        'ad-hominem': 'Tempting, because he mentions Ama. But he doesn’t attack her character — he distorts her suggestion.',
        'false-dilemma': 'He doesn’t present two options as the only ones.',
        none: 'He might have good reasons to prefer fiction, but he doesn’t give them — he caricatures the proposal.',
      },
    ),
    {
      id: 'l3-b12',
      type: 'mc',
      level: 3,
      skills: ['alternative-explanations'],
      kind: 'application',
      lessonRef: 'l3-s4',
      scenario: {
        label: 'School report (fictional)',
        body: 'Pupils at Oakhurst School who joined the optional after-school chess club scored, on average, 12 points higher on the end-of-year maths test than pupils who didn’t. The head teacher proposes making chess compulsory to raise maths scores.',
      },
      prompt: 'Which is the strongest reason to doubt that chess caused the higher scores?',
      options: [
        {
          id: 'a',
          text: 'The pupils who chose to join a chess club may already have been stronger at maths, or more motivated.',
          correct: true,
          explanation: 'The club was optional, so the groups chose themselves. Comparing these pupils’ scores from *before* they joined would help.',
        },
        {
          id: 'b',
          text: 'Chess and maths are different subjects.',
          correct: false,
          explanation: 'Different subjects can still affect each other; this doesn’t give an alternative explanation.',
        },
        {
          id: 'c',
          text: 'Making chess compulsory might be unpopular.',
          correct: false,
          explanation: 'Tempting, because it’s a fair objection to the policy. But it’s about whether to do it, not about what caused the scores.',
        },
        {
          id: 'd',
          text: 'Twelve points might not be a big difference.',
          correct: false,
          explanation: 'Size matters for whether it’s worth acting on, but even a big gap could come from who joined.',
        },
      ],
    },
    {
      id: 'l3-b13',
      type: 'rank',
      level: 3,
      skills: ['alternative-explanations', 'evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l3-s4',
      prompt:
        'Since the (made-up) Pennock Café started playing classical music, its takings are up 15% on the same three months last year. The owner wants to know whether the music caused it. Rank these checks, most informative first.',
      entries: [
        {
          id: 'alternate',
          label: 'Alternate weeks with and without the music for two months, and compare takings',
          why: 'Directly varies the music while everything else stays roughly the same — a fair test.',
        },
        {
          id: 'neighbours',
          label: 'Ask nearby cafés whether their takings also rose this year',
          why: 'If everyone’s up, something local (more visitors, a new office nearby) is likely. Good for ruling explanations in or out, but doesn’t test the music directly.',
        },
        {
          id: 'customers',
          label: 'Ask customers whether they like the music',
          why: 'Liking it doesn’t show it changes spending — and people tend to say nice things to the owner.',
        },
        {
          id: 'staff',
          label: 'Ask staff whether they think the music helped',
          why: 'Opinions from people who know the owner chose it; no measurement at all.',
        },
      ],
      correctOrder: ['alternate', 'neighbours', 'customers', 'staff'],
      rationale:
        'The best check actually changes the suspected cause and measures the result. Checking whether a rival explanation (a general local rise) fits comes next. Opinions are weakest — and staff opinions weaker still, since staff are measuring nothing and know the owner chose the music.',
    },
    {
      id: 'l3-b14',
      type: 'tag',
      level: 3,
      skills: ['argument-structure'],
      kind: 'application',
      lessonRef: 'l3-s1',
      scenario: { label: 'Committee minutes (fictional)', body: 'From the Ashby Allotment Society’s minutes.' },
      prompt: 'Tag each sentence as premise, conclusion, or neither.',
      tagSet: pcTags,
      segments: [
        { id: 's1', text: 'The meeting began at 7pm in the village hall.', answer: 'neither', why: 'Scene-setting.' },
        {
          id: 's2',
          text: 'Since the water butts were installed, the society’s mains water bill has fallen by a third.',
          answer: 'premise',
          why: 'A reason offered for the proposal.',
        },
        {
          id: 's3',
          text: 'Therefore, the society should buy water butts for the remaining twelve plots.',
          answer: 'conclusion',
          why: '“Therefore” signals it, and the other reasons point to it.',
        },
        {
          id: 's4',
          text: 'The supplier has offered a 20% discount on orders of ten or more.',
          answer: 'premise',
          why: 'A further reason: buying now is cheaper.',
        },
        { id: 's5', text: 'Mrs Okafor brought biscuits.', answer: 'neither', why: 'An aside. Welcome, but not part of the argument.' },
      ],
    },
    {
      id: 'l3-b15',
      type: 'mc',
      level: 3,
      skills: ['argument-structure', 'bias-awareness'],
      kind: 'application',
      lessonRef: 'l3-s5',
      prompt:
        'You support a plan to pedestrianise the high street in the (made-up) town of Millbury. Which is the strongest version of the opposing case?',
      options: [
        {
          id: 'a',
          text: 'Several shops depend on customers who can’t walk far, such as older people buying heavy goods; without nearby parking or drop-off points, those shops could lose that trade.',
          correct: true,
          explanation: 'Specific, about a real group, and identifies a real cost. A thoughtful opponent would sign up to it, and it suggests what a good plan must address.',
        },
        {
          id: 'b',
          text: 'Some people just hate change.',
          correct: false,
          explanation: 'This dismisses opponents rather than stating their case — a strawman.',
        },
        {
          id: 'c',
          text: 'Cars have a right to use roads.',
          correct: false,
          explanation: 'Vague, and it sidesteps the actual question of what’s best for the town.',
        },
        {
          id: 'd',
          text: 'It will cost money.',
          correct: false,
          explanation: 'Tempting, because cost is a real issue. But without saying how much, or what it would be weighed against, it’s a weak version of the case.',
        },
      ],
    },
    {
      id: 'l3-b16',
      type: 'reflection',
      level: 3,
      skills: ['alternative-explanations'],
      kind: 'application',
      lessonRef: 'l3-s4',
      scenario: {
        label: 'Office newsletter (fictional)',
        body: 'Since Brightside Insurance moved to an open-plan office in January, sick days are down 20% compared with last year. The newsletter says the open-plan layout has made staff healthier.',
      },
      prompt: 'List at least three other explanations for the fall in sick days. For one of them, describe what evidence would tell it apart from the newsletter’s explanation.',
      modelAnswers: [
        'Last winter might have had a bad flu season and this one a mild one. Staff might feel more watched in open plan, so they come in when ill rather than take days off. The company might have changed how sick days are recorded. To test the flu-season idea: compare with sick-day figures at similar firms that didn’t change offices.',
        'People who disliked the move may have left, changing who is counted. A new manager might discourage sick days. Fewer people might be working there overall. To test the “fewer staff” idea: look at sick days per person, not the total.',
      ],
      rubric: [
        'At least three genuinely different explanations (not the same one reworded).',
        'At least one considers a change in what or who was measured.',
        'The test I described would come out differently depending on which explanation is right.',
      ],
    },
  ],
};
