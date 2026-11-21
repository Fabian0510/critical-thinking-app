import { getItem, getLevel } from '../content';
import { href, navigate } from '../router';
import { newRunId, useProgress } from '../state/ProgressContext';
import { activeRun, seenItemIds } from '../state/progress';
import type { Item, LevelId } from '../types/content';
import { drawLevelTest, INTERLEAVE_COUNT, INTERLEAVE_FROM_LEVEL, TEST_SIZE } from '../scoring/draw';
import { PASS_MARK, runScore } from '../scoring/scoreItem';
import { ItemSequence } from '../components/test/ItemSequence';
import { LevelGate } from './LevelPage';

export function TestPage({ level }: { level: LevelId }) {
  const { progress, dispatch } = useProgress();
  const content = getLevel(level);
  const run = activeRun(progress, 'level', level);

  function start() {
    if (!content) return;
    const earlier: Item[] =
      level >= INTERLEAVE_FROM_LEVEL
        ? ([1, 2, 3, 4, 5] as LevelId[]).filter((l) => l < level).flatMap((l) => getLevel(l)?.bank ?? [])
        : [];
    const items = drawLevelTest({
      bank: content.bank,
      earlier: earlier.length ? earlier : undefined,
      interleave: earlier.length ? INTERLEAVE_COUNT : 0,
      includePair: level === 4,
      seen: seenItemIds(progress),
      rng: Math.random,
    });
    dispatch({
      type: 'start-run',
      run: { id: newRunId(`l${level}`), kind: 'level', level, itemIds: items.map((i) => i.id), startedAt: Date.now() },
    });
  }

  function finish(runId: string, itemIds: string[]) {
    const scores = itemIds.map((id) => progress.attempts.find((a) => a.runId === runId && a.itemId === id)?.score ?? null);
    const score = runScore(scores);
    dispatch({ type: 'finish-run', runId, score, passed: score >= PASS_MARK - 1e-9, at: Date.now() });
    navigate(href.run(runId));
  }

  return (
    <LevelGate level={level}>
      {content && (
        <div className="stack">
          <h1 tabIndex={-1}>Level {level} test</h1>
          {!run ? (
            <div className="card stack">
              <p>
                {TEST_SIZE} questions, drawn at random from this level’s bank
                {level >= INTERLEAVE_FROM_LEVEL ? `, including ${INTERLEAVE_COUNT} from earlier levels` : ''}. For each scored question
                you’ll also say how sure you are — that builds your calibration curve.
              </p>
              <p>
                You need {Math.round(PASS_MARK * 100)}% on the scored questions to pass and unlock the next level. You’ll see
                feedback after each answer.
              </p>
              {!progress.levels[level].practiceDone && (
                <p className="notice">You haven’t done the practice for this level yet. You can still take the test.</p>
              )}
              <div className="row">
                <button type="button" className="btn" onClick={start}>
                  Start the test
                </button>
                <a href={href.level(level)}>Back to Level {level}</a>
              </div>
            </div>
          ) : (
            <ItemSequence
              key={run.id}
              items={run.itemIds.map((id) => getItem(id)).filter((x): x is Item => !!x)}
              runId={run.id}
              context="test"
              label={`Level ${level} test`}
              finishLabel="See my results"
              deferPaired
              onFinish={() => finish(run.id, run.itemIds)}
            />
          )}
        </div>
      )}
    </LevelGate>
  );
}
