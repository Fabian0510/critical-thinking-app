import { getLevel } from '../content';
import { LEVEL_META } from '../content/meta';
import { href } from '../router';
import { useProgress } from '../state/ProgressContext';
import { activeRun } from '../state/progress';
import type { LevelId } from '../types/content';
import { ArcBanner } from '../components/visuals/ArcBanner';
import { TEST_SIZE } from '../scoring/draw';
import { PASS_MARK } from '../scoring/scoreItem';

export function LevelGate({ level, children }: { level: LevelId; children: React.ReactNode }) {
  const { progress } = useProgress();
  const content = getLevel(level);
  if (!content) {
    return (
      <div>
        <h1 tabIndex={-1}>Level {level}: {LEVEL_META[level].title}</h1>
        <p>This level’s content hasn’t been written yet.</p>
        <a href={href.home()}>Back to home</a>
      </div>
    );
  }
  if (level > progress.unlockedThrough) {
    return (
      <div>
        <h1 tabIndex={-1}>Level {level} is locked</h1>
        <p>
          Pass the Level {level - 1} test (at least {Math.round(PASS_MARK * 100)}%) to unlock it, or take the placement check to
          skip ahead.
        </p>
        <a className="btn" href={href.level(progress.unlockedThrough)}>
          Go to Level {progress.unlockedThrough}
        </a>
      </div>
    );
  }
  return <>{children}</>;
}

export function LevelPage({ level }: { level: LevelId }) {
  const { progress } = useProgress();
  const content = getLevel(level);
  return (
    <LevelGate level={level}>
      {content && (
        <div className="stack">
          <ArcBanner level={level} />
          <div>
            <div className="eyebrow">
              Level {level} · {content.arcStep} · for: {content.audience}
            </div>
            <h1 tabIndex={-1}>{content.title}</h1>
            <p style={{ fontSize: '1.1rem' }}>{content.coreIdea}</p>
          </div>
          <ol className="steps">
            <li className="card">
              <h2>1. Lesson</h2>
              <p>
                {content.screens.length} short screens, each with a worked example and a quick check.
                {progress.levels[level].lessonDone && <strong> ✓ Done.</strong>}
              </p>
              <a className={progress.levels[level].lessonDone ? 'btn btn--secondary' : 'btn'} href={href.lesson(level, 0)}>
                {progress.levels[level].lessonDone ? 'Review the lesson' : 'Start the lesson'}
              </a>
            </li>
            <li className="card">
              <h2>2. Practice</h2>
              <p>
                {content.practice.length} practice questions with full feedback.
                {progress.levels[level].practiceDone && <strong> ✓ Done.</strong>}
              </p>
              <a className={progress.levels[level].lessonDone && !progress.levels[level].practiceDone ? 'btn' : 'btn btn--secondary'} href={href.practice(level)}>
                {progress.levels[level].practiceDone ? 'Practise again' : 'Practise'}
              </a>
            </li>
            <li className="card">
              <h2>3. Level test</h2>
              <p>
                {TEST_SIZE} questions drawn at random from a bank of {content.bank.length}. Pass with{' '}
                {Math.round(PASS_MARK * 100)}% to unlock the next level. Retakes draw different questions where possible.
                {progress.levels[level].passed && <strong> ✓ Passed.</strong>}
              </p>
              <a className={progress.levels[level].practiceDone && !progress.levels[level].passed ? 'btn' : 'btn btn--secondary'} href={href.test(level)}>
                {activeRun(progress, 'level', level) ? 'Resume the test' : progress.levels[level].passed ? 'Retake the test' : 'Take the test'}
              </a>
            </li>
          </ol>
          <RunHistory level={level} />
        </div>
      )}
    </LevelGate>
  );
}

function RunHistory({ level }: { level: LevelId }) {
  const { progress } = useProgress();
  const runs = progress.runs.filter((r) => r.level === level && r.finishedAt);
  if (runs.length === 0) return null;
  return (
    <section>
      <h2>Your test attempts</h2>
      <ul>
        {runs.map((r) => (
          <li key={r.id}>
            <a href={href.run(r.id)}>{new Date(r.finishedAt!).toLocaleString()}</a> — {Math.round((r.score ?? 0) * 100)}%{' '}
            {r.passed ? '(passed)' : '(not passed)'}
          </li>
        ))}
      </ul>
    </section>
  );
}
