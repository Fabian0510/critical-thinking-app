import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { RankItem } from '../../types/content';
import type { RankResponse } from '../../types/progress';
import { seededRng, shuffle } from '../../scoring/rng';
import { RightMark, WrongMark } from './Marks';
import type { InputProps } from './types';

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** A stable starting order that is never already the correct one. */
export function initialRankOrder(item: RankItem): string[] {
  const order = shuffle(item.correctOrder, seededRng(hash(item.id)));
  return order.every((id, i) => id === item.correctOrder[i]) ? [...order].reverse() : order;
}

/**
 * Drag to reorder (mouse), or use the Up/Down buttons (touch, keyboard),
 * or Alt+Arrow keys on a focused row.
 */
export function RankList({ item, value, onChange, submitted }: InputProps<RankItem, RankResponse>) {
  const order = value?.order ?? initialRankOrder(item);
  const [dragging, setDragging] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const [focusId, setFocusId] = useState<string | null>(null);

  // Report the starting order so the item counts as answered even if left unchanged.
  useEffect(() => {
    if (!value) onChange({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (focusId) rowRefs.current.get(focusId)?.focus();
  }, [focusId, order]);

  const entry = (id: string) => item.entries.find((e) => e.id === id)!;

  function move(id: string, to: number) {
    const from = order.indexOf(id);
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, id);
    onChange({ order: next });
    setAnnounce(`${entry(id).label} moved to position ${to + 1} of ${order.length}.`);
  }

  function onKey(e: KeyboardEvent, id: string) {
    if (submitted || !e.altKey) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(id, order.indexOf(id) + (e.key === 'ArrowUp' ? -1 : 1));
      setFocusId(id);
    }
  }

  return (
    <div>
      <p className="muted" id={`rank-help-${item.id}`} style={{ fontSize: '0.9rem' }}>
        Best at the top. Drag rows, or use the Up and Down buttons (Alt + arrow keys also work on a selected row).
      </p>
      <ol className="rank-list" aria-describedby={`rank-help-${item.id}`}>
        {order.map((id, i) => {
          const e = entry(id);
          const correctPos = item.correctOrder.indexOf(id);
          return (
            <li
              key={id}
              ref={(el) => {
                if (el) rowRefs.current.set(id, el);
              }}
              tabIndex={submitted ? undefined : 0}
              className={`rank-row${dragging === id ? ' rank-row--dragging' : ''}`}
              draggable={!submitted}
              aria-label={`${i + 1}. ${e.label}`}
              onKeyDown={(ev) => onKey(ev, id)}
              onDragStart={(ev) => {
                setDragging(id);
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('text/plain', id);
              }}
              onDragEnd={() => setDragging(null)}
              onDragOver={(ev) => {
                ev.preventDefault();
                if (dragging && dragging !== id) move(dragging, i);
              }}
              onDrop={(ev) => ev.preventDefault()}
            >
              <span className="rank-row__pos" aria-hidden="true">
                {i + 1}
              </span>
              <span className="rank-row__body">
                {e.label}
                {e.detail && <span className="muted" style={{ display: 'block', fontSize: '0.9rem' }}>{e.detail}</span>}
                {submitted && (
                  <span style={{ display: 'block', marginTop: 4, fontSize: '0.95rem' }}>
                    {correctPos === i ? <RightMark label="Right place" /> : <WrongMark label={`Belongs at ${correctPos + 1}`} />} — {e.why}
                  </span>
                )}
              </span>
              {!submitted && (
                <span className="rank-row__btns">
                  <button
                    type="button"
                    className="btn btn--secondary btn--small"
                    aria-label={`Move “${e.label}” up`}
                    disabled={i === 0}
                    onClick={() => move(id, i - 1)}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary btn--small"
                    aria-label={`Move “${e.label}” down`}
                    disabled={i === order.length - 1}
                    onClick={() => move(id, i + 1)}
                  >
                    ▼
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}

export const rankComplete = (item: RankItem, v?: RankResponse) => !!v && v.order.length === item.entries.length;
