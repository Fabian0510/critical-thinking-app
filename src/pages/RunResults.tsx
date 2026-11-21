import { getItem } from '../content';
import { LEVEL_META } from '../content/meta';
import { href } from '../router';
import { useProgress } from '../state/ProgressContext';
import { deriveResults } from '../state/derived';
import { PASS_MARK } from '../scoring/scoreItem';
import { SKILL_LABELS, type LevelId } from '../types/content';
import { SkillBars } from '../components/visuals/SkillBars';
import { CalibrationCurve } from '../components/visuals/CalibrationCurve';
import { BrierLine, PairedReveal, Recommendations } from '../components/test/ResultsBlocks';
import { Rich } from '../components/Rich';
import { PlacementOutcome } from '../components/test/PlacementOutcome';
import { LEVELS } from '../types/content';

function resultText(score: number | null) {
  if (score === null) return '— not scored';
  if (score === 1) return '✓ Right';
  if (score === 0) return '✗ Not right';
  return `◐ ${Math.round(score * 100)}%`;
}

export function RunResults({ runId }: { runId: string }) {
  const { progress } = useProgress();
  const run = progress.runs.find((r) => r.id === runId);
  if (!run) {
    return (
      <div>
        <h1 tabIndex={-1}>Results not found</h1>
        <a href={href.home()}>Back to home</a>
      </div>
    );
  }
  const attempts = progress.attempts.filter((a) => a.runId === runId);
  const d = deriveResults(attempts, progress.attempts);
  const title =
    run.kind === 'level' ? `Level ${run.level} test results` : run.kind === 'placement' ? 'Placement check results' : 'Final assessment results';
  const level = run.level as LevelId | undefined;
  const scored = attempts.filter((a) => a.score !== null);
  const right = scored.filter((a) => a.correct).length;

  return (
    <div className="stack">
      <h1 tabIndex={-1}>{title}</h1>
      {run.score !== undefined && (
        <section className={`feedback ${run.passed ? 'feedback--correct' : run.kind === 'level' ? 'feedback--incorrect' : ''}`}>
          <h2>
            {Math.round(run.score * 100)}% on scored questions ({right} of {scored.length} counted as right)
          </h2>
          {run.kind === 'level' &&
            (run.passed ? (
              <p>
                <strong>✓ Passed.</strong>{' '}
                {level && level < 5 ? `Level ${level + 1}: ${LEVEL_META[(level + 1) as LevelId].title} is unlocked.` : 'The final assessment is unlocked.'}
              </p>
            ) : (
              <p>
                <strong>Not passed yet</strong> — you need {Math.round(PASS_MARK * 100)}%. A retake draws different questions where
                possible; the recommendations below say what to look at first.
              </p>
            ))}
        </section>
      )}

      {run.kind === 'placement' && <PlacementOutcome attempts={attempts} />}

      {run.kind === 'final' && (
        <section>
          <h2>Score by level</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Level</th>
                  <th scope="col">Scored questions</th>
                  <th scope="col">Average score</th>
                </tr>
              </thead>
              <tbody>
                {LEVELS.map((l) => {
                  const s = scored.filter((a) => getItem(a.itemId)?.level === l);
                  const mean = s.length ? s.reduce((x, a) => x + (a.score as number), 0) / s.length : null;
                  return (
                    <tr key={l}>
                      <td>
                        {l}. {LEVEL_META[l].title}
                      </td>
                      <td>{s.length}</td>
                      <td>{mean === null ? '—' : `${Math.round(mean * 100)}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2>Question by question</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Question</th>
                <th scope="col">Result</th>
                <th scope="col">You said</th>
              </tr>
            </thead>
            <tbody>
              {run.itemIds.map((id, i) => {
                const a = attempts.find((x) => x.itemId === id);
                const item = getItem(id);
                return (
                  <tr key={id}>
                    <td>{i + 1}</td>
                    <td>
                      <Rich text={item?.prompt ?? id} />
                      {item && (
                        <span className="muted" style={{ display: 'block', fontSize: '0.85rem' }}>
                          {item.skills.map((s) => SKILL_LABELS[s]).join(', ')}
                          {run.kind !== 'level' ? ` · Level ${item.level}` : level && item.level !== level ? ` · from Level ${item.level}` : ''}
                        </span>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{a ? resultText(a.score) : 'Not answered'}</td>
                    <td>{a?.confidence !== undefined ? `${Math.round(a.confidence * 100)}% sure` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <PairedReveal results={d.paired} />

      <section>
        <h2>Skills in this {run.kind === 'level' ? 'test' : run.kind === 'placement' ? 'check' : 'assessment'}</h2>
        <SkillBars profile={d.profile} hideEmpty />
      </section>

      <section>
        <h2>Confidence vs. accuracy in this {run.kind === 'level' ? 'test' : run.kind === 'placement' ? 'check' : 'assessment'}</h2>
        <p className="muted">
          One test is a small sample, so treat this as a first glimpse. Your <a href={href.profile()}>results page</a> combines
          everything you’ve answered.
        </p>
        <CalibrationCurve buckets={d.buckets} />
        <BrierLine brier={d.brier} n={d.points.length} />
      </section>

      <Recommendations recs={d.recs} />

      <nav className="row" aria-label="Next steps">
        {run.kind === 'level' && level && run.passed && level < 5 && (
          <a className="btn" href={href.level(level + 1)}>
            Go to Level {level + 1}
          </a>
        )}
        {run.kind === 'level' && level && (
          <a className={run.passed ? 'btn btn--secondary' : 'btn'} href={href.test(level)}>
            Retake the Level {level} test
          </a>
        )}
        {run.kind === 'final' && (
          <a className="btn" href={href.final()}>
            Take the final assessment again
          </a>
        )}
        <a className="btn btn--secondary" href={href.profile()}>
          All my results
        </a>
      </nav>
    </div>
  );
}
