/**
 * Level 2 — "Claims vs. evidence"
 * Audience: teenagers. All people, places, products, companies and messages are invented.
 */
import type { LevelContent, TagItem } from '../types/content';

/** The four-way tag set used across this level. */
const fourTags: TagItem['tagSet'] = [
  { id: 'claim', label: 'Claim', hint: 'Stated as a fact about how things are — but no support is given here.' },
  { id: 'evidence', label: 'Evidence', hint: 'Offered as support, and you could check it: a measurement, a record, a described test.' },
  { id: 'opinion', label: 'Opinion', hint: 'A judgement of taste or value — best, ugly, worth it, should. Not true or false like a fact.' },
  { id: 'appeal', label: 'Emotional appeal', hint: 'Aims at your feelings — fear, guilt, excitement, fitting in — instead of giving a reason.' },
];

const claimEvidence: TagItem['tagSet'] = fourTags.slice(0, 2);

export const level2: LevelContent = {
  level: 2,
  title: 'Claims vs. evidence',
  arcStep: 'Doubting claims',
  audience: 'Teenager',
  coreIdea:
    'Separate what someone claims from the evidence they offer. Notice who benefits if you believe it. And ask what evidence would change your mind — if the answer is “nothing”, you’re taking sides, not thinking.',

  screens: [
    {
      id: 'l2-s1',
      title: 'What’s claimed, and what’s the evidence?',
      skills: ['evidence-evaluation'],
      visual: { kind: 'arc', highlight: 2 },
      body: [
        'A **claim** is what someone wants you to believe. **Evidence** is what they give you to support it — something you could, at least in principle, go and check.',
        'Lots of messages are all claim and no evidence. Ads, posts and arguments often repeat a claim in different words, which can *feel* like support. It isn’t.',
        'So the first move is to sort: which sentences are telling me what to believe, and which are giving me a reason to?',
      ],
      example: {
        title: 'Worked example: the energy drink ad',
        body: [
          'An ad for Voltberry (a made-up drink) says: “Voltberry sharpens your focus. Gamers everywhere swear by it. In our lab, 30 volunteers did a reaction-time test before and after a can; average reaction time improved by 0.02 seconds.”',
          '“Voltberry sharpens your focus” — **claim**. “Gamers everywhere swear by it” — that’s just the claim again, said by more people; still no reason. The lab test — **evidence**: something was measured, and you can see how.',
          'Now you can judge the evidence itself: 30 people, the company’s own lab, a tiny difference, and no comparison group who drank something else. Sorting first is what lets you ask those questions.',
        ],
      },
      check: {
        id: 'l2-c01',
        type: 'tag',
        level: 2,
        skills: ['evidence-evaluation'],
        kind: 'application',
        lessonRef: 'l2-s1',
        scenario: {
          label: 'Product page (fictional)',
          body: 'From the website for Snoozewell, a sleep app.',
        },
        prompt: 'Tag each sentence as a claim or as evidence.',
        tagSet: claimEvidence,
        segments: [
          { id: 's1', text: 'Snoozewell helps you fall asleep faster.', answer: 'claim', why: 'This is what they want you to believe. Nothing here supports it.' },
          {
            id: 's2',
            text: 'In a two-week trial, 80 users kept sleep diaries: half used Snoozewell and half used a plain white-noise app.',
            answer: 'evidence',
            why: 'A described test with a comparison group. You could ask to see the diaries.',
          },
          { id: 's3', text: 'It’s the smarter way to sleep.', answer: 'claim', why: 'A slogan restating the claim. (You could also call it opinion — either way, it isn’t evidence.)' },
          {
            id: 's4',
            text: 'The Snoozewell group fell asleep 6 minutes sooner on average, according to their diaries.',
            answer: 'evidence',
            why: 'A result from the trial, with a number you could check against the data.',
          },
        ],
      },
    },
    {
      id: 'l2-s2',
      title: 'Opinions and emotional appeals',
      skills: ['evidence-evaluation', 'bias-awareness'],
      body: [
        'Two more things show up alongside claims and evidence. An **opinion** is a judgement of taste or value: “the best”, “ugly”, “worth every penny”, “you should”. Opinions aren’t wrong to have — but they aren’t facts, and they can’t support a factual claim.',
        'An **emotional appeal** tries to move you through feelings — fear, guilt, excitement, wanting to fit in — instead of giving you a reason. “Don’t be the only one left out!” is pressure, not evidence.',
        'A good test: if you took this sentence away, would you have any less reason to believe the claim? If not, it was doing a different job.',
      ],
      example: {
        title: 'Worked example: the phone ad',
        body: [
          '“The Kestrel X9 (a made-up phone) has a battery that lasts two full days. Independent testers at Ferrow Labs ran video until it died: 41 hours. It’s the most beautiful phone ever made. Can you really risk your phone dying when it matters most?”',
          'Two full days — **claim**. Ferrow Labs’ 41-hour test — **evidence**. Most beautiful phone ever — **opinion**. Can you risk it? — **emotional appeal** (fear).',
          'Notice that the evidence (41 hours of video) doesn’t quite match the claim (two full days of normal use). Sorting the sentences is what makes that gap visible.',
        ],
      },
      check: {
        id: 'l2-c02',
        type: 'tag',
        level: 2,
        skills: ['evidence-evaluation', 'bias-awareness'],
        kind: 'application',
        lessonRef: 'l2-s2',
        scenario: { label: 'Poster (fictional)', body: 'A poster for the Thornbury Climbing Wall.' },
        prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
        tagSet: fourTags,
        segments: [
          { id: 's1', text: 'Climbing is the coolest sport there is.', answer: 'opinion', why: '“Coolest” is a judgement of taste.' },
          {
            id: 's2',
            text: 'Climbing builds grip strength.',
            answer: 'claim',
            why: 'A factual statement that could be checked — but the poster gives no support for it.',
          },
          {
            id: 's3',
            text: 'Last term, our beginners’ class measured grip strength with a hand meter in week 1 and week 10; the average went up by a fifth.',
            answer: 'evidence',
            why: 'A described measurement, before and after. You could ask how many people and what the numbers were.',
          },
          {
            id: 's4',
            text: 'All your friends will be there — don’t miss out!',
            answer: 'appeal',
            why: 'It works on wanting to fit in, not on any reason about climbing.',
          },
        ],
      },
    },
    {
      id: 'l2-s3',
      title: 'Who benefits if you believe it?',
      skills: ['source-incentives', 'trust-calibration'],
      body: [
        'Every source has reasons for saying what it says. Ask: **who benefits if I believe this?** A company selling a product, an influencer paid to post, a club wanting members — all gain from your belief.',
        'An incentive doesn’t make a claim false. Companies often tell the truth about their products. But it means you should want evidence that doesn’t depend on trusting them — an independent test, a comparison they didn’t control.',
        'Incentives aren’t always money. People also gain attention, status, or the comfort of being proved right.',
      ],
      example: {
        title: 'Worked example: the review site',
        body: [
          'Top5Trainers.com (made-up) ranks the Swiftsole Glide as “the best running shoe of the year”. Scrolling down, Isla finds small print: the site earns money every time someone buys through its links — and the Glide link pays the most.',
          'That doesn’t prove the ranking is wrong. But the site benefits from steering her towards the Glide, whether or not it’s best.',
          'So Isla looks for something the site doesn’t control: a running club’s comparison where members tried several shoes, and reviews from people who bought them with their own money.',
        ],
      },
      check: {
        id: 'l2-c03',
        type: 'mc',
        level: 2,
        skills: ['source-incentives'],
        kind: 'application',
        lessonRef: 'l2-s3',
        scenario: {
          label: 'Video description (fictional)',
          body: 'Gaming streamer PixelPip: “Honestly the Ravenclaw Pro headset changed my life. Best sound I’ve ever heard. Link below for 10% off! (Ravenclaw sent me this headset.)”',
        },
        prompt: 'What’s the most sensible way to treat PixelPip’s review?',
        options: [
          {
            id: 'a',
            text: 'Treat it as an ad: PixelPip benefits if you buy. Look for comparisons from reviewers who bought headsets themselves.',
            correct: true,
            explanation:
              'PixelPip got the headset free and probably earns from the discount link. They might genuinely love it — but you need evidence from someone with nothing to gain.',
          },
          {
            id: 'b',
            text: 'Trust it — PixelPip was honest enough to say Ravenclaw sent the headset.',
            correct: false,
            explanation:
              'Tempting, because the honesty is real and deserves credit. But saying you have an incentive doesn’t remove it.',
          },
          {
            id: 'c',
            text: 'Ignore it completely — anything sponsored is a lie.',
            correct: false,
            explanation:
              'Tempting, because it feels properly sceptical. But an incentive doesn’t make a claim false; it means you want independent support. The headset might be great.',
          },
          {
            id: 'd',
            text: 'Check how many followers PixelPip has; if it’s a lot, they’re probably right.',
            correct: false,
            explanation: 'Followers measure popularity, not how well someone tests headsets — and big channels get more sponsorship.',
          },
        ],
      },
    },
    {
      id: 'l2-s4',
      title: 'What would change your mind?',
      skills: ['bias-awareness', 'evidence-evaluation'],
      body: [
        'Here is a question that separates thinking from taking sides: **what evidence would change my mind?**',
        'If you can name something specific — “if the timings over a month showed the bus was usually late, I’d stop saying it’s reliable” — you’re reasoning. If the honest answer is “nothing could”, you’re defending a team, not looking for what’s true.',
        'A good answer is specific (you’d recognise it if you saw it) and findable (it could actually exist). “If someone proved me wrong” doesn’t count — that’s not naming any evidence.',
      ],
      example: {
        title: 'Worked example: the new coach',
        body: [
          'Ravi is sure the new coach of his five-a-side team, the Dunmore Dragons, is useless. His friend asks: what would change your mind?',
          'First answer: “Nothing — I can just tell.” That’s taking sides.',
          'Second try: “If we win more of our next ten matches than we did of the ten before she arrived, against the same teams, I’d admit she’s helping.” Specific, findable, and fair. Now Ravi can actually find out.',
        ],
      },
      check: {
        id: 'l2-c04',
        type: 'mc',
        level: 2,
        skills: ['bias-awareness'],
        kind: 'application',
        lessonRef: 'l2-s4',
        prompt:
          'Mia believes the school’s new rule — phones locked away at lunch — has made lunchtimes more sociable. Which answer to “what would change your mind?” is best?',
        options: [
          {
            id: 'a',
            text: '“If the lunch supervisors’ notes from before and after the rule showed the same number of students sitting alone, I’d change my mind.”',
            correct: true,
            explanation: 'Specific (students sitting alone, before vs after), findable (supervisors’ notes), and it could really go either way.',
          },
          {
            id: 'b',
            text: '“If someone showed me convincing proof.”',
            correct: false,
            explanation: 'Tempting, because it sounds open-minded. But it doesn’t say what the proof would be, so Mia can always decide nothing is convincing enough.',
          },
          {
            id: 'c',
            text: '“Nothing would — I see it every day.”',
            correct: false,
            explanation: 'Her daily impressions might be right, but if nothing could change her mind, she isn’t testing the belief any more.',
          },
          {
            id: 'd',
            text: '“If most of my friends said they preferred having their phones.”',
            correct: false,
            explanation:
              'This is about whether people *like* the rule, not whether lunch is more sociable. It’s evidence about a different question.',
          },
        ],
      },
    },
  ],

  practice: [
    {
      id: 'l2-p01',
      type: 'tag',
      level: 2,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s2',
      scenario: { label: 'Skincare ad (fictional)', body: 'An advert for Clearbloom face wash.' },
      prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
      tagSet: fourTags,
      segments: [
        { id: 's1', text: 'Clearbloom clears spots in a week.', answer: 'claim', why: 'A checkable statement offered with no support.' },
        {
          id: 's2',
          text: 'Are you tired of hiding your face in every photo?',
          answer: 'appeal',
          why: 'Works on embarrassment. It gives no reason to think the product works.',
        },
        {
          id: 's3',
          text: 'In a four-week test, a skin clinic counted spots on 50 volunteers using Clearbloom and 50 using plain soap.',
          answer: 'evidence',
          why: 'A described test with a comparison group, by a named (if invented) clinic.',
        },
        { id: 's4', text: 'It smells amazing.', answer: 'opinion', why: 'A matter of taste.' },
      ],
    },
    {
      id: 'l2-p02',
      type: 'mc',
      level: 2,
      skills: ['source-incentives'],
      kind: 'application',
      lessonRef: 'l2-s3',
      prompt:
        'Fernvale is deciding whether to build a new car park on the town green. Which of these sources has the *biggest* incentive to say the car park is a great idea, whatever the facts?',
      options: [
        {
          id: 'a',
          text: 'The construction company that would be paid to build it.',
          correct: true,
          explanation: 'They earn money only if it goes ahead. That doesn’t make them wrong, but it’s the strongest pull towards “yes”.',
        },
        {
          id: 'b',
          text: 'A traffic survey that counted cars searching for spaces on six Saturdays.',
          correct: false,
          explanation: 'A count isn’t a person with an interest — though it’s worth asking who ran the survey.',
        },
        {
          id: 'c',
          text: 'Residents who use the green for dog walks.',
          correct: false,
          explanation: 'Tempting, because they do have an interest — but it pulls them towards “no”, not “yes”.',
        },
        {
          id: 'd',
          text: 'A shop owner on the high street.',
          correct: false,
          explanation:
            'Shop owners might gain from more parking, so this is a real incentive — but a smaller and less certain one than being paid to build it.',
        },
      ],
    },
    {
      id: 'l2-p03',
      type: 'rank',
      level: 2,
      skills: ['source-incentives', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l2-s3',
      prompt: 'Is the sea at Tidewell Beach clean enough to swim in this week? Rank these sources, most trustworthy first.',
      entries: [
        {
          id: 'tests',
          label: 'This week’s water-test results, published by the council’s lab',
          why: 'Measured, recent, and about exactly this question.',
        },
        {
          id: 'lifeguard',
          label: 'A lifeguard who checks the warning flags each morning',
          why: 'Close to the source and up to date, but reporting flags rather than testing the water.',
        },
        {
          id: 'cafe',
          label: 'The beach café owner, who says it’s “perfectly clean”',
          why: 'Sees the beach every day, but benefits if people keep coming — and gives no evidence.',
        },
        {
          id: 'video',
          label: 'A video called “TIDEWELL BEACH IS TOXIC!!!” from a channel that sells water filters',
          why: 'Benefits from scaring you, offers no test results, and leans on emotion.',
        },
      ],
      correctOrder: ['tests', 'lifeguard', 'cafe', 'video'],
      rationale:
        'Direct, recent measurements beat reports; reports from people with nothing to sell beat people with an incentive. The video is last: an incentive, no evidence, and an emotional headline.',
    },
    {
      id: 'l2-p04',
      type: 'mc',
      level: 2,
      skills: ['bias-awareness'],
      kind: 'application',
      lessonRef: 'l2-s4',
      scenario: {
        label: 'Forum thread (fictional)',
        body: '**Jonno_88:** The Harbourside Hawks are the best team in the league and that’s that. **Kez:** What would change your mind? **Jonno_88:** …',
      },
      prompt: 'Which reply from Jonno shows he’s thinking rather than taking sides?',
      options: [
        {
          id: 'a',
          text: '“If they finish below Ironbridge in the table again this season, I’d have to say Ironbridge are better.”',
          correct: true,
          explanation: 'He names a specific, checkable result that would count against his view.',
        },
        {
          id: 'b',
          text: '“League tables don’t tell you anything — you have to watch the games.”',
          correct: false,
          explanation:
            'Tempting, because there’s some truth in it. But he’s dismissing evidence in advance without naming what *would* count.',
        },
        {
          id: 'c',
          text: '“Nothing. Real fans don’t switch.”',
          correct: false,
          explanation: 'Loyalty is fine — but “nothing could change my mind” is the definition of taking sides.',
        },
        {
          id: 'd',
          text: '“If an expert told me I was wrong.”',
          correct: false,
          explanation: 'Which expert, saying what, based on what? This names no evidence at all.',
        },
      ],
    },
    {
      id: 'l2-p05',
      type: 'reflection',
      level: 2,
      skills: ['bias-awareness'],
      kind: 'application',
      lessonRef: 'l2-s4',
      prompt:
        'Pick something you feel fairly strongly about — a food, a game, a band, a school rule. What specific evidence would change your mind about it? Could that evidence actually be found?',
      modelAnswers: [
        'I think the school canteen’s new menu is worse. If the canteen’s records showed more students buying lunch since it changed, I’d have to admit most people prefer it.',
        'I think Starfall is a better game than Moonrise. If I played both for the same amount of time and actually kept a note of which one I chose when I had free time, and it was Moonrise, I’d change my mind.',
        'I believe walking to school is quicker than the bus. If I timed both on ten mornings and the bus won most of them, I’d switch.',
      ],
      rubric: [
        'I named a specific belief.',
        'I named specific evidence — something I’d recognise if I saw it.',
        'The evidence could actually be found or collected.',
        'The evidence could really go either way — I didn’t pick something I already know will agree with me.',
      ],
    },
  ],

  bank: [
    {
      id: 'l2-b01',
      type: 'tag',
      level: 2,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s2',
      scenario: { label: 'Forum post (fictional)', body: 'A post on a study-tips forum about the Brainmint focus app.' },
      prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
      tagSet: fourTags,
      segments: [
        { id: 's1', text: 'Brainmint doubles how much you remember from revision.', answer: 'claim', why: 'A big factual statement with no support given.' },
        {
          id: 's2',
          text: 'I scored 58% on my first chemistry mock and 71% on the second, after a month of using it.',
          answer: 'evidence',
          why: 'A real, checkable result — though only one person, with no comparison (they also did a month more revision).',
        },
        { id: 's3', text: 'The design is gorgeous.', answer: 'opinion', why: 'Taste.' },
        {
          id: 's4',
          text: 'If you’re not using it, you’re basically choosing to fail.',
          answer: 'appeal',
          why: 'Fear and guilt, not a reason.',
        },
      ],
    },
    {
      id: 'l2-b02',
      type: 'tag',
      level: 2,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s2',
      scenario: { label: 'School newsletter (fictional)', body: 'From Ashdown Academy’s newsletter, about the new longer lunch break.' },
      prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
      tagSet: fourTags,
      segments: [
        { id: 's1', text: 'The longer lunch break has improved afternoon behaviour.', answer: 'claim', why: 'Stated as fact; no support offered in this sentence.' },
        {
          id: 's2',
          text: 'Afternoon detentions fell from 46 in the autumn term to 29 in the spring term.',
          answer: 'evidence',
          why: 'Numbers from school records that you could check. (Still worth asking: was anything else different in spring?)',
        },
        { id: 's3', text: 'It’s the best decision the school has made in years.', answer: 'opinion', why: 'A value judgement.' },
        {
          id: 's4',
          text: 'Surely nobody wants to go back to rushed, miserable lunchtimes?',
          answer: 'appeal',
          why: 'It works on feelings (“miserable”) and makes disagreeing sound unkind. No reason is given.',
        },
      ],
    },
    {
      id: 'l2-b03',
      type: 'tag',
      level: 2,
      skills: ['evidence-evaluation', 'source-incentives'],
      kind: 'application',
      lessonRef: 'l2-s1',
      scenario: { label: 'Online shop listing (fictional)', body: 'The listing for a PureFlo filter jug.' },
      prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
      tagSet: fourTags,
      segments: [
        { id: 's1', text: 'PureFlo removes 99% of everything harmful from tap water.', answer: 'claim', why: '“Everything harmful” is huge and vague, and there’s no support here.' },
        {
          id: 's2',
          text: 'Think about what your family is drinking right now.',
          answer: 'appeal',
          why: 'Worry about your family — a feeling, not a reason.',
        },
        {
          id: 's3',
          text: 'An independent lab tested water from 12 households before and after filtering; lead levels fell in all 12.',
          answer: 'evidence',
          why: 'A described test with before-and-after measurements. Note it supports “reduces lead”, not “removes everything harmful”.',
        },
        { id: 's4', text: 'It looks great on any kitchen counter.', answer: 'opinion', why: 'Taste.' },
        { id: 's5', text: 'Tap water in most homes is full of dangerous chemicals.', answer: 'claim', why: 'A scary factual statement with no support.' },
      ],
    },
    {
      id: 'l2-b04',
      type: 'tag',
      level: 2,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s1',
      scenario: { label: 'Petition (fictional)', body: 'A petition to keep Wrenfield Library open on Sundays.' },
      prompt: 'Tag each sentence: claim, evidence, opinion or emotional appeal.',
      tagSet: fourTags,
      segments: [
        {
          id: 's1',
          text: 'Sunday is when the library matters most to families.',
          answer: 'claim',
          why: 'Stated as a fact about how people use it — but nothing here shows it.',
        },
        {
          id: 's2',
          text: 'The library’s own door counter recorded an average of 310 visitors on Sundays last year, more than any weekday.',
          answer: 'evidence',
          why: 'A count from a named record. This one *does* support the first sentence.',
        },
        {
          id: 's3',
          text: 'Closing it would rip the heart out of our town.',
          answer: 'appeal',
          why: 'Strong emotional language, not a reason.',
        },
        { id: 's4', text: 'Libraries are the best thing a town can have.', answer: 'opinion', why: 'A value judgement.' },
      ],
    },
    {
      id: 'l2-b05',
      type: 'mc',
      level: 2,
      skills: ['source-incentives', 'evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s3',
      scenario: {
        label: 'News snippet (fictional)',
        body: 'A study paid for by Chewlite, a sugar-free gum company, reports that chewing gum after lunch improved pupils’ afternoon test scores. The study was run by Chewlite’s own research team.',
      },
      prompt: 'What’s the best response?',
      options: [
        {
          id: 'a',
          text: 'Take it as a reason to look for an independent study, and look closely at how this one was done.',
          correct: true,
          explanation:
            'The company benefits from a positive result, and ran the study itself. That doesn’t make it wrong, but it means the result needs checking by someone without a stake.',
        },
        {
          id: 'b',
          text: 'Dismiss it — a company-funded study can’t be trusted.',
          correct: false,
          explanation:
            'Tempting, because the incentive is obvious. But funding isn’t proof of error; some company research is careful. Dismissing it skips the step of checking.',
        },
        {
          id: 'c',
          text: 'Accept it — it’s a study, so it’s evidence.',
          correct: false,
          explanation: 'It is evidence, but how much depends on how it was done and who did it. “It’s a study” isn’t the end of the questions.',
        },
        {
          id: 'd',
          text: 'Ask whether you like chewing gum.',
          correct: false,
          explanation: 'Whether you like gum has nothing to do with whether the study is right.',
        },
      ],
    },
    {
      id: 'l2-b06',
      type: 'mc',
      level: 2,
      skills: ['source-incentives'],
      kind: 'application',
      lessonRef: 'l2-s3',
      scenario: {
        label: 'Press release (fictional)',
        body: 'Glimmer, a streaming service, announces: “A Glimmer survey of 2,000 of our subscribers found that 9 out of 10 teenagers prefer Glimmer Originals to shows on other services.”',
      },
      prompt: 'What’s the biggest problem with this as evidence that teenagers in general prefer Glimmer shows?',
      options: [
        {
          id: 'a',
          text: 'Glimmer only asked its own subscribers — people who already chose Glimmer — and Glimmer benefits from the headline.',
          correct: true,
          explanation:
            'The people asked were picked by their liking for Glimmer, so of course most prefer it. And the company chose what to ask and what to announce.',
        },
        {
          id: 'b',
          text: '2,000 people isn’t enough for a survey.',
          correct: false,
          explanation:
            'Tempting, because small samples are a real problem. But 2,000 is a decent size — the bigger issue is *who* was asked, not how many.',
        },
        {
          id: 'c',
          text: 'Surveys measure what people say, so they’re worthless.',
          correct: false,
          explanation: 'Surveys can be useful when they ask a fair sample a fair question. The problem here is the sample and who ran it.',
        },
        {
          id: 'd',
          text: 'Nothing — 9 out of 10 is a very clear result.',
          correct: false,
          explanation: 'A clear number from a lopsided group is still lopsided.',
        },
      ],
    },
    {
      id: 'l2-b07',
      type: 'mc',
      level: 2,
      skills: ['source-incentives', 'trust-calibration'],
      kind: 'application',
      prompt:
        'Your friend Lou is deciding whether to buy a second-hand bike. Which source of information about the bike’s condition is least affected by an incentive?',
      lessonRef: 'l2-s3',
      options: [
        {
          id: 'a',
          text: 'A bike mechanic Lou pays a flat fee to inspect it, who has no link to the seller.',
          correct: true,
          explanation: 'The mechanic gets paid the same either way, so they have no reason to say it’s better or worse than it is.',
        },
        {
          id: 'b',
          text: 'The seller, who says it’s “in perfect condition”.',
          correct: false,
          explanation: 'The seller benefits from a sale at a good price.',
        },
        {
          id: 'c',
          text: 'The seller’s cousin, who says they rode it last week and it was fine.',
          correct: false,
          explanation: 'Tempting, because they’ve actually ridden it. But they’re connected to the seller.',
        },
        {
          id: 'd',
          text: 'A bike shop that offers to inspect it free — and also sells new bikes.',
          correct: false,
          explanation: 'A free inspection from someone who’d like to sell Lou a new bike has a pull towards finding problems.',
        },
      ],
    },
    {
      id: 'l2-b08',
      type: 'mc',
      level: 2,
      skills: ['source-incentives', 'bias-awareness'],
      kind: 'application',
      lessonRef: 'l2-s3',
      scenario: {
        label: 'Video comment (fictional)',
        body: 'A YouTuber with 400k subscribers posts “The REAL reason the Pinewood Mall is closing — they don’t want you to know!” The video says a secret developer bought it, but shows no documents.',
      },
      prompt: 'Apart from money, what incentive might push this YouTuber to make the story more dramatic than the facts?',
      options: [
        {
          id: 'a',
          text: 'Attention: dramatic “secret” stories get more views and shares.',
          correct: true,
          explanation: 'Incentives aren’t only money. Views, followers and status reward drama, whether or not the drama is true.',
        },
        {
          id: 'b',
          text: 'None — if they’re not selling anything, they have no reason to exaggerate.',
          correct: false,
          explanation: 'Tempting, because we often think of incentives as money. But attention is a powerful reward on its own (and often turns into money).',
        },
        {
          id: 'c',
          text: 'They must be working for the mall’s rivals.',
          correct: false,
          explanation: 'Possible, but there’s nothing here to suggest it. This swaps one unsupported story for another.',
        },
        {
          id: 'd',
          text: 'They want to protect viewers from the developer.',
          correct: false,
          explanation: 'That might be how they see it, but it doesn’t explain why the story is more dramatic than the evidence.',
        },
      ],
    },
    {
      id: 'l2-b09',
      type: 'mc',
      level: 2,
      skills: ['bias-awareness'],
      kind: 'application',
      lessonRef: 'l2-s4',
      prompt: 'Four friends each say something about whether the new Northgate bus route is faster. Which one is taking sides rather than thinking?',
      options: [
        {
          id: 'a',
          text: 'Ade: “It’s slower. I don’t care what the timetable data says — it just feels slower.”',
          correct: true,
          explanation: 'He’s ruled out the obvious evidence in advance. If no evidence counts, it isn’t a question any more.',
        },
        {
          id: 'b',
          text: 'Bea: “I think it’s faster, but I’ve only taken it twice. If the timings for a month say otherwise, I’ll believe them.”',
          correct: false,
          explanation: 'She has a view, but she knows how little it’s based on and names what would change it.',
        },
        {
          id: 'c',
          text: 'Cal: “No idea yet. I’ll time it for a couple of weeks.”',
          correct: false,
          explanation: 'Not taking a side at all — and planning to check.',
        },
        {
          id: 'd',
          text: 'Dot: “The bus company says it’s faster, but they would. I’d like to see someone else’s timings.”',
          correct: false,
          explanation: 'Tempting, because she’s doubting a source. But she isn’t dismissing evidence — she’s asking for independent evidence. That’s thinking.',
        },
      ],
    },
    {
      id: 'l2-b10',
      type: 'mc',
      level: 2,
      skills: ['bias-awareness', 'evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s4',
      prompt:
        'Theo is convinced his cat, Miso, can tell when he’s about to come home, because Miso is always by the door when he arrives. What evidence would best test this?',
      options: [
        {
          id: 'a',
          text: 'A camera recording the door all day for two weeks, to see how often Miso sits there when Theo *isn’t* about to arrive.',
          correct: true,
          explanation:
            'Theo only notices the times Miso is there when he arrives. The camera also catches the times Miso is there and nobody comes — the evidence that could change his mind.',
        },
        {
          id: 'b',
          text: 'Theo writing down every time Miso is at the door when he gets home.',
          correct: false,
          explanation:
            'Tempting, because it’s careful record-keeping. But it only records hits, never misses — so it can only ever agree with him.',
        },
        {
          id: 'c',
          text: 'Asking other cat owners if their cats do the same.',
          correct: false,
          explanation: 'Their stories have the same problem: people remember the hits.',
        },
        {
          id: 'd',
          text: 'Reading that cats have excellent hearing.',
          correct: false,
          explanation: 'That might explain the behaviour if it’s real, but it doesn’t test whether it’s real.',
        },
      ],
    },
    {
      id: 'l2-b11',
      type: 'rank',
      level: 2,
      skills: ['source-incentives', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l2-s3',
      prompt:
        'You want to know how long the battery on the (made-up) Orbit 5 smartwatch really lasts. Rank these sources, most trustworthy first.',
      entries: [
        {
          id: 'lab',
          label: 'A consumer group that buys watches itself and runs the same battery test on every model',
          why: 'Independent, consistent method, and it buys its own watches so the maker can’t pick a good one.',
        },
        {
          id: 'owners',
          label: 'Reviews from 300 verified buyers on a shop site',
          why: 'Lots of real use, but people use watches differently and reviews aren’t a controlled test.',
        },
        { id: 'maker', label: 'The Orbit company’s own battery figure', why: 'Probably measured — but by the company that benefits, in conditions it chose.' },
        {
          id: 'influencer',
          label: 'An influencer who was sent the watch free and says the battery is “insane”',
          why: 'An incentive, no method, and a vague word instead of a number.',
        },
      ],
      correctOrder: ['lab', 'owners', 'maker', 'influencer'],
      rationale:
        'The best source has no stake and a fair, repeatable method. Many independent users come next. The maker probably measured something but chose the conditions; the sponsored influencer gives neither independence nor evidence.',
    },
    {
      id: 'l2-b12',
      type: 'rank',
      level: 2,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l2-s1',
      prompt:
        'Brightwater Juice (made-up) says its new drink “boosts energy”. Rank these from strongest support for that claim to weakest.',
      entries: [
        {
          id: 'trial',
          label: 'A trial where 100 people got either the juice or a look-alike drink without knowing which, and rated their tiredness each hour',
          why: 'A fair comparison: nobody knew which drink they had, so expectations can’t explain a difference.',
        },
        {
          id: 'before-after',
          label: '20 people rated their energy before and after drinking it',
          why: 'Real data, but no comparison — people might feel perkier after any drink, or just expect to.',
        },
        { id: 'testimonial', label: 'A quote from a happy customer: “I feel amazing every morning!”', why: 'One person’s impression, picked by the company.' },
        { id: 'slogan', label: 'The bottle says “Pure energy in every sip”', why: 'The claim again, as a slogan. No support at all.' },
      ],
      correctOrder: ['trial', 'before-after', 'testimonial', 'slogan'],
      rationale:
        'A fair comparison beats a before-and-after with no comparison; any measurement beats a hand-picked quote; and a slogan is just the claim repeated.',
    },
    {
      id: 'l2-b13',
      type: 'reflection',
      level: 2,
      skills: ['source-incentives'],
      kind: 'application',
      lessonRef: 'l2-s3',
      prompt:
        'Think of an ad, post or video that persuaded you recently. Who benefited if you believed it? What would you want to see from someone *without* that incentive?',
      modelAnswers: [
        'A video convinced me a pair of trainers was worth it. The creator had a discount code, so they earned from my purchase. I’d want reviews from people who bought them with their own money after a few months of wear.',
        'A post said a new café was the best in town. It was from the café’s own account. I’d want to hear from regulars who don’t work there, or check a local review site.',
        'An ad said a revision course guaranteed better grades. The company sells the course. I’d want results from students who took it compared with similar students who didn’t.',
      ],
      rubric: [
        'I named who benefited and how (money, attention, status…).',
        'I described evidence from someone without that incentive.',
        'I didn’t just conclude the claim was false because of the incentive.',
      ],
    },
    {
      id: 'l2-b14',
      type: 'mc',
      level: 2,
      skills: ['evidence-evaluation'],
      kind: 'recall',
      lessonRef: 'l2-s2',
      prompt: 'Which best describes an emotional appeal?',
      options: [
        {
          id: 'a',
          text: 'Words that try to move you through feelings like fear, guilt or wanting to fit in, instead of giving a reason.',
          correct: true,
          explanation: 'Yes. The appeal might be to a real feeling — but feelings aren’t evidence that the claim is true.',
        },
        {
          id: 'b',
          text: 'Any statement that makes you feel something.',
          correct: false,
          explanation: 'Tempting, but evidence can be moving too (a shocking but accurate statistic). The question is whether the feeling is doing the work instead of a reason.',
        },
        {
          id: 'c',
          text: 'A personal opinion about what’s good or bad.',
          correct: false,
          explanation: 'That’s an opinion. An appeal targets *your* feelings; an opinion states the speaker’s judgement.',
        },
        {
          id: 'd',
          text: 'A claim that is false.',
          correct: false,
          explanation: 'Emotional appeals can come alongside true or false claims. They’re about how someone persuades, not whether they’re right.',
        },
      ],
    },
  ],
};
