import { useEffect, useRef, useState } from 'react';
import type { Item } from '../../types/content';
import type { AttemptContext } from '../../types/progress';
import { useProgress } from '../../state/ProgressContext';
import { ItemCard } from '../items/ItemCard';

/**
 * Presents items one at a time, records each answer as an Attempt, and resumes
 * at the first unanswered item after a reload.
 */
export function ItemSequence({
  items,
  runId,
  context,
  label,
  onFinish,
  finishLabel = 'Finish',
  deferPaired = false,
}: {
  items: Item[];
  runId: string;
  context: AttemptContext;
  label: string;
  onFinish: () => void;
  finishLabel?: string;
  deferPaired?: boolean;
}) {
  const { progress, dispatch } = useProgress();
  const answered = (id: string) => progress.attempts.find((a) => a.runId === runId && a.itemId === id);
  const [index, setIndex] = useState(() => {
    const first = items.findIndex((i) => !answered(i.id));
    return first === -1 ? items.length - 1 : first;
  });
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Move focus to the new question so keyboard and screen-reader users start at the top.
    topRef.current?.querySelector<HTMLElement>('h2')?.focus();
    topRef.current?.scrollIntoView?.({ block: 'start' });
  }, [index]);

  const item = items[index];
  if (!item) return null;
  const prior = answered(item.id);
  const last = index === items.length - 1;

  return (
    <div ref={topRef} className="stack">
      <div>
        <div className="progress-text">
          {label} · question {index + 1} of {items.length}
        </div>
        <progress max={items.length} value={index + 1} aria-label={`${label} progress`} />
      </div>
      <ItemCard
        key={item.id}
        item={item}
        position={`Question ${index + 1} of ${items.length}`}
        initial={prior ? { response: prior.response, confidence: prior.confidence } : undefined}
        deferFeedback={deferPaired && item.type === 'paired'}
        onSubmit={(response, r, confidence) =>
          dispatch({
            type: 'record-attempt',
            attempt: { itemId: item.id, runId, context, ts: Date.now(), response, score: r.score, correct: r.correct, confidence },
          })
        }
        onUpdate={(response) => {
          const a = answered(item.id);
          if (a) dispatch({ type: 'record-attempt', attempt: { ...a, response } });
        }}
        nextLabel={last ? finishLabel : 'Next question'}
        onNext={() => (last ? onFinish() : setIndex(index + 1))}
      />
    </div>
  );
}
