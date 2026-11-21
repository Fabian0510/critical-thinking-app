import { useState } from 'react';
import { href } from '../router';
import { useProgress } from '../state/ProgressContext';
import type { LevelId } from '../types/content';
import { ItemSequence } from '../components/test/ItemSequence';
import { PairedReveal } from '../components/test/ResultsBlocks';
import { getItem, getLevel } from '../content';
import { pairedResults } from '../scoring/paired';
import { LevelGate } from './LevelPage';

export function PracticePage({ level }: { level: LevelId }) {
  const { progress, dispatch } = useProgress();
  const content = getLevel(level);
  // Each practice session gets its own run id, so earlier answers (and their confidence ratings) are kept.
  const prefix = `practice-l${level}-`;
  const sessions = new Set(progress.attempts.filter((a) => a.runId.startsWith(prefix)).map((a) => a.runId)).size;
  const [runId, setRunId] = useState(`${prefix}${Math.max(1, sessions)}`);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(() => !progress.levels[level].practiceDone);

  return (
    <LevelGate level={level}>
      {content && (
        <div className="stack">
          <h1 tabIndex={-1}>Level {level} practice</h1>
          {!started ? (
            <div className="card">
              <p>You’ve done this practice before. You can go through it again; your earlier answers are kept.</p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setRunId(`${prefix}${sessions + 1}`);
                  setStarted(true);
                }}
              >
                Practise again
              </button>{' '}
              <a href={href.test(level)}>Go to the test</a>
            </div>
          ) : done ? (
            <PracticeSummary level={level} runId={runId} />
          ) : (
            <>
              <p>Practice answers don’t count towards your skill profile, but your confidence ratings do count towards calibration.</p>
              <ItemSequence
                key={runId}
                items={content.practice}
                runId={runId}
                context="practice"
                label="Practice"
                finishLabel="Finish practice"
                deferPaired
                onFinish={() => {
                  dispatch({ type: 'practice-done', level });
                  setDone(true);
                }}
              />
            </>
          )}
        </div>
      )}
    </LevelGate>
  );
}

function PracticeSummary({ level, runId }: { level: LevelId; runId: string }) {
  const { progress } = useProgress();
  const scored = progress.attempts.filter((a) => a.runId === runId && a.correct !== null);
  const right = scored.filter((a) => a.correct).length;
  const paired = pairedResults(
    progress.attempts.filter((a) => a.runId === runId),
    getItem,
  );
  return (
    <div className="card stack">
      <h2 tabIndex={-1}>Practice done</h2>
      <p>
        You got {right} of {scored.length} scored practice questions right.
        {right < scored.length && ' Look back at the explanations for the ones you missed before the test — the test uses different questions on the same skills.'}
      </p>
      <PairedReveal results={paired} />
      <div className="row">
        <a className="btn" href={href.test(level)}>
          Take the Level {level} test
        </a>
        <a className="btn btn--secondary" href={href.lesson(level, 0)}>
          Review the lesson
        </a>
      </div>
    </div>
  );
}
