/**
 * Level 5 — "Thinking about thinking"
 * Audience: experts. All people, places, organisations and sources are invented, except the brief
 * descriptions of Willingham's and Mercier & Sperber's ideas, kept to the level of detail in the brief.
 */
import type { LevelContent, TagItem } from '../types/content';

const trustTags: TagItem['tagSet'] = [
  { id: 'trust', label: 'Reason to trust', hint: 'Bears on whether this source is likely to be right about this question — in its favour.' },
  { id: 'caution', label: 'Reason for caution', hint: 'Bears on whether this source is likely to be right about this question — against it.' },
  { id: 'irrelevant', label: 'Not relevant', hint: 'May be impressive or off-putting, but doesn’t bear on whether they’re right about this.' },
];

export const level5: LevelContent = {
  level: 5,
  title: 'Thinking about thinking',
  arcStep: 'Knowing when and whom to trust',
  audience: 'Expert',
  coreIdea:
    'Critical thinking leans on knowledge, and most knowledge comes from other people. The real skill is calibrating whom to trust, noticing when your scepticism is selective, and knowing when you don’t know enough — or when to stop deliberating.',

  screens: [
    {
      id: 'l5-s1',
      title: 'Thinking skills run on knowledge',
      skills: ['trust-calibration', 'evidence-evaluation'],
      visual: { kind: 'arc', highlight: 5 },
      body: [
        'Everything so far could suggest that critical thinking is a general-purpose tool: learn the moves, apply them anywhere. That may be too optimistic.',
        'Willingham argues that critical thinking depends heavily on background knowledge — so generic training transfers poorly. Spotting a weak argument about engine repair is much easier if you know about engines. Without that knowledge, you can’t tell which premise is implausible or which alternative explanation is realistic.',
        'The practical upshot: be most cautious about your own judgement exactly where you know least. In unfamiliar territory, the skill is less “evaluate the argument yourself” and more “work out who can”.',
      ],
      example: {
        title: 'Worked example: the sharp analyst and the soil',
        body: [
          'Omar is excellent at picking apart sports statistics: he spots small samples and cherry-picked seasons instantly. He reads a (made-up) gardening blog claiming that adding crushed eggshells changes soil acidity “within days”.',
          'The argument looks fine to him — a clear mechanism, a confident author. But he has no idea how fast soil chemistry changes, so he can’t judge whether “within days” is plausible.',
          'His statistical skill isn’t the bottleneck; knowledge is. The sensible move is to check what soil scientists or experienced growers say — and notice that his confidence came from the argument’s *style*, not his ability to assess its content.',
        ],
      },
      check: {
        id: 'l5-c01',
        type: 'mc',
        level: 5,
        skills: ['trust-calibration'],
        kind: 'application',
        lessonRef: 'l5-s1',
        scenario: {
          label: 'Scenario (fictional)',
          body: 'Zara, a lawyer who is very good at spotting weak arguments in court, reads a (made-up) engineering report concluding that the old Harrow Street footbridge needs replacing rather than repairing. The reasoning seems tight to her.',
        },
        prompt: 'What is the main caution for Zara?',
        options: [
          {
            id: 'a',
            text: 'Her skill at judging arguments relies partly on knowing the subject; in engineering, she may not be able to tell a plausible premise from an implausible one.',
            correct: true,
            explanation:
              'An argument can be structurally tight with a false premise only an engineer would notice. Her sense that it “seems tight” is less reliable here than in law.',
          },
          {
            id: 'b',
            text: 'None — good reasoning is good reasoning, whatever the topic.',
            correct: false,
            explanation:
              'Tempting, and partly true for checking logical structure. But judging whether premises are true, and which explanations are realistic, needs domain knowledge.',
          },
          {
            id: 'c',
            text: 'She should distrust the report, since engineers have an incentive to recommend expensive work.',
            correct: false,
            explanation: 'Incentives are worth noticing, but this is a different issue — and assuming the worst isn’t a substitute for expertise either.',
          },
          {
            id: 'd',
            text: 'She should learn structural engineering before forming any view.',
            correct: false,
            explanation: 'Impractical. The realistic move is to find out what independent engineers think, not to become one.',
          },
        ],
      },
    },
    {
      id: 'l5-s2',
      title: 'Most of what you know, someone told you',
      skills: ['trust-calibration', 'source-incentives'],
      body: [
        'You haven’t checked that the Earth orbits the Sun, that your medicine contains what the label says, or what happened in history before you were born. Almost all knowledge is **testimony** — and that’s fine. The skill is trusting the right people, for the right questions.',
        'Four things to weigh: **track record** (have they been right about this kind of question before?), **incentives** (what do they gain from you believing them?), **consensus** (do independent experts agree?), and **error-correction** (does the source, or the institution behind it, check its work and publish corrections?).',
        'Trust is question-specific. A mountain-rescue team is the right source on winter routes and the wrong one on tax law.',
      ],
      example: {
        title: 'Worked example: is the bridge safe?',
        body: [
          'After a storm, residents of (made-up) Corran ask if the Brennan Bridge is safe to reopen. Sources: the regional highways authority’s inspection report; a structural engineer posting her own views on a local forum; the bridge’s maintenance contractor, who wants it reopened; a viral video of the bridge “wobbling”.',
          'The authority wins on all four counts: inspections are its job (track record), it gains nothing from a wrong answer, its engineers’ findings are checked by others, and it issues corrections. The independent engineer is knowledgeable but working from photos. The contractor knows the bridge well but has an incentive. The video has none of the four.',
        ],
      },
      check: {
        id: 'l5-c02',
        type: 'rank',
        level: 5,
        skills: ['trust-calibration'],
        kind: 'application',
        lessonRef: 'l5-s2',
        prompt: 'Is the wild garlic growing in the (made-up) Thornwood forest safe to pick and eat? Rank these sources, most trustworthy for this question first.',
        entries: [
          {
            id: 'forager',
            label: 'A local foraging course leader who has guided walks in Thornwood for 15 years and knows the plants there',
            why: 'Expertise in exactly this question, a long record in this place, and mistakes would end her business.',
          },
          {
            id: 'guide',
            label: 'A well-regarded field guide to wild plants, which warns about poisonous look-alikes',
            why: 'Checked and revised over editions, but it can’t see the specific plants in front of you.',
          },
          {
            id: 'neighbour',
            label: 'A neighbour who says she’s picked garlic there for years and is fine',
            why: 'Real experience, but no check on whether she knows the look-alikes — and survivorship is a weak test.',
          },
          {
            id: 'chef',
            label: 'A famous TV chef who recommends wild garlic in a recipe video',
            why: 'Expert in cooking, not plant identification, and not about this forest.',
          },
        ],
        correctOrder: ['forager', 'guide', 'neighbour', 'chef'],
        rationale:
          'The question is identification in a specific place. Local, checked expertise beats general reference; general reference beats unchecked personal experience; and fame in a neighbouring field (cooking) doesn’t transfer.',
      },
    },
    {
      id: 'l5-s3',
      title: 'Selective scepticism',
      skills: ['bias-awareness', 'trust-calibration'],
      body: [
        'Scepticism is not automatically a virtue. Doubting everything leaves you unable to act or learn. And **selective scepticism** — hard questions for sources you dislike, none for sources you like — is motivated reasoning in a lab coat.',
        'Conspiracy thinking often looks like hyper-critical thinking: every official statement picked apart, every gap treated as a cover-up. The giveaway is the asymmetry. The same person accepts an anonymous post, a lone “insider” or a video with no source, without any of that scrutiny.',
        'The check: **would I accept this standard of evidence from the other side?** And: **what would a source have to do to earn my trust?** If the answer is “nothing could”, the scepticism isn’t tracking evidence.',
      ],
      example: {
        title: 'Worked example: the water report',
        body: [
          'The (made-up) Riverside Water Company publishes monthly test results showing tap water within safety limits. Kit says: “They would say that — they’re the water company.” Fair enough: there is an incentive.',
          'But Kit then shares an anonymous post claiming the water is contaminated, with no test results, no name, and no method — and asks none of the questions he asked of the company.',
          'Good scepticism would ask both sources the same questions — and look for checks neither controls, such as testing by an independent lab or the regulator’s own samples.',
        ],
      },
      check: {
        id: 'l5-c03',
        type: 'mc',
        level: 5,
        skills: ['bias-awareness', 'trust-calibration'],
        kind: 'application',
        lessonRef: 'l5-s3',
        scenario: {
          label: 'Forum thread (fictional)',
          body: '**Mel:** The council’s flood report for Ashby Vale says the new defences worked. Of course it does — they built them. **Jo:** So what *would* convince you? **Mel:** Honestly, nothing the council publishes. But this guy on a video channel says he spoke to a worker who saw cracks. That’s good enough for me.',
        },
        prompt: 'What’s the main problem with Mel’s reasoning?',
        options: [
          {
            id: 'a',
            text: 'She applies heavy scepticism to the source she distrusts and almost none to the one she likes — and says nothing could change her mind.',
            correct: true,
            explanation:
              'The council does have an incentive, so some doubt is fair. But a second-hand claim from an unnamed worker gets no scrutiny, and no evidence could count for the other side. That asymmetry is the giveaway.',
          },
          {
            id: 'b',
            text: 'She’s right to distrust the council because it has an incentive.',
            correct: false,
            explanation: 'Tempting — the incentive is real. But noticing an incentive calls for independent evidence, not for accepting any rival claim.',
          },
          {
            id: 'c',
            text: 'She should trust the council because it’s an official body.',
            correct: false,
            explanation: 'Official bodies can be wrong. The fix is consistent standards and independent checks, not automatic trust.',
          },
          {
            id: 'd',
            text: 'The video channel has too few subscribers to be reliable.',
            correct: false,
            explanation: 'Subscriber counts measure popularity, not accuracy. The problem is the evidence (third-hand, unnamed), not the audience size.',
          },
        ],
      },
    },
    {
      id: 'l5-s4',
      title: 'Reasoning works better in groups',
      skills: ['bias-awareness', 'trust-calibration'],
      body: [
        'Why are we so much better at finding flaws in other people’s arguments than in our own? Mercier and Sperber’s argumentative theory offers an answer: it proposes that reasoning evolved mainly to argue — to produce arguments and evaluate other people’s — rather than to check our own beliefs in private.',
        'If that’s right, it explains why we’re poor at critiquing our own views but decent at critiquing others’. And it suggests that good reasoning is often a property of **well-structured groups** more than lone individuals: people with different views, checking each other’s work.',
        'That’s what institutions like peer review and replication try to build in. Practically, it means seeking out critics — and giving extra weight to claims that have survived people who wanted to knock them down.',
      ],
      example: {
        title: 'Worked example: the red team',
        body: [
          'The (made-up) Linwood council planning team has spent months on a proposal for a new park-and-ride. The lead planner rereads it twice and finds nothing wrong.',
          'Before publishing, the team asks a group from another department to try to break it — to argue against it as hard as they can. Within an hour, they find that the bus timings assume a road that floods every winter.',
          'The lead planner wasn’t careless. Reasoning about your own plan is hard for everyone; arguing against someone else’s comes naturally. The structure did what the individual couldn’t.',
        ],
      },
      check: {
        id: 'l5-c04',
        type: 'mc',
        level: 5,
        skills: ['bias-awareness'],
        kind: 'application',
        lessonRef: 'l5-s4',
        prompt:
          'Priya has written a proposal to change how her (made-up) research group, the Halden Lab, stores its data. She wants to catch its weaknesses before her boss sees it. Given the argumentative theory, what’s likely to work best?',
        options: [
          {
            id: 'a',
            text: 'Ask a colleague who prefers the current system to find everything wrong with it.',
            correct: true,
            explanation: 'Someone motivated to find flaws will be good at it. That’s using the way reasoning seems to work, rather than fighting it.',
          },
          {
            id: 'b',
            text: 'Reread it carefully herself, a day later, with fresh eyes.',
            correct: false,
            explanation: 'Tempting, and it does help a little. But the theory predicts we’re weakest at critiquing our own views, however carefully we try.',
          },
          {
            id: 'c',
            text: 'Ask a friend who already likes the idea to look over it.',
            correct: false,
            explanation: 'They’ll find it convincing for the same reasons she does. Agreement isn’t a test.',
          },
          {
            id: 'd',
            text: 'Add more supporting arguments, so it’s harder to object to.',
            correct: false,
            explanation: 'More arguments for it doesn’t find the weaknesses; it just makes them harder to see.',
          },
        ],
      },
    },
    {
      id: 'l5-s5',
      title: 'Knowing what you don’t know — and when to stop',
      skills: ['trust-calibration', 'calibration'],
      body: [
        'Two final skills. First, recognising **“I don’t know enough to evaluate this.”** Then asking: what would I need to know, and whom should I defer to? That isn’t giving up on thinking; it’s thinking about where your thinking is reliable.',
        'Second, knowing **when further deliberation isn’t worth it**. More thought is worth it when the stakes are high, the decision is hard to undo, and more information could realistically change your choice. It isn’t worth it when the options are close, the choice is cheap or reversible, or you’re just looking for reassurance.',
        'Endless deliberation can itself be a bias: it feels responsible, but it often just delays a decision whose outcome was never going to change.',
      ],
      example: {
        title: 'Worked example: two decisions',
        body: [
          'Sana has spent two evenings comparing two (made-up) kettles, the Brevo and the Kettlix: £24 vs £26, near-identical reviews, both returnable within 30 days. Another evening of research won’t change much, and a wrong choice costs little and can be undone. Time to stop.',
          'The same week, she’s choosing between two job offers in different cities. Stakes are high, it’s hard to reverse, and some information (talking to people who work there, visiting the cities) could easily change her mind. More deliberation is worth it here — the kettle evenings would have been better spent on this.',
        ],
      },
      check: {
        id: 'l5-c05',
        type: 'mc',
        level: 5,
        skills: ['trust-calibration'],
        kind: 'application',
        scenario: {
          label: 'News item (fictional)',
          body: 'A team at the (made-up) Corvane Institute posts a paper online, not yet checked by other scientists, claiming a new battery chemistry that charges ten times faster. Several tech blogs call it “a revolution”.',
        },
        lessonRef: 'l5-s5',
        prompt: 'You’re not a chemist. What’s the most sensible response?',
        options: [
          {
            id: 'a',
            text: 'Recognise you can’t evaluate the chemistry yourself; hold off and look for what independent battery chemists say, and whether others can repeat the result.',
            correct: true,
            explanation:
              'You can’t judge the content, but you can judge the situation: one unreviewed paper, no replication, hype from non-experts. Defer to independent experts, and let the error-correcting process work.',
          },
          {
            id: 'b',
            text: 'Read the paper carefully and decide for yourself whether the reasoning holds up.',
            correct: false,
            explanation: 'Tempting — it feels like what a critical thinker should do. But without the background knowledge, your reading of the chemistry isn’t reliable.',
          },
          {
            id: 'c',
            text: 'Dismiss it — claims like this are usually hype.',
            correct: false,
            explanation: 'Many are, which is why caution is right. But dismissing it outright is a confident judgement you also can’t back up. “Not yet known” is the honest position.',
          },
          {
            id: 'd',
            text: 'Trust it, since the tech blogs agree.',
            correct: false,
            explanation: 'Several blogs repeating one paper isn’t independent agreement — and blog writers aren’t battery chemists.',
          },
        ],
      },
    },
  ],

  practice: [
    {
      id: 'l5-p01',
      type: 'rank',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s2',
      prompt:
        'What is the safest route up the (made-up) mountain Scarfell in winter conditions this week? Rank these sources, most trustworthy for this question first.',
      entries: [
        {
          id: 'rescue',
          label: 'The local mountain-rescue team’s current conditions update',
          why: 'Deep local expertise, current, and they deal with the consequences of bad advice.',
        },
        {
          id: 'guidebook',
          label: 'A respected guidebook to Scarfell routes, last updated three years ago',
          why: 'Reliable on routes, checked by editors, but can’t tell you about this week’s snow and ice.',
        },
        {
          id: 'hiker',
          label: 'A hiker’s blog post from last summer saying the north ridge is “easy”',
          why: 'Real experience — but summer, one person, and “easy” for them.',
        },
        {
          id: 'athlete',
          label: 'A famous marathon runner who once ran up Scarfell for a charity video',
          why: 'Famous and fit, but fitness isn’t winter mountain expertise, and it was one trip.',
        },
      ],
      correctOrder: ['rescue', 'guidebook', 'hiker', 'athlete'],
      rationale:
        'The question is specific: this mountain, this week, winter. Current local expertise wins; a checked general reference comes next; a single out-of-season experience is weak; and fame in a different field adds nothing.',
    },
    {
      id: 'l5-p02',
      type: 'mc',
      level: 5,
      skills: ['bias-awareness', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s3',
      scenario: {
        label: 'Conversation (fictional)',
        body: 'Arlo dismisses a (made-up) consumer group’s test showing his favourite trainers wear out fastest: “Their sample was only 20 pairs, and who funds them anyway?” Later he recommends the same trainers to a friend because “a running blogger said they’re the toughest she’s ever owned”.',
      },
      prompt: 'Which question would best expose the problem in Arlo’s reasoning?',
      options: [
        {
          id: 'a',
          text: '“How many pairs did the blogger test, and who funds her?”',
          correct: true,
          explanation: 'It holds the source he likes to the standards he used against the source he dislikes. One blogger’s single pair can’t beat 20 pairs tested the same way.',
        },
        {
          id: 'b',
          text: '“Is 20 pairs really too few?”',
          correct: false,
          explanation: 'A fair question, but it only examines one side. The problem is the asymmetry.',
        },
        {
          id: 'c',
          text: '“Do you just like the trainers?”',
          correct: false,
          explanation: 'Probably true, but it attacks his motives rather than showing the inconsistency in his standards.',
        },
        {
          id: 'd',
          text: '“Who funds the consumer group?”',
          correct: false,
          explanation: 'Tempting, since he raised it. But answering it just continues the one-sided scrutiny.',
        },
      ],
    },
    {
      id: 'l5-p03',
      type: 'mc',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s5',
      scenario: {
        label: 'Scenario (fictional)',
        body: 'Your elderly neighbour asks whether she should switch her savings to a (made-up) investment product, the Halcyon Growth Bond, which a friend of hers recommends. You know a bit about money but nothing about this kind of product.',
      },
      prompt: 'What’s the best thing to say?',
      options: [
        {
          id: 'a',
          text: '“I don’t know enough to judge this. Before deciding, it’s worth asking an independent, regulated financial adviser — one paid a fee, not commission — what the risks are.”',
          correct: true,
          explanation: 'You recognise the limits of your knowledge and point to someone whose expertise fits and whose incentives don’t depend on the sale.',
        },
        {
          id: 'b',
          text: '“Let me read up on it tonight and tell you what I think.”',
          correct: false,
          explanation: 'Kind, and tempting. But an evening’s reading won’t give you the background to spot what an expert would — and she may treat your view as expert.',
        },
        {
          id: 'c',
          text: '“If your friend recommends it, it’s probably fine.”',
          correct: false,
          explanation: 'Her friend may have no relevant expertise — or may be earning from the recommendation.',
        },
        {
          id: 'd',
          text: '“Investment products are all scams — don’t touch it.”',
          correct: false,
          explanation: 'Blanket scepticism is as unhelpful as blanket trust, and it isn’t true.',
        },
      ],
    },
    {
      id: 'l5-p04',
      type: 'mc',
      level: 5,
      skills: ['trust-calibration', 'calibration'],
      kind: 'application',
      lessonRef: 'l5-s5',
      prompt: 'Which of these decisions most deserves more time and thought before deciding?',
      options: [
        {
          id: 'a',
          text: 'Whether to accept a five-year lease on a shop for a new business, with a large penalty for leaving early.',
          correct: true,
          explanation: 'High stakes, hard to reverse, and more information (footfall, other tenants’ experience) could realistically change the decision.',
        },
        {
          id: 'b',
          text: 'Which of two similar £15 phone cases to buy, both returnable.',
          correct: false,
          explanation: 'Cheap, reversible, and the options are close. Extra deliberation won’t pay.',
        },
        {
          id: 'c',
          text: 'Which film to watch tonight.',
          correct: false,
          explanation: 'Low stakes, and you can switch films if it’s bad.',
        },
        {
          id: 'd',
          text: 'Whether to try a new café for lunch.',
          correct: false,
          explanation: 'Tempting if you dislike risk, but a bad lunch costs little and teaches you something.',
        },
      ],
    },
    {
      id: 'l5-p05',
      type: 'reflection',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s5',
      prompt:
        'Pick a question you have an opinion on but no real expertise in. What would you need to know to evaluate it properly? Whom would you defer to, and why them — in terms of track record, incentives, consensus and error-correction?',
      modelAnswers: [
        'Whether the old oak by our school should be cut down. I’d need to know how to assess tree disease and structural risk. I’d defer to an independent tree surgeon or the council’s tree officer, who do this regularly, don’t profit from the decision, and whose assessments can be checked by others.',
        'Whether a new diet I read about works. I’d need to understand how nutrition studies are designed. I’d look for what dietitians’ professional bodies say and whether several independent trials agree, rather than the author selling the diet book.',
      ],
      rubric: [
        'I named a specific question, not a whole field.',
        'I named specific knowledge I lack.',
        'I chose whom to defer to and gave reasons using at least two of: track record, incentives, consensus, error-correction.',
      ],
    },
  ],

  bank: [
    {
      id: 'l5-b01',
      type: 'rank',
      level: 5,
      skills: ['trust-calibration', 'source-incentives'],
      kind: 'application',
      lessonRef: 'l5-s2',
      prompt:
        'Does the (made-up) Pellmore primary school building contain dangerous materials that need removing? Rank these sources, most trustworthy for this question first.',
      entries: [
        {
          id: 'survey',
          label: 'A survey by an accredited building inspector, whose work is audited by a national body',
          why: 'Right expertise, a direct inspection, and an external check on their work.',
        },
        {
          id: 'records',
          label: 'The school’s building records from when it was built, listing materials used',
          why: 'Useful documentary evidence, but records can be incomplete and things change over decades.',
        },
        {
          id: 'removal',
          label: 'A removal company offering a free “assessment”',
          why: 'May have real knowledge, but earns money only if it finds something to remove.',
        },
        {
          id: 'parent',
          label: 'A parent’s post saying “everyone knows buildings from that era are full of toxic stuff”',
          why: 'A generalisation about an era, not this building; no inspection.',
        },
      ],
      correctOrder: ['survey', 'records', 'removal', 'parent'],
      rationale:
        'Expertise plus inspection plus outside audit is the strongest combination. Records are real evidence but not a check of the building now. The removal firm’s incentive pulls one way; the parent offers a generalisation, not evidence about this school.',
    },
    {
      id: 'l5-b02',
      type: 'rank',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s2',
      prompt:
        'How much is the (made-up) town of Ferrybridge’s population likely to grow over the next ten years? Rank these sources, most trustworthy for this question first.',
      entries: [
        {
          id: 'stats',
          label: 'The national statistics office’s published projections, with their method and past accuracy',
          why: 'Specialists in this exact question, transparent about method, and their old projections can be checked against what happened.',
        },
        {
          id: 'university',
          label: 'A university demographer’s independent estimate in a reviewed journal',
          why: 'Expert and checked by peers — but a single estimate, so ranked just below the official series with a public track record.',
        },
        {
          id: 'developer',
          label: 'A housing developer’s brochure forecasting “booming growth”',
          why: 'Has data, but benefits from you believing in growth.',
        },
        {
          id: 'pundit',
          label: 'A popular commentator who predicted last year that the town would “empty out”',
          why: 'No method shown, and a track record you can check — badly wrong in the other direction.',
        },
      ],
      correctOrder: ['stats', 'university', 'developer', 'pundit'],
      rationale:
        'Track record and transparent method put the official projections first; a reviewed independent expert is close behind. The developer has an incentive. The pundit has a checkable track record, and it’s poor.',
    },
    {
      id: 'l5-b03',
      type: 'rank',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s2',
      prompt:
        'Your (made-up) car, a 2015 Halden Vista, is making a grinding noise when braking. Is it safe to drive to work tomorrow? Rank these sources, most trustworthy for this question first.',
      entries: [
        {
          id: 'mechanic',
          label: 'A qualified mechanic who inspects the brakes today',
          why: 'Right expertise, direct inspection of your car.',
        },
        {
          id: 'manual',
          label: 'The car’s handbook, which says grinding brakes should be checked before driving further',
          why: 'From the manufacturer, about this model — general, but clear and cautious.',
        },
        {
          id: 'forum',
          label: 'An owners’ forum thread where several people say grinding was “nothing serious” on their cars',
          why: 'Similar cars, but not your car, and people who had a serious problem may not have posted the same way.',
        },
        {
          id: 'friend',
          label: 'A friend who says “cars always make noises, just drive it”',
          why: 'Generic reassurance, no expertise, no inspection.',
        },
      ],
      correctOrder: ['mechanic', 'manual', 'forum', 'friend'],
      rationale:
        'With safety at stake, inspection of the actual brakes beats everything. The manufacturer’s general advice is next. Other owners’ experiences are weak evidence about your car; generic reassurance is weakest.',
    },
    {
      id: 'l5-b04',
      type: 'rank',
      level: 5,
      skills: ['trust-calibration', 'bias-awareness'],
      kind: 'application',
      lessonRef: 'l5-s4',
      prompt:
        'Does the (made-up) teaching method “Pathway Reading” improve children’s reading more than the usual method? Rank this evidence, most trustworthy first.',
      entries: [
        {
          id: 'replicated',
          label: 'Three independent trials in different regions, each randomly assigning classes, mostly showing a small benefit',
          why: 'Independent replication: the result has survived different teams trying to test it.',
        },
        {
          id: 'single',
          label: 'One large randomised trial run by the method’s creators, showing a big benefit',
          why: 'Good design, but one study by people with a stake in the result, and not yet repeated.',
        },
        {
          id: 'survey',
          label: 'A survey of teachers who chose to use Pathway, most of whom say it works',
          why: 'Teachers who chose it may be keen on it; no comparison group.',
        },
        {
          id: 'testimonial',
          label: 'A head teacher’s moving talk about one pupil whose reading “transformed”',
          why: 'One vivid case, picked because it was striking.',
        },
      ],
      correctOrder: ['replicated', 'single', 'survey', 'testimonial'],
      rationale:
        'Group error-correction in action: results that independent teams reproduce are more trustworthy than a single study — even a well-designed one by interested parties. Uncontrolled opinion and single stories come last.',
    },
    {
      id: 'l5-b05',
      type: 'mc',
      level: 5,
      skills: ['bias-awareness', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s3',
      scenario: {
        label: 'Online comment (fictional)',
        body: '“Everything we’re told about the great Arden Valley flood (a made-up event) comes from official archives — so obviously it’s been doctored. Meanwhile an anonymous engineer on a forum explained how the water marks in old photos prove the flood was staged to justify building the dam. Wake up and think critically!”',
      },
      prompt: 'Which best describes the commenter’s reasoning?',
      options: [
        {
          id: 'a',
          text: 'Selective scepticism: archives are rejected because they’re official, while an anonymous forum post is accepted without scrutiny.',
          correct: true,
          explanation:
            'The commenter calls this critical thinking, but the scrutiny only runs one way. An anonymous claim about water marks faces none of the doubt applied to documented archives.',
        },
        {
          id: 'b',
          text: 'Healthy scepticism: official sources should always be questioned.',
          correct: false,
          explanation: 'Tempting, because questioning official sources can be healthy. But questioning means applying standards — and the same standards to the alternative.',
        },
        {
          id: 'c',
          text: 'Appeal to authority: they trust an engineer.',
          correct: false,
          explanation: 'There’s a grain of this, but the engineer is anonymous — there’s no authority to appeal to. The main flaw is the asymmetry.',
        },
        {
          id: 'd',
          text: 'Nothing wrong — they’ve compared two sources.',
          correct: false,
          explanation: 'Comparing sources is good only if both are judged by the same standards.',
        },
      ],
    },
    {
      id: 'l5-b06',
      type: 'mc',
      level: 5,
      skills: ['bias-awareness', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s3',
      prompt:
        'Four people react to a (made-up) official report that the Glenmore reservoir is safe for swimming. Who is showing well-calibrated scepticism?',
      options: [
        {
          id: 'a',
          text: 'Bo: “The report has an incentive to say yes, so I checked: the independent lab’s samples agree, and they publish failures too. I’m fairly confident it’s safe.”',
          correct: true,
          explanation: 'Bo noticed the incentive, looked for an independent check, considered error-correction, and reached a proportionate conclusion.',
        },
        {
          id: 'b',
          text: 'Cy: “Official reports always lie. I’ll never swim there.”',
          correct: false,
          explanation: 'Blanket distrust isn’t scepticism; it’s a fixed conclusion. Nothing could change his mind.',
        },
        {
          id: 'c',
          text: 'Di: “It’s official, so it’s definitely safe.”',
          correct: false,
          explanation: 'Blanket trust skips the checks Bo made.',
        },
        {
          id: 'd',
          text: 'Ed: “I can’t be certain, so I’ll treat it as dangerous.”',
          correct: false,
          explanation: 'Tempting, because it sounds cautious. But demanding certainty means never trusting anything; good evidence should be allowed to raise confidence.',
        },
      ],
    },
    {
      id: 'l5-b07',
      type: 'mc',
      level: 5,
      skills: ['bias-awareness', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s4',
      prompt:
        'Two (made-up) findings: one published by a single researcher with no outside checks; one that several rival labs tried to disprove but repeatedly confirmed. Given the argumentative theory, why should the second carry more weight?',
      options: [
        {
          id: 'a',
          text: 'People are much better at finding flaws in others’ claims than their own, so a claim that has survived motivated critics has passed a far stronger test.',
          correct: true,
          explanation: 'Rival labs had every reason to find problems — and that’s exactly what people are good at. Surviving them is meaningful.',
        },
        {
          id: 'b',
          text: 'More people agree with it, and the majority is usually right.',
          correct: false,
          explanation: 'Tempting, but headcount isn’t the point. What matters is that the agreement came from people trying to find errors.',
        },
        {
          id: 'c',
          text: 'The single researcher is probably biased.',
          correct: false,
          explanation: 'Not necessarily — but even an honest researcher is poorly placed to find the flaws in their own work.',
        },
        {
          id: 'd',
          text: 'It doesn’t; a finding is either true or false regardless of who checked it.',
          correct: false,
          explanation: 'True of the finding itself, but our *evidence* about it is much stronger when it has been tested by critics.',
        },
      ],
    },
    {
      id: 'l5-b08',
      type: 'mc',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s5',
      scenario: {
        label: 'Scenario (fictional)',
        body: 'At a (made-up) residents’ meeting in Fallow Cross, a speaker presents detailed charts claiming the local river’s fish are declining because of a chemical from a nearby factory. The factory’s representative presents equally detailed charts blaming warmer summers. You have no background in river ecology.',
      },
      prompt: 'What’s the most sensible next step?',
      options: [
        {
          id: 'a',
          text: 'Admit you can’t judge the charts, and ask what independent river ecologists — for example, the environmental regulator or a university team with no stake — have found.',
          correct: true,
          explanation: 'Both sides have charts and possibly incentives; without the background, you can’t adjudicate. Find independent expertise and see whether there’s consensus.',
        },
        {
          id: 'b',
          text: 'Go with whichever speaker was more convincing.',
          correct: false,
          explanation: 'Tempting — but persuasiveness is a skill separate from being right, and you lack the knowledge to tell them apart on substance.',
        },
        {
          id: 'c',
          text: 'Side against the factory; it has the obvious incentive.',
          correct: false,
          explanation: 'The incentive is real, but the other speaker may have one too, and incentives don’t settle what’s true.',
        },
        {
          id: 'd',
          text: 'Split the difference: it’s probably a bit of both.',
          correct: false,
          explanation: 'Sounds balanced, but it’s a guess dressed as a conclusion. It could be entirely one cause.',
        },
      ],
    },
    {
      id: 'l5-b09',
      type: 'mc',
      level: 5,
      skills: ['trust-calibration', 'evidence-evaluation'],
      kind: 'application',
      lessonRef: 'l5-s1',
      prompt:
        'Jules has completed every level of this app and scores highly. Where is Jules’s judgement of an argument most likely to be reliable?',
      options: [
        {
          id: 'a',
          text: 'In arguments about cycling, which Jules has raced and coached for ten years.',
          correct: true,
          explanation: 'Reasoning skills work best on top of knowledge. In a familiar domain, Jules can tell which premises are plausible and which alternatives are realistic.',
        },
        {
          id: 'b',
          text: 'Equally reliable everywhere — the skills are general.',
          correct: false,
          explanation: 'Tempting, after five levels of practice. But Willingham’s point is that critical thinking leans heavily on background knowledge, so it transfers poorly to unfamiliar fields.',
        },
        {
          id: 'c',
          text: 'In arguments about unfamiliar topics, because Jules has no preconceptions there.',
          correct: false,
          explanation: 'Fewer preconceptions, but also less knowledge — and you need knowledge to see what’s implausible.',
        },
        {
          id: 'd',
          text: 'Wherever Jules feels most confident.',
          correct: false,
          explanation: 'Confidence and reliability can come apart — as your own calibration curve may have shown.',
        },
      ],
    },
    {
      id: 'l5-b10',
      type: 'mc',
      level: 5,
      skills: ['trust-calibration', 'calibration'],
      kind: 'application',
      lessonRef: 'l5-s5',
      scenario: {
        label: 'Scenario (fictional)',
        body: 'Ines has spent three weekends choosing between two (made-up) family tents, the Wayfarer 4 and the Nomad 4. Both cost about £180, have near-identical ratings, and can be returned within 60 days. She’s now reading a fourth set of reviews.',
      },
      prompt: 'What should Ines do?',
      options: [
        {
          id: 'a',
          text: 'Pick one now. The options are close, the choice is reversible, and more research is unlikely to change anything.',
          correct: true,
          explanation: 'Each extra weekend costs her real time for almost no chance of a better decision. Returnability caps the downside.',
        },
        {
          id: 'b',
          text: 'Keep reading — it’s £180, so it’s worth getting right.',
          correct: false,
          explanation: 'Tempting, because money matters. But the question is whether more reading could change the choice. With near-identical options and a 60-day return, it almost certainly won’t.',
        },
        {
          id: 'c',
          text: 'Ask friends to vote.',
          correct: false,
          explanation: 'Harmless, but it’s another way of deliberating more. The point is that the decision doesn’t need more input.',
        },
        {
          id: 'd',
          text: 'Buy both and decide later.',
          correct: false,
          explanation: 'Possible, but it postpones the decision and costs more, for no real gain.',
        },
      ],
    },
    {
      id: 'l5-b11',
      type: 'mc',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s5',
      prompt: 'In which situation is it most worth gathering more information before deciding?',
      options: [
        {
          id: 'a',
          text: 'A (made-up) charity, Brightwell, must choose which of two sites to buy for a new hospice. A survey of road access, due next week, could rule one site out.',
          correct: true,
          explanation: 'High stakes, hard to reverse, and specific information is coming that could change the decision. Waiting a week is cheap by comparison.',
        },
        {
          id: 'b',
          text: 'Choosing between two equally rated restaurants for a birthday meal.',
          correct: false,
          explanation: 'Low stakes, and the options are close.',
        },
        {
          id: 'c',
          text: 'A team has already debated a logo for a month; one more meeting is scheduled “just to be sure”.',
          correct: false,
          explanation: 'Tempting — “just to be sure” sounds responsible. But nothing new is coming in; it’s deliberation for reassurance.',
        },
        {
          id: 'd',
          text: 'Deciding whether to take an umbrella when the forecast says 10% chance of rain.',
          correct: false,
          explanation: 'Cheap either way. Just decide.',
        },
      ],
    },
    {
      id: 'l5-b12',
      type: 'tag',
      level: 5,
      skills: ['trust-calibration', 'source-incentives'],
      kind: 'application',
      lessonRef: 'l5-s2',
      scenario: {
        label: 'Briefing note (fictional)',
        body: 'Question: is the (made-up) Halberd Dam safe to reopen after this winter’s floods? Facts about Ostrava Engineering, the consultancy whose report says yes:',
      },
      prompt: 'For this question, is each fact a reason to trust the report, a reason for caution, or not relevant?',
      tagSet: trustTags,
      segments: [
        {
          id: 's1',
          text: 'Ostrava has inspected over 200 dams, and none it rated safe has later failed.',
          answer: 'trust',
          why: 'A strong track record on exactly this kind of question.',
        },
        {
          id: 's2',
          text: 'It was hired and paid by the dam’s owner, who wants to reopen quickly.',
          answer: 'caution',
          why: 'An incentive that pulls towards “safe”.',
        },
        {
          id: 's3',
          text: 'Its headquarters is an award-winning glass building.',
          answer: 'irrelevant',
          why: 'Impressive, but nothing to do with dam safety.',
        },
        {
          id: 's4',
          text: 'The national dam safety regulator will review the report, and has overturned consultancy reports before.',
          answer: 'trust',
          why: 'Error-correction: an independent check that has teeth.',
        },
        {
          id: 's5',
          text: 'Its founder is a well-known TV presenter.',
          answer: 'irrelevant',
          why: 'Fame doesn’t bear on whether this report is right.',
        },
      ],
    },
    {
      id: 'l5-b13',
      type: 'tag',
      level: 5,
      skills: ['trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s2',
      scenario: {
        label: 'Profile (fictional)',
        body: 'Question: should you follow Dr Imani Cole’s advice on treating your dog’s skin condition? Facts about her:',
      },
      prompt: 'For this question, is each fact a reason to trust her advice, a reason for caution, or not relevant?',
      tagSet: trustTags,
      segments: [
        {
          id: 's1',
          text: 'She is a qualified vet who specialises in animal skin conditions.',
          answer: 'trust',
          why: 'Expertise that matches the question exactly.',
        },
        {
          id: 's2',
          text: 'Her advice matches the guidance of the professional body for vets.',
          answer: 'trust',
          why: 'Consensus among experts in the field.',
        },
        {
          id: 's3',
          text: 'She recommends a shampoo sold only through her own website.',
          answer: 'caution',
          why: 'An incentive: she profits if you follow this part of the advice.',
        },
        {
          id: 's4',
          text: 'She has a large following on social media.',
          answer: 'irrelevant',
          why: 'Popularity isn’t evidence of being right.',
        },
      ],
    },
    {
      id: 'l5-b14',
      type: 'reflection',
      level: 5,
      skills: ['bias-awareness', 'trust-calibration'],
      kind: 'application',
      lessonRef: 'l5-s3',
      prompt:
        'Name a source you trust a lot and one you distrust. For each, what evidence is your trust or distrust based on? Would they both pass — or fail — the same test?',
      modelAnswers: [
        'I trust my local GP surgery and distrust a health influencer. My trust in the GP is based on qualifications and a profession that checks its members; my distrust of the influencer is based on them selling supplements. Applying the same test, both have some incentive — but only one is subject to outside checks.',
        'I trust a particular sports journalist and distrust a rival club’s official site. Honestly, my trust in the journalist is partly because she agrees with me about my club. On track record alone, the official site has been accurate about transfers more often.',
      ],
      rubric: [
        'I named specific sources, not categories.',
        'I said what my trust or distrust is actually based on.',
        'I applied the same test to both, and was honest if one fails it.',
      ],
    },
  ],
};
