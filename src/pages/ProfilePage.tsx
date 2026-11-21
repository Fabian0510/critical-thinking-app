import { href } from '../router';
import { useProgress } from '../state/ProgressContext';
import { deriveResults } from '../state/derived';
import { SkillBars } from '../components/visuals/SkillBars';
import { CalibrationCurve } from '../components/visuals/CalibrationCurve';
import { BrierLine, PairedReveal, Recommendations } from '../components/test/ResultsBlocks';

export function ProfilePage() {
  const { progress } = useProgress();
  const d = deriveResults(progress.attempts);
  const finished = progress.runs.filter((r) => r.finishedAt);
  return (
    <div className="stack">
      <h1 tabIndex={-1}>Your results</h1>
      {progress.attempts.length === 0 ? (
        <p>
          Nothing here yet. <a href={href.level(1)}>Start Level 1</a> and your skill profile and calibration will build up as you
          answer.
        </p>
      ) : (
        <>
          <section>
            <h2>Skill profile</h2>
            <p className="muted">
              Average score on tests, placement and the final assessment for questions tagged with each skill. Practice and lesson
              checks aren’t counted here.
            </p>
            <SkillBars profile={d.profile} />
          </section>
          <section>
            <h2>Calibration: how well does your confidence match reality?</h2>
            <p>{d.verdict.summary}</p>
            <CalibrationCurve buckets={d.buckets} />
            <BrierLine brier={d.brier} n={d.points.length} />
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Counts every answer you gave a confidence for, including practice and lesson checks.
            </p>
          </section>
          <PairedReveal results={d.paired} />
          <Recommendations recs={d.recs} />
          {finished.length > 0 && (
            <section>
              <h2>Test history</h2>
              <ul>
                {finished.map((r) => (
                  <li key={r.id}>
                    <a href={href.run(r.id)}>
                      {r.kind === 'level' ? `Level ${r.level} test` : r.kind === 'placement' ? 'Placement check' : 'Final assessment'}
                    </a>{' '}
                    — {new Date(r.finishedAt!).toLocaleDateString()} — {Math.round((r.score ?? 0) * 100)}%
                    {r.kind === 'level' && (r.passed ? ' (passed)' : ' (not passed)')}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
