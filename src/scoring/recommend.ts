import { SKILL_LABELS, type Item, type LessonScreen, type Skill } from '../types/content';
import type { Attempt } from '../types/progress';
import { calibrationPoints, calibrationVerdict } from './calibration';
import type { PairedResult } from './paired';
import type { SkillScore } from './skills';

export interface Recommendation {
  title: string;
  reason: string;
  /** Lesson screen to revisit. */
  screenId: string;
}

const WEAK = 0.7;
const MIN_N = 2;

/**
 * Up to `max` specific recommendations, most useful first:
 * 1. a revealed double standard, 2. clear overconfidence, 3. weakest skills.
 * Each links to the lesson screen that teaches the fix.
 */
export function recommendations(args: {
  profile: SkillScore[];
  attempts: Attempt[];
  paired: PairedResult[];
  screens: LessonScreen[];
  getItem: (id: string) => Item | undefined;
  max?: number;
}): Recommendation[] {
  const { profile, attempts, paired, screens, getItem, max = 3 } = args;
  const out: Recommendation[] = [];
  // Prefer the screen whose main (first-listed) skill this is; fall back to any screen that touches it.
  const screenFor = (skill: Skill) => screens.find((s) => s.skills[0] === skill) ?? screens.find((s) => s.skills.includes(skill));

  const doubleStd = paired.find((p) => p.inconsistent);
  const dsScreen = screens.find((s) => s.id === doubleStd?.itemA.lessonRef);
  if (doubleStd && dsScreen) {
    out.push({
      title: 'Revisit: judging evidence the same way whichever side it supports',
      reason: `You rated two near-identical studies ${doubleStd.ratingA} and ${doubleStd.ratingB} out of 7. The method was the same; only the conclusion differed.`,
      screenId: dsScreen.id,
    });
  }

  const v = calibrationVerdict(calibrationPoints(attempts.filter((a) => a.context !== 'check')));
  const calScreen = screenFor('calibration');
  if (v.verdict === 'overconfident' && calScreen) {
    out.push({
      title: 'Revisit: calibration',
      // The verdict covers every answer so far, which can differ from the single test shown alongside it.
      reason: `Across everything you’ve answered so far: ${v.summary.charAt(0).toLowerCase()}${v.summary.slice(1)}`,
      screenId: calScreen.id,
    });
  }

  const weak = profile
    .filter((s) => s.mean !== null && s.n >= MIN_N && s.mean < WEAK && s.skill !== 'calibration')
    .sort((a, b) => (a.mean as number) - (b.mean as number));
  for (const s of weak) {
    if (out.length >= max) break;
    // Prefer the lesson screen behind the items they actually got wrong for this skill.
    const missed = attempts.find((a) => {
      const it = getItem(a.itemId);
      return a.score !== null && a.score < WEAK && it?.skills.includes(s.skill);
    });
    const missedItem = missed ? getItem(missed.itemId) : undefined;
    const screen = screens.find((x) => x.id === missedItem?.lessonRef) ?? screenFor(s.skill);
    if (!screen || out.some((r) => r.screenId === screen.id)) continue;
    out.push({
      title: `Revisit: ${screen.title}`,
      reason: `${SKILL_LABELS[s.skill]} is ${s === weak[0] ? 'your weakest area' : 'also below 70%'} so far (${Math.round((s.mean as number) * 100)}% across ${s.n} answers).`,
      screenId: screen.id,
    });
  }
  return out.slice(0, max);
}
