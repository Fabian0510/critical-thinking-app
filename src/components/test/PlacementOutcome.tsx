import { getItem } from '../../content';
import { LEVEL_META } from '../../content/meta';
import { href, navigate } from '../../router';
import { useProgress } from '../../state/ProgressContext';
import { PLACEMENT_PASS, recommendLevel } from '../../scoring/placement';
import { LEVELS, type LevelId } from '../../types/content';
import type { Attempt } from '../../types/progress';

const pct = (x: number) => `${Math.round(x * 100)}%`;

/** Placement recommendation, the per-level evidence for it, and a choice of starting level. */
export function PlacementOutcome({ attempts }: { attempts: Attempt[] }) {
  const { progress, dispatch } = useProgress();
  const { recommended, byLevel } = recommendLevel(attempts, getItem);
  const chosen = progress.placement?.chosen;

  function choose(level: LevelId) {
    dispatch({ type: 'choose-start', level });
    navigate(href.level(level));
  }

  return (
    <section className="stack">
      <div className="feedback feedback--correct">
        <h2>
          Recommended start: Level {recommended} — {LEVEL_META[recommended].title}
        </h2>
        <p>
          {recommended === 1
            ? `We suggest starting from the beginning: you didn’t reach ${pct(PLACEMENT_PASS)} on the Level 1 questions. Level 1 is short, and the skills build on each other.`
            : `You scored at least ${pct(PLACEMENT_PASS)} on the questions from ${
                recommended === 2 ? 'Level 1' : `Levels 1–${recommended - 1}`
              }, so you can skip ${recommended === 2 ? 'it' : 'them'}. Skipped levels stay open if you want to look back.`}
        </p>
        <p className="muted" style={{ fontSize: '0.9rem' }}>
          The recommendation walks up the levels and stops at the first one where you scored below {pct(PLACEMENT_PASS)}. With two
          questions per level it’s a rough guide, not a verdict.
        </p>
      </div>

      <div className="table-wrap">
        <table>
          <caption className="muted" style={{ textAlign: 'left', marginBottom: 6 }}>
            Your placement score by level
          </caption>
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Score</th>
              <th scope="col">Ready to skip?</th>
            </tr>
          </thead>
          <tbody>
            {byLevel.map((b) => (
              <tr key={b.level}>
                <td>
                  {b.level}. {LEVEL_META[b.level].title}
                </td>
                <td>{b.mean === null ? '—' : `${pct(b.mean)} (${b.n} questions)`}</td>
                <td>{b.mean !== null && b.mean >= PLACEMENT_PASS ? '✓ Yes' : '✗ Not yet'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card stack">
        <h2>Choose where to start</h2>
        {chosen && <p>You chose Level {chosen}. You can change your mind; nothing you’ve opened will be locked again.</p>}
        <div className="row">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              className={l === recommended ? 'btn' : 'btn btn--secondary'}
              onClick={() => choose(l)}
            >
              Start at Level {l}
              {l === recommended ? ' (recommended)' : ''}
            </button>
          ))}
        </div>
        <p className="muted" style={{ fontSize: '0.9rem' }}>
          Starting above the recommendation is allowed — it opens every level up to the one you pick. If the test there feels
          hard, the earlier lessons are a click away.
        </p>
      </div>
    </section>
  );
}
