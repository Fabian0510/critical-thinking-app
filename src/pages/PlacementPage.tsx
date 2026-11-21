import { getItem, PLACEMENT_ITEMS } from '../content';
import { href, navigate } from '../router';
import { newRunId, useProgress } from '../state/ProgressContext';
import { activeRun } from '../state/progress';
import { runScore } from '../scoring/scoreItem';
import { recommendLevel } from '../scoring/placement';
import type { Item } from '../types/content';
import { ItemSequence } from '../components/test/ItemSequence';

export function PlacementPage() {
  const { progress, dispatch } = useProgress();
  const run = activeRun(progress, 'placement');

  function start() {
    dispatch({
      type: 'start-run',
      run: { id: newRunId('placement'), kind: 'placement', itemIds: PLACEMENT_ITEMS.map((i) => i.id), startedAt: Date.now() },
    });
  }

  function finish(runId: string) {
    const attempts = progress.attempts.filter((a) => a.runId === runId);
    const score = runScore(attempts.map((a) => a.score));
    const { recommended } = recommendLevel(attempts, getItem);
    dispatch({ type: 'finish-run', runId, score, at: Date.now() });
    dispatch({ type: 'placement-result', runId, recommended });
    navigate(href.run(runId));
  }

  return (
    <div className="stack">
      <h1 tabIndex={-1}>Placement check</h1>
      {!run ? (
        <div className="card stack">
          <p>
            {PLACEMENT_ITEMS.length} questions — two from each level, getting harder as you go. It takes about 10 minutes. At the
            end you’ll get a recommended starting level, and you can choose a different one if you like.
          </p>
          <p>
            As in every test here, you’ll say how sure you are before each answer, and you’ll see feedback after it. None of
            these questions appears in the level tests, so you won’t meet them again.
          </p>
          {progress.placement && (
            <p className="notice">
              You’ve taken the placement check before (it recommended Level {progress.placement.recommended}). Taking it again won’t
              lock any level you’ve already opened.
            </p>
          )}
          <div className="row">
            <button type="button" className="btn" onClick={start}>
              Start the placement check
            </button>
            <a href={href.level(1)}>Skip it and start at Level 1</a>
          </div>
        </div>
      ) : (
        <ItemSequence
          key={run.id}
          items={run.itemIds.map((id) => getItem(id)).filter((x): x is Item => !!x)}
          runId={run.id}
          context="placement"
          label="Placement check"
          finishLabel="See my recommendation"
          onFinish={() => finish(run.id)}
        />
      )}
    </div>
  );
}
