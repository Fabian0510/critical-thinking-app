import { getLevel } from '../content';
import { LEVEL_META } from '../content/meta';
import { href } from '../router';
import { useProgress } from '../state/ProgressContext';
import { LEVELS, type LevelId } from '../types/content';
import { ArcBanner } from '../components/visuals/ArcBanner';
import { PLACEMENT_ITEMS } from '../content';
import { FINAL_SIZE } from './FinalPage';

export function levelStatus(level: LevelId, p: ReturnType<typeof useProgress>['progress']) {
  if (!getLevel(level)) return { key: 'unwritten', text: 'Coming soon' };
  if (level > p.unlockedThrough) return { key: 'locked', text: '🔒 Locked' };
  const lp = p.levels[level];
  if (lp.passed) return { key: 'passed', text: '✓ Passed' };
  if (lp.lessonDone || lp.practiceDone || p.runs.some((r) => r.level === level)) return { key: 'progress', text: 'In progress' };
  return { key: 'open', text: 'Not started' };
}

export function Home() {
  const { progress } = useProgress();
  const started = progress.attempts.length > 0;
  const placementReady = PLACEMENT_ITEMS.length > 0;
  const finalUnlocked = progress.levels[5].passed;
  return (
    <div className="stack">
      <section>
        <h1 tabIndex={-1}>Think Again</h1>
        <p style={{ fontSize: '1.15rem' }}>
          Learn to think critically in five short levels — and then find out whether you can actually <em>do</em> it, not just
          name it. Every test question is a realistic situation, and you’ll say how sure you are each time, so you also learn
          how well your confidence matches reality.
        </p>
        <ArcBanner />
      </section>

      <section className="row">
        {!started && (
          <>
            {placementReady && (
              <a className="btn" href={href.placement()}>
                Take the placement check ({PLACEMENT_ITEMS.length} questions)
              </a>
            )}
            <a className={placementReady ? 'btn btn--secondary' : 'btn'} href={href.level(1)}>
              Start at Level 1
            </a>
          </>
        )}
        {started && (
          <a className="btn" href={href.level(progress.unlockedThrough)}>
            Continue with Level {progress.unlockedThrough}
          </a>
        )}
        {started && (
          <a className="btn btn--secondary" href={href.profile()}>
            See your results
          </a>
        )}
        {started && placementReady && !progress.placement && (
          <a href={href.placement()}>Take the placement check</a>
        )}
      </section>

      <section aria-labelledby="levels-h">
        <h2 id="levels-h">The five levels</h2>
        <ol className="level-list">
          {LEVELS.map((l) => {
            const s = levelStatus(l, progress);
            const meta = LEVEL_META[l];
            const content = getLevel(l);
            const lastRun = [...progress.runs].reverse().find((r) => r.level === l && r.finishedAt);
            return (
              <li key={l} className="card level-card">
                <span className="level-card__num" aria-hidden="true">
                  {l}
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 2 }}>
                    {s.key === 'locked' || s.key === 'unwritten' ? (
                      <>Level {l}: {meta.title}</>
                    ) : (
                      <a href={href.level(l)}>
                        Level {l}: {meta.title}
                      </a>
                    )}
                  </h3>
                  {content && <p className="muted" style={{ marginBottom: 6 }}>{content.coreIdea}</p>}
                  <span className={`status status--${s.key}`}>{s.text}</span>
                  {lastRun?.score !== undefined && (
                    <span className="muted" style={{ marginLeft: 8, fontSize: '0.9rem' }}>
                      Last test: {Math.round(lastRun.score * 100)}%
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="card">
        <h2>Final assessment</h2>
        <p>A mixed {FINAL_SIZE}-question test across all levels, weighted towards Levels 3–5.</p>
        {finalUnlocked ? (
          <a className="btn" href={href.final()}>
            Take the final assessment
          </a>
        ) : (
          <p className="muted">
            <span aria-hidden="true">🔒 </span>Unlocks after you pass Level 5.
          </p>
        )}
      </section>
    </div>
  );
}
