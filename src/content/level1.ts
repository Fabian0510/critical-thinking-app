/**
 * Level 1 — "How do you know?"
 * Audience: anyone; child-friendly language (never condescending).
 * All people, places, products and messages here are invented.
 */
import type { LevelContent, TagItem } from '../types/content';

const saidChecked: TagItem['tagSet'] = [
  { id: 'said', label: 'Someone said it', hint: 'A person told, wrote or posted it — we don’t see how they know.' },
  { id: 'checked', label: 'Someone checked it', hint: 'A person looked, counted, measured or tested — and we can see how.' },
];

export const level1: LevelContent = {
  level: 1,
  title: 'How do you know?',
  arcStep: 'Doubting claims',
  audience: 'Anyone',
  coreIdea:
    'Before believing something, ask how you would know it’s true. Checking isn’t being rude — it’s caring about what’s true.',

  screens: [
    {
      id: 'l1-s1',
      title: 'Ask: how would I know?',
      skills: ['evidence-evaluation', 'trust-calibration'],
      body: [
        'Every day you hear things — from friends, adverts, videos, teachers and family. Some are true, some aren’t, and none of them come with a label saying which.',
        'The most useful habit is one question: **how would I know this is true?** Not “is this person nice?” or “does it sound right?”, but: what would actually show it?',
        'Often the honest answer is “I don’t know yet.” That’s fine. It just means you haven’t checked.',
      ],
      example: {
        title: 'Worked example: the closed pool',
        body: [
          'Maya’s friend Theo tells her: “Glenbrook pool is shut all next week.” (Glenbrook is a made-up town.)',
          'Maya asks herself how she’d know. Theo might be right, but she doesn’t know how *he* knows. She has two good options: ask Theo where he heard it, or look at the pool’s own website — the people who would actually decide to close it.',
          'The website says the pool is shut on Monday only, for cleaning. Theo had heard part of it right. Asking “how would I know?” led Maya straight to the people who knew.',
        ],
      },
      check: {
        id: 'l1-c01',
        type: 'mc',
        level: 1,
        skills: ['evidence-evaluation'],
        kind: 'application',
        lessonRef: 'l1-s1',
        scenario: {
          label: 'Playground conversation (fictional)',
          body: 'Jaz: “The new Starfall game comes out on Friday — my cousin told me.”',
        },
        prompt: 'What’s the most useful question to ask yourself first?',
        options: [
          {
            id: 'a',
            text: 'Who would know the release date for sure, and how could I check with them?',
            correct: true,
            explanation:
              'The company releasing the game would know. Thinking about who would *actually* know points you to the best place to check — their website or announcement.',
          },
          {
            id: 'b',
            text: 'Is Jaz usually honest?',
            correct: false,
            explanation:
              'Tempting, because trust matters. But Jaz can be completely honest and still have heard it wrong from her cousin. Being honest and being right are different things.',
          },
          {
            id: 'c',
            text: 'Does Friday sound about right?',
            correct: false,
            explanation:
              'Tempting, because things that sound right feel true. But how a claim sounds tells you very little about whether it is.',
          },
          {
            id: 'd',
            text: 'Would it be rude to ask Jaz how her cousin knows?',
            correct: false,
            explanation:
              'Asking kindly isn’t rude (more on that later in this level). But even if you worry about it, this question doesn’t help you find out the date.',
          },
        ],
      },
    },
    {
      id: 'l1-s2',
      title: 'Someone said it, or someone checked it?',
      skills: ['evidence-evaluation'],
      body: [
        'There is a big difference between **someone said it** and **someone checked it**.',
        '“Someone said it” means a person told you, wrote it or posted it. “Someone checked it” means a person looked, counted, measured or tested — and you can see how.',
        'Being said lots of times doesn’t turn something into checked. A rumour repeated by twenty people is still a rumour.',
      ],
      example: {
        title: 'Worked example: the plant food',
        body: [
          'Two claims about Growfast plant food (a made-up product):',
          '1. “My uncle says Growfast makes tomatoes twice as big.” — **someone said it.**',
          '2. “Our class grew 10 tomato plants with Growfast and 10 without, in the same soil and the same sunny spot, then weighed the tomatoes.” — **someone checked it**, and told you how.',
          'The second could still contain mistakes. But because you can see what was done, you can judge it. With the first, there is nothing to judge except the uncle.',
        ],
      },
      check: {
        id: 'l1-c02',
        type: 'tag',
        level: 1,
        skills: ['evidence-evaluation'],
        kind: 'application',
        lessonRef: 'l1-s2',
        scenario: { label: 'Notes about a pond (fictional)', body: 'Four things people have said about Hollin Pond.' },
        prompt: 'For each sentence, decide: is it something someone said, or something someone checked?',
        tagSet: saidChecked,
        segments: [
          {
            id: 's1',
            text: 'The park keeper says there are fewer frogs in Hollin Pond this year.',
            answer: 'said',
            why: 'We’re told what the park keeper said, not how they know. They might have counted — but nothing here shows it.',
          },
          {
            id: 's2',
            text: 'Ana counted the frogs at the pond every Saturday morning for six weeks and wrote down the numbers.',
            answer: 'checked',
            why: 'Counting, repeated, and written down — and we’re told how it was done.',
          },
          {
            id: 's3',
            text: 'Everyone on our street knows the pond is getting dirtier.',
            answer: 'said',
            why: '“Everyone knows” sounds convincing, but it’s lots of people saying, not anyone checking.',
          },
          {
            id: 's4',
            text: 'Our class tested the pond water with the science room’s test kit on three different days.',
            answer: 'checked',
            why: 'A test, done more than once, and we know what was used.',
          },
        ],
      },
    },
    {
      id: 'l1-s3',
      title: 'Choosing a good way to check',
      skills: ['evidence-evaluation', 'trust-calibration'],
      body: [
        'Once you’ve asked “how would I know?”, you need a sensible way to find out. Three tips:',
        '**Go closer to the source.** Ask the people who would actually know, or look at the thing itself.',
        '**Check more than once.** One time might be a fluke. **Make it fair.** If you’re comparing two things, test them the same way.',
      ],
      example: {
        title: 'Worked example: the quicker route',
        body: [
          'Kofi thinks the path through the park is a quicker way to school than the road. His sister is sure the road is quicker.',
          'Arguing won’t settle it. So Kofi times both routes, walking at his normal speed, on five different mornings each.',
          'The park path was quicker on four of the five mornings, by about two minutes. Now it isn’t just Kofi’s feeling against his sister’s — it’s been checked, fairly and more than once.',
        ],
      },
      check: {
        id: 'l1-c03',
        type: 'mc',
        level: 1,
        skills: ['evidence-evaluation'],
        kind: 'application',
        lessonRef: 'l1-s3',
        prompt: 'Rosa thinks her dog, Biscuit, prefers his blue bowl to his red one. Which is the best way to check?',
        options: [
          {
            id: 'a',
            text: 'Put the same food in both bowls, side by side, on several days — swapping which side each bowl is on — and see which he eats from first.',
            correct: true,
            explanation:
              'Same food, both bowls at once, sides swapped, several days: it’s fair and repeated. If Biscuit still goes to blue first, that’s real evidence.',
          },
          {
            id: 'b',
            text: 'Put the blue bowl in Biscuit’s usual spot and the red bowl in the hallway, and see which he eats from.',
            correct: false,
            explanation:
              'Tempting, because it is a real test. But it isn’t fair: Biscuit might just go to his usual spot, whatever colour the bowl is.',
          },
          {
            id: 'c',
            text: 'Put food in the blue bowl once and see if he eats it.',
            correct: false,
            explanation:
              'It is a check, but it doesn’t compare with the red bowl, and it’s only once. Most dogs will eat food from any bowl.',
          },
          {
            id: 'd',
            text: 'Ask her friends which bowl they think Biscuit likes.',
            correct: false,
            explanation:
              'Her friends’ guesses are “someone said it”. They don’t know any more about Biscuit than Rosa does.',
          },
        ],
      },
    },
    {
      id: 'l1-s4',
      title: 'Checking is caring, not being rude',
      skills: ['trust-calibration', 'evidence-evaluation'],
      body: [
        'Some people feel that asking “how do you know?” is rude, as if you’re calling someone a liar. It isn’t. It shows you care about what’s true — and most people would rather know if they’ve got something wrong.',
        'How you ask matters. “Where did you hear that? I’d like to have a look” is friendly. “That’s rubbish” isn’t — and it doesn’t find anything out.',
        'You can’t check everything yourself. Often the smart move is to find someone who *did* check — the people running the pool, a doctor, an official notice — and see how they know.',
      ],
      example: {
        title: 'Worked example: the family group message',
        body: [
          'A message in Leo’s family group chat says: “Frostfizz drinks have been banned in three countries! Share with everyone you love!” (Frostfizz is a made-up drink, and this message is invented.)',
          'Leo doesn’t want to upset his aunt, who posted it. He replies: “Thanks for looking out for us! Do you know where this came from? I’d like to read more.”',
          'He hasn’t accused anyone of anything — and now the family is thinking about where the message came from, instead of just passing it on.',
        ],
      },
      check: {
        id: 'l1-c04',
        type: 'mc',
        level: 1,
        skills: ['trust-calibration'],
        kind: 'application',
        lessonRef: 'l1-s4',
        prompt: 'Your friend says, “Bats are completely blind.” You’re not sure. What’s the best thing to say?',
        options: [
          {
            id: 'a',
            text: '“Really? How do you know? Let’s look it up together.”',
            correct: true,
            explanation: 'Curious, friendly, and it leads to actually checking — together, so nobody is on the spot.',
          },
          {
            id: 'b',
            text: '“That’s wrong — everyone knows that’s a myth.”',
            correct: false,
            explanation:
              'You might even be right, but “everyone knows” isn’t checking either — and it turns a question into an argument.',
          },
          {
            id: 'c',
            text: 'Say nothing, so you don’t seem rude.',
            correct: false,
            explanation:
              'Tempting, because it keeps the peace. But then neither of you finds out — and asking kindly isn’t rude.',
          },
          {
            id: 'd',
            text: '“My older sister would know. I’ll just believe whatever she says.”',
            correct: false,
            explanation:
              'Asking someone who knows more can be smart — but “whatever she says” skips the important part: how does *she* know?',
          },
        ],
      },
    },
  ],

  practice: [
    {
      id: 'l1-p01',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation', 'source-incentives'],
      kind: 'application',
      lessonRef: 'l1-s2',
      scenario: { label: 'Advert (fictional)', body: '**SuperSnack bars:** 9 out of 10 kids say they’re the tastiest snack ever!' },
      prompt: 'Is this something someone said, or something someone checked?',
      options: [
        {
          id: 'a',
          text: 'Mostly “someone said it” — it’s kids’ opinions, reported by the company that sells the bars.',
          correct: true,
          explanation:
            'Even if the company really did ask some kids, what it collected is what kids *said*. We aren’t told which kids, how many, or what they were compared with — and the company wants you to buy the bars.',
        },
        {
          id: 'b',
          text: '“Someone checked it” — they did a survey.',
          correct: false,
          explanation:
            'Tempting: a survey sounds like checking. But it only checks what people say, and we aren’t shown how it was done — maybe it was 10 kids who were given free bars.',
        },
        {
          id: 'c',
          text: '“Someone checked it” — 9 out of 10 is a number, so it was measured.',
          correct: false,
          explanation:
            'Numbers feel scientific, but a number can come from a tiny or unfair group, or be made up. A number on its own doesn’t show how anything was checked.',
        },
      ],
    },
    {
      id: 'l1-p02',
      type: 'rank',
      level: 1,
      skills: ['trust-calibration', 'evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s3',
      prompt: 'Ben hears that the Ashby school fair has been cancelled. Rank these ways of finding out, best first.',
      entries: [
        { id: 'letter', label: 'Read the head teacher’s letter on the school website', why: 'The school decides whether the fair happens, so this is the source itself.' },
        { id: 'teacher', label: 'Ask his teacher, who would have been told', why: 'Very close to the source, though teachers can be busy or miss a message.' },
        { id: 'friend', label: 'Ask a friend in another class if they’ve heard anything', why: 'Just another person who may have heard the same rumour.' },
        { id: 'weather', label: 'Decide based on whether it’s been raining a lot', why: 'A guess. It doesn’t involve anyone who knows.' },
      ],
      correctOrder: ['letter', 'teacher', 'friend', 'weather'],
      rationale: 'The closer you get to the people who actually make the decision, the more you can rely on the answer. Guessing from clues is last because no one who knows is involved.',
    },
    {
      id: 'l1-p03',
      type: 'tag',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s2',
      scenario: {
        label: 'School newsletter (fictional)',
        body: 'Four sentences from the Brookside School bake-sale report.',
      },
      prompt: 'For each sentence, decide: said, or checked?',
      tagSet: saidChecked,
      segments: [
        { id: 's1', text: 'We counted the money twice at the end of the day: £214.50.', answer: 'checked', why: 'Counted — twice — and we’re given the result.' },
        { id: 's2', text: 'People are saying the lemon cake was the best thing on sale.', answer: 'said', why: '“People are saying” is a report of opinions, not a check.' },
        { id: 's3', text: 'Mrs Abara reckons next year will be even bigger.', answer: 'said', why: 'A guess about the future from one person.' },
        { id: 's4', text: 'We kept a tally of every cake sold: chocolate brownies sold out first, at 11:40.', answer: 'checked', why: 'A tally recorded as it happened, with a time.' },
      ],
    },
    {
      id: 'l1-p04',
      type: 'mc',
      level: 1,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s4',
      prompt: 'You find a mushroom in the woods near Tarnside and wonder if it’s safe to eat. Whose answer should you trust most?',
      options: [
        {
          id: 'a',
          text: 'A mushroom expert who looks at it in person — and until then, don’t eat it.',
          correct: true,
          explanation:
            'Some mushrooms are dangerous and look like safe ones. An expert who examines it has checked many mushrooms and knows what to look for. When a mistake could hurt you, you need the best checker you can find.',
        },
        {
          id: 'b',
          text: 'A video that says “all white mushrooms are safe”.',
          correct: false,
          explanation:
            'A simple rule from a stranger is “someone said it”, and simple rules like this are exactly the kind that can be badly wrong. You can’t see how they checked.',
        },
        {
          id: 'c',
          text: 'A friend who once picked mushrooms with their grandparents.',
          correct: false,
          explanation:
            'Tempting, because they have some experience. But once isn’t much, and this is a question where being wrong really matters.',
        },
        {
          id: 'd',
          text: 'Whether it smells nice.',
          correct: false,
          explanation: 'How something smells is a clue, but it isn’t a check of whether it’s safe.',
        },
      ],
    },
    {
      id: 'l1-p05',
      type: 'reflection',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s1',
      prompt:
        'Think of something you believe but have never checked — maybe about animals, food, or your town. How could you check it? Who would actually know?',
      modelAnswers: [
        'I believe the library opens at 9 on Saturdays. I could check the sign on the door or the library’s website, because the library sets the times.',
        'I believe carrots help you see in the dark. I’ve only heard people say it. I could look for what eye doctors or a science website say, and how they know.',
        'I think our street is busier in the morning than the evening. I could count the cars for ten minutes at 8am and at 6pm, on a few different days.',
      ],
      rubric: [
        'I named something specific that I believe.',
        'I described a real way to check it (looking, counting, testing, or asking someone who would know).',
        'I said who would know, or why my way of checking would work.',
      ],
    },
  ],

  bank: [
    {
      id: 'l1-b01',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s1',
      scenario: {
        label: 'Class group chat (fictional)',
        body: 'Priya: OMG Riverside Fun Park is giving FREE tickets to everyone who shares this message 10 times!!! My sister’s friend got one 🎢',
      },
      prompt: 'What’s the most sensible thing to do before sharing it?',
      options: [
        {
          id: 'a',
          text: 'Look on Riverside Fun Park’s own website or page for the offer.',
          correct: true,
          explanation:
            'The park is the one who’d be giving the tickets, so it’s the place that would know. If the offer isn’t there, that tells you a lot.',
        },
        {
          id: 'b',
          text: 'Ask the others in the chat whether they’ve heard about it.',
          correct: false,
          explanation:
            'Tempting, because lots of people agreeing feels like checking. But they probably saw the same message. Repeating isn’t checking.',
        },
        {
          id: 'c',
          text: 'Believe it, because Priya’s sister’s friend got one.',
          correct: false,
          explanation:
            'A friend of a sister is three steps away from anyone who checked. It’s still “someone said it”.',
        },
        {
          id: 'd',
          text: 'Share it — if it isn’t true, no harm done.',
          correct: false,
          explanation:
            'Sharing feels harmless, but it spreads something nobody has checked — and messages promising prizes for sharing are a common trick. It also doesn’t tell you whether it’s true.',
        },
      ],
    },
    {
      id: 'l1-b02',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s2',
      prompt: 'People at Fernley School think the canteen pizza slices have got smaller. Which of these describes someone *checking*, not just saying?',
      options: [
        {
          id: 'a',
          text: 'Zoe measured the pizza slices with a ruler every Friday for a month and wrote down the sizes.',
          correct: true,
          explanation: 'Measuring, repeated, recorded. We know exactly what she did, so we can judge it — and compare with last year if there are records.',
        },
        {
          id: 'b',
          text: 'Mr Patel, the PE teacher, said the slices look smaller than they used to.',
          correct: false,
          explanation: 'A teacher is a grown-up we might trust, but what he gave is his impression. Nothing here shows he checked.',
        },
        {
          id: 'c',
          text: 'Lots of people in Year 6 are saying the pizza has shrunk.',
          correct: false,
          explanation: 'Lots of people saying something can feel like proof, but it’s still saying. They may all have heard it from each other.',
        },
        {
          id: 'd',
          text: 'A poster by the student council says the pizza is smaller than last year.',
          correct: false,
          explanation:
            'The council might have checked — but the poster doesn’t say how, so as far as you can tell it’s someone saying it. You’d want to ask them how they know.',
        },
      ],
    },
    {
      id: 'l1-b03',
      type: 'rank',
      level: 1,
      skills: ['evidence-evaluation', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s3',
      prompt:
        'Amara wants to know if the corner shop on Mill Lane sells her favourite cereal, Crunchloops. Rank these ways of finding out, best first.',
      entries: [
        { id: 'look', label: 'Go into the shop and look on the shelves', why: 'Looking at the thing itself, today.' },
        { id: 'neighbour', label: 'Ask her neighbour, who shops there every week', why: 'Someone who sees the shelves often and recently — but might not notice cereal.' },
        { id: 'oldlist', label: 'Read a list of the shop’s products from five years ago', why: 'Real information, but probably out of date.' },
        { id: 'guess', label: 'Assume it doesn’t, because it’s a small shop', why: 'A guess. Nobody has looked.' },
      ],
      correctOrder: ['look', 'neighbour', 'oldlist', 'guess'],
      rationale:
        'Looking yourself is closest to the source. A regular shopper is close and up to date; an old list was once checked but may no longer be true; a guess involves no checking at all.',
    },
    {
      id: 'l1-b04',
      type: 'tag',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s2',
      scenario: { label: 'Neighbourhood newsletter (fictional)', body: 'From the Oakfield Road residents’ newsletter, about the new zebra crossing.' },
      prompt: 'For each sentence, decide: said, or checked?',
      tagSet: saidChecked,
      segments: [
        {
          id: 's1',
          text: 'Mr Lowe from number 12 says drivers are going much slower since the crossing went in.',
          answer: 'said',
          why: 'His impression, reported. We don’t know how he knows.',
        },
        {
          id: 's2',
          text: 'Volunteers counted the cars passing between 8 and 9am on five mornings before the crossing and five mornings after.',
          answer: 'checked',
          why: 'Counting, at the same time of day, before and after — and we’re told how.',
        },
        {
          id: 's3',
          text: 'It’s obviously made the road safer.',
          answer: 'said',
          why: '“Obviously” is a sign of someone telling you, not showing you.',
        },
        {
          id: 's4',
          text: 'The council’s speed camera recorded the average speed each week; it has gone from 31 to 24 miles per hour.',
          answer: 'checked',
          why: 'A measurement taken every week, with the numbers given.',
        },
        {
          id: 's5',
          text: 'My friend on the next street heard the crossing will be taken away next year.',
          answer: 'said',
          why: 'Something heard from someone else — a rumour until checked.',
        },
      ],
    },
    {
      id: 'l1-b05',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s1',
      scenario: {
        label: 'Video caption (fictional)',
        body: 'Scientist PROVES the Moonbeam mattress gives you 3 extra hours of sleep! 😴 #ad',
      },
      prompt: 'What would you most want to know before believing this?',
      options: [
        {
          id: 'a',
          text: 'How the scientist checked — what they measured, on how many people, and compared with what.',
          correct: true,
          explanation:
            '“Proves” is a big word. The only way to judge it is to see how it was checked. (The “#ad” matters too — it means someone was paid. Level 2 looks at that.)',
        },
        {
          id: 'b',
          text: 'Whether the scientist is wearing a lab coat.',
          correct: false,
          explanation: 'A lab coat makes someone *look* like a scientist. It tells you nothing about how the claim was checked.',
        },
        {
          id: 'c',
          text: 'How many likes the video has.',
          correct: false,
          explanation: 'Likes show how many people enjoyed the video, not whether it’s true.',
        },
        {
          id: 'd',
          text: 'Whether the mattress looks comfortable.',
          correct: false,
          explanation: 'Looking comfortable and giving you three extra hours of sleep are very different things.',
        },
      ],
    },
    {
      id: 'l1-b06',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation', 'alternative-explanations'],
      kind: 'application',
      lessonRef: 'l1-s3',
      prompt:
        'There are scratching noises in Nadia’s loft at night. Her mum thinks it’s mice; her dad thinks it’s the water pipes. What’s the best way to find out?',
      options: [
        {
          id: 'a',
          text: 'Look in the loft for droppings or chewed things, and note whether the noise only happens when the heating is on.',
          correct: true,
          explanation:
            'This checks *both* ideas: signs of mice would support Mum; noises that match the heating would support Dad. A good check can tell the ideas apart.',
        },
        {
          id: 'b',
          text: 'Go with Mum’s idea, because she heard the noise first.',
          correct: false,
          explanation: 'Hearing it first doesn’t mean knowing what it is. Nobody has looked yet.',
        },
        {
          id: 'c',
          text: 'Search online for “scratching in loft” and pick the most common answer.',
          correct: false,
          explanation:
            'Tempting, because lots of answers feel like evidence. But it tells you what’s common in *other* lofts, not what’s in this one.',
        },
        {
          id: 'd',
          text: 'Wait and see whether the noise stops.',
          correct: false,
          explanation: 'Whether it stops or not, it wouldn’t tell you which idea is right.',
        },
      ],
    },
    {
      id: 'l1-b07',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s4',
      scenario: {
        label: 'School assembly (fictional)',
        body: 'A visiting speaker at Westmere School says: “Children who eat breakfast do better at school.” Freya wants to ask a question.',
      },
      prompt: 'Which question would help most?',
      options: [
        {
          id: 'a',
          text: '“How do you know — was it tested, and how?”',
          correct: true,
          explanation: 'It’s polite, and it goes straight to the important part: how the claim was checked.',
        },
        {
          id: 'b',
          text: '“My cousin never eats breakfast and he’s top of his class — so that’s wrong, isn’t it?”',
          correct: false,
          explanation:
            'Tempting, because it feels like disproof. But the claim is about children *in general*; one cousin can’t show what’s true for most children.',
        },
        {
          id: 'c',
          text: '“Is that true?”',
          correct: false,
          explanation: 'The speaker will almost certainly say yes. Asking *how* they know gets you much more.',
        },
        {
          id: 'd',
          text: '“So should everyone eat breakfast from now on?”',
          correct: false,
          explanation: 'This jumps straight to acting on the claim without asking how it was checked.',
        },
      ],
    },
    {
      id: 'l1-b08',
      type: 'rank',
      level: 1,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s3',
      prompt: 'You want to know what time Larkfield Library closes this Saturday. Rank these, best first.',
      entries: [
        { id: 'site', label: 'The library’s website, which lists this week’s opening hours', why: 'The library sets its own hours, and this is for this week.' },
        { id: 'librarian', label: 'What a librarian told you last month', why: 'Came from the source, but a month ago — hours sometimes change.' },
        { id: 'friend', label: 'A friend who went there one Saturday last year', why: 'Some real experience, but old and only once.' },
        { id: 'guess', label: 'A guess that libraries usually close at 5', why: 'A guess about libraries in general, not this one.' },
      ],
      correctOrder: ['site', 'librarian', 'friend', 'guess'],
      rationale: 'Closest to the source and most up to date wins. A general guess is last because it isn’t about this library at all.',
    },
    {
      id: 'l1-b09',
      type: 'tag',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s2',
      scenario: { label: 'Messages between friends (fictional)', body: 'Talk about whether a new skate park is coming to Penrose.' },
      prompt: 'For each message, decide: said, or checked?',
      tagSet: saidChecked,
      segments: [
        { id: 's1', text: 'Dev: My brother says they’re building a skate park by the river.', answer: 'said', why: 'Passed on from his brother; no sign of how he knows.' },
        {
          id: 's2',
          text: 'Mo: I looked up the council’s planning page — there’s an approved plan for a skate park, dated last month.',
          answer: 'checked',
          why: 'Mo went to the people who would decide and tells us what he found.',
        },
        { id: 's3', text: 'Ellie: I reckon it’ll be the biggest one in the county.', answer: 'said', why: 'A guess.' },
        {
          id: 's4',
          text: 'Kit: I walked past the river this morning — there are fences up and a sign saying “Skate park: opening spring”.',
          answer: 'checked',
          why: 'Kit looked at the place itself and describes exactly what he saw.',
        },
      ],
    },
    {
      id: 'l1-b10',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation', 'source-incentives'],
      kind: 'application',
      scenario: {
        label: 'Cereal box (fictional)',
        body: 'Danny Reyes, the fastest striker in the Coastal League, starts every day with **Powerpop**! FUEL FOR CHAMPIONS.',
      },
      lessonRef: 'l1-s3',
      prompt: 'Which of these, if it were true, would be someone actually *checking* whether Powerpop helps people run faster?',
      options: [
        {
          id: 'a',
          text: 'Two groups of runners — one eating Powerpop, one eating a similar cereal — timed before and after a month.',
          correct: true,
          explanation: 'A fair comparison, with timing. It’s the only option that could show whether the cereal makes a difference.',
        },
        {
          id: 'b',
          text: 'Danny Reyes says he loves Powerpop.',
          correct: false,
          explanation: 'Danny can love it and still be fast for other reasons — training, for a start. And he’s probably being paid to say it.',
        },
        {
          id: 'c',
          text: 'The box says “Fuel for champions”.',
          correct: false,
          explanation: 'That’s the company describing its own product. It’s a slogan, not a check.',
        },
        {
          id: 'd',
          text: 'In the TV advert, lots of fast runners are shown eating Powerpop.',
          correct: false,
          explanation: 'Tempting, because it shows lots of examples. But the advert chose them — and they were fast before the advert.',
        },
      ],
    },
    {
      id: 'l1-b11',
      type: 'mc',
      level: 1,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s1',
      prompt:
        'Oli heard from Sam, who heard from Kim, who read a sign at Brindle swimming pool, that the pool is closed on Tuesday. Who is closest to knowing for sure?',
      options: [
        {
          id: 'a',
          text: 'The pool staff who put up the sign.',
          correct: true,
          explanation: 'They decide when the pool closes. Every step away from them is a chance for the message to change.',
        },
        {
          id: 'b',
          text: 'Kim, because she read the sign herself.',
          correct: false,
          explanation: 'Kim is the closest *person in the chain*, and that’s why this is tempting — but she’s still reporting the sign. The sign’s authors are closer still.',
        },
        {
          id: 'c',
          text: 'Sam, because he’s in the middle and can check with both sides.',
          correct: false,
          explanation: 'Being in the middle of a chain doesn’t give anyone extra knowledge.',
        },
        {
          id: 'd',
          text: 'Oli, because he heard it most recently.',
          correct: false,
          explanation: 'Hearing something recently doesn’t make it more accurate — it may have changed at every step.',
        },
      ],
    },
    {
      id: 'l1-b12',
      type: 'rank',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l1-s2',
      prompt:
        'Someone keeps eating the fish food from the tub by the Kerrs’ garden pond. Mia wonders if it’s her grey cat, Pepper. Rank this evidence, strongest first.',
      entries: [
        { id: 'video', label: 'A garden camera recorded Pepper at the fish-food tub at night.', why: 'Direct evidence of Pepper at the tub.' },
        { id: 'flakes', label: 'Pepper has had fish-food flakes on her whiskers some mornings.', why: 'A strong clue that points to Pepper, though there could be another explanation.' },
        { id: 'greycat', label: 'Mr Kerr saw a grey cat near the pond one evening.', why: 'Fits Pepper, but there are lots of grey cats, and he only saw it near the pond.' },
        { id: 'cats', label: 'Pepper is a cat, and cats like fish.', why: 'True of every cat, so it doesn’t point to Pepper at all.' },
      ],
      correctOrder: ['video', 'flakes', 'greycat', 'cats'],
      rationale:
        'The best evidence points to Pepper and not to anyone else. A video of Pepper does that; a fact about all cats doesn’t.',
    },
    {
      id: 'l1-b13',
      type: 'reflection',
      level: 1,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l1-s4',
      prompt:
        'A friend tells you a surprising “fact”. Write what you could say to find out how they know — without making them feel accused.',
      modelAnswers: [
        '“Oh, I didn’t know that! Where did you hear it? I’d like to read about it too.”',
        '“That’s interesting — do you remember where it came from? Let’s look it up together.”',
        '“Huh, I’d heard something different. Want to check which one is right?”',
      ],
      rubric: [
        'It asks where the information came from or how it could be checked.',
        'It sounds curious or friendly, not like an accusation.',
        'It invites checking together rather than just arguing.',
      ],
    },
    {
      id: 'l1-b14',
      type: 'mc',
      level: 1,
      skills: ['evidence-evaluation'],
      kind: 'recall',
      lessonRef: 'l1-s2',
      prompt: 'Which of these best describes the difference between “someone said it” and “someone checked it”?',
      options: [
        {
          id: 'a',
          text: 'Checking means someone looked, counted, measured or tested — and you can see how they did it.',
          correct: true,
          explanation: 'Yes. The important part is that the method is visible, so you can judge it.',
        },
        {
          id: 'b',
          text: 'Checking means lots of different people have said the same thing.',
          correct: false,
          explanation: 'Tempting, because agreement feels like checking. But many people can repeat the same unchecked thing.',
        },
        {
          id: 'c',
          text: 'Checking means a grown-up or an expert said it.',
          correct: false,
          explanation: 'Experts often *have* checked, which is why this is tempting — but what matters is the checking, not who’s talking.',
        },
        {
          id: 'd',
          text: 'Checking means it was written down rather than spoken.',
          correct: false,
          explanation: 'Writing something down doesn’t check it. Plenty of written things are just someone saying.',
        },
      ],
    },
  ],
};
