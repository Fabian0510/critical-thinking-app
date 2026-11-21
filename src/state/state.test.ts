import { describe, expect, it } from 'vitest';
import { activeRun, emptyProgress, loadProgress, parseProgress, reducer, saveProgress } from './progress';
import { createStorage } from './storage';

describe('storage', () => {
  it('falls back to memory when localStorage throws', () => {
    const broken = {
      setItem() {
        throw new Error('blocked');
      },
      getItem() {
        throw new Error('blocked');
      },
      removeItem() {},
    } as unknown as Storage;
    const s = createStorage(broken);
    expect(s.persistent).toBe(false);
    expect(s.set('k', 'v')).toBe(true);
    expect(s.get('k')).toBe('v');
  });
  it('falls back to memory when there is no storage at all', () => {
    const s = createStorage(null);
    s.set('k', 'v');
    expect(s.get('k')).toBe('v');
  });
  it('round-trips progress through real localStorage', () => {
    const s = createStorage();
    expect(s.persistent).toBe(true);
    const p = reducer(emptyProgress(), { type: 'lesson-done', level: 1 });
    saveProgress(s, p);
    expect(loadProgress(s).levels[1].lessonDone).toBe(true);
  });
});

describe('progress reducer', () => {
  const run = { id: 'r1', kind: 'level' as const, level: 1 as const, itemIds: ['a'], startedAt: 0 };
  it('unlocks the next level only when a level test is passed', () => {
    let p = reducer(emptyProgress(), { type: 'start-run', run });
    expect(activeRun(p, 'level', 1)?.id).toBe('r1');
    p = reducer(p, { type: 'finish-run', runId: 'r1', score: 0.5, passed: false, at: 1 });
    expect(p.unlockedThrough).toBe(1);
    expect(activeRun(p, 'level', 1)).toBeUndefined();
    p = reducer(p, { type: 'start-run', run: { ...run, id: 'r2' } });
    p = reducer(p, { type: 'finish-run', runId: 'r2', score: 0.8, passed: true, at: 2 });
    expect(p.unlockedThrough).toBe(2);
    expect(p.levels[1].passed).toBe(true);
  });
  it('replaces a re-answered item within a run', () => {
    const a = { itemId: 'x', runId: 'r1', context: 'test' as const, ts: 0, response: { choice: 'a' }, score: 0, correct: false };
    let p = reducer(emptyProgress(), { type: 'record-attempt', attempt: a });
    p = reducer(p, { type: 'record-attempt', attempt: { ...a, score: 1, correct: true } });
    expect(p.attempts).toHaveLength(1);
    expect(p.attempts[0].score).toBe(1);
  });
  it('lets placement unlock up to the chosen level', () => {
    let p = reducer(emptyProgress(), { type: 'placement-result', runId: 'pl', recommended: 3 });
    p = reducer(p, { type: 'choose-start', level: 3 });
    expect(p.unlockedThrough).toBe(3);
  });
  it('recovers from corrupt stored data', () => {
    expect(parseProgress('{not json')).toEqual(emptyProgress());
    expect(parseProgress('{"version":99}')).toEqual(emptyProgress());
  });
});
