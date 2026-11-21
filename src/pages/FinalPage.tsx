import { getItem, getLevel } from '../content';
import { href, navigate } from '../router';
import { newRunId, useProgress } from '../state/ProgressContext';
import { activeRun, seenItemIds } from '../state/progress';
import { drawFinal, FINAL_WEIGHTS } from '../scoring/draw';
import { runScore } from '../scoring/scoreItem';
import { LEVELS, type Item, type LevelId } from '../types/content';
import { ItemSequence } from '../components/test/ItemSequence';

export const FINAL_SIZE = Object.values(FINAL_WEIGHTS).reduce((a, b) => a + b, 0);

export function FinalPage() {
  const { progress, dispatch } = useProgress();
  const run = activeRun(progress, 'final');

  if (!progress.levels[5].passed) {
    return (
      <div className="stack">
        <h1 tabIndex={-1}>Final assessment is locked</h1>
        <p>The final assessment unlocks once you’ve passed the Level 5 test.</p>
        <a className="btn" href={href.level(progress.unlockedThrough)}>
          Go to Level {progress.unlockedThrough}
        </a>
      </div>
    );
  }

  function start() {
    const banks = Object.fromEntries(LEVELS.map((l) => [l, getLevel(l)?.bank ?? []])) as Record<LevelId, Item[]>;
    const items = drawFinal(banks, Math.random, seenItemIds(progress));
    dispatch({ type: 'start-run', run: { id: newRunId('final'), kind: 'final', itemIds: items.map((i) => i.id), startedAt: Date.now() } });
  }

  function finish(runId: string, itemIds: string[]) {
    const scores = itemIds.map((id) => progress.attempts.find((a) => a.runId === runId && a.itemId === id)?.score ?? null);
    dispatch({ type: 'finish-run', runId, score: runScore(scores), at: Date.now() });
    navigate(href.run(runId));
  }

  return (
    <div className="stack">
      <h1 tabIndex={-1}>Final assessment</h1>
      {!run ? (
        <div className="card stack">
          <p>
            {FINAL_SIZE} questions mixed from all five levels, weighted towards Levels 3–5 (
            {LEVELS.map((l) => `${FINAL_WEIGHTS[l]} from Level ${l}`).join(', ')}). Questions you haven’t met in a test are used
            first.
          </p>
          <p>
            It includes a pair of near-identical studies; how consistently you rated them is revealed at the end. You’ll see
            feedback after every other answer. Allow about 30 minutes — if you stop part-way, you can pick up where you left off.
          </p>
          <div className="row">
            <button type="button" className="btn" onClick={start}>
              Start the final assessment
            </button>
            <a href={href.home()}>Back to home</a>
          </div>
        </div>
      ) : (
        <ItemSequence
          key={run.id}
          items={run.itemIds.map((id) => getItem(id)).filter((x): x is Item => !!x)}
          runId={run.id}
          context="final"
          label="Final assessment"
          finishLabel="See my results"
          deferPaired
          onFinish={() => finish(run.id, run.itemIds)}
        />
      )}
    </div>
  );
}
