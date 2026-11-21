/**
 * End-to-end walk through Level 1 in the real app (jsdom): lesson → practice →
 * test → results, then a "reload" to check progress persists.
 */
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { getItem, getLevel } from './content';
import { ProgressProvider } from './state/ProgressContext';
import { emptyProgress, STORAGE_KEY } from './state/progress';
import { oddsUpdate } from './scoring/probability';
import type { Item } from './types/content';

type User = ReturnType<typeof userEvent.setup>;

function currentItem(): { el: HTMLElement; item: Item } {
  const el = screen.getAllByRole('article').at(-1)!;
  const id = el.getAttribute('aria-labelledby')!.replace(/^h-/, '');
  return { el, item: getItem(id)! };
}

/** Answer the visible item correctly (or wrongly), choose a confidence, submit, and continue. */
async function answer(user: User, { right = true, confidence = '90%' } = {}) {
  const { el, item } = currentItem();
  const w = within(el);
  switch (item.type) {
    case 'mc': {
      const idx = item.options.findIndex((o) => (right ? o.correct : !o.correct));
      await user.click(w.getAllByRole('radio').slice(0, item.options.length)[idx]);
      break;
    }
    case 'tag': {
      const groups = w.getAllByRole('group').filter((g) => g.classList.contains('segment'));
      for (let i = 0; i < item.segments.length; i++) {
        const seg = item.segments[i];
        const tagId = right ? seg.answer : item.tagSet.find((t) => t.id !== seg.answer)!.id;
        const label = item.tagSet.find((t) => t.id === tagId)!.label;
        await user.click(within(groups[i]).getByRole('radio', { name: label }));
      }
      break;
    }
    case 'rank': {
      const target = right ? item.correctOrder : [...item.correctOrder].reverse();
      for (let t = 0; t < target.length; t++) {
        const label = item.entries.find((e) => e.id === target[t])!.label;
        for (let guard = 0; guard < 10; guard++) {
          const rows = w.getAllByRole('listitem');
          const pos = rows.findIndex((r) => r.getAttribute('aria-label')!.endsWith(label));
          if (pos <= t) break;
          await user.click(w.getByRole('button', { name: `Move “${label}” up` }));
        }
      }
      break;
    }
    case 'reflection':
      await user.type(w.getByLabelText('Your answer'), 'I would check the source and ask who would know.');
      break;
    case 'grid': {
      const valid = right ? item.answer.valid : !item.answer.valid;
      const cells = w.getAllByRole('radio').filter((r) => r.tagName === 'BUTTON');
      // Cells are laid out valid-row first, then premises-true column first.
      const idx = (valid ? 0 : 2) + (item.answer.premisesTrue ? 0 : 1);
      await user.click(cells[idx]);
      break;
    }
    case 'numeric': {
      const v = right ? item.answer() : item.answer() + 50;
      await user.type(w.getByLabelText(/Your estimate/), String(Math.round(v * 10) / 10));
      break;
    }
    case 'slider': {
      let p = item.prior;
      for (const e of item.evidence) {
        p = right ? oddsUpdate(p, e.likelihoodRatio) : 1 - oddsUpdate(p, e.likelihoodRatio);
        const pctValue = Math.min(99, Math.max(1, Math.round(p * 100)));
        fireEvent.change(w.getByRole('slider'), { target: { value: String(pctValue) } });
        await user.click(w.getByRole('button', { name: /^Lock in/ }));
        p = pctValue / 100;
      }
      break;
    }
    case 'paired': {
      if (item.stancePrompt) await user.click(w.getByRole('radio', { name: item.stancePrompt.options[0].text }));
      const rating = item.side === 'A' ? 6 : 2; // deliberately inconsistent
      await user.click(w.getAllByRole('radio', { name: new RegExp(`^${rating}`) })[0]);
      break;
    }
  }
  if (item.type !== 'reflection' && item.type !== 'paired') {
    await user.click(w.getByRole('radio', { name: new RegExp(`^${confidence}`) }));
  }
  await user.click(w.getByRole('button', { name: 'Submit answer' }));
  const next = w.getAllByRole('button').find((b) => /Next|Finish|See my/.test(b.textContent ?? ''))!;
  await user.click(next);
}

function renderApp() {
  return render(
    <ProgressProvider>
      <App />
    </ProgressProvider>,
  );
}

describe('Level 1 end to end', () => {
  it('goes lesson → practice → test → results, unlocks Level 2, and persists across a reload', async () => {
    window.location.hash = '#/';
    const user = userEvent.setup();
    const { unmount } = renderApp();

    expect(screen.getByRole('heading', { level: 1, name: 'Think Again' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Start at Level 1' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'How do you know?' })).toBeInTheDocument();

    // Lesson: 4 screens, each with a quick check.
    await user.click(screen.getByRole('link', { name: 'Start the lesson' }));
    for (let i = 0; i < 4; i++) {
      expect(await screen.findByText(`Level 1 lesson · screen ${i + 1} of 4`)).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Worked example' })).toBeInTheDocument();
      await answer(user);
    }

    // Practice (5 items), getting one wrong.
    expect(await screen.findByRole('heading', { level: 1, name: 'Level 1 practice' })).toBeInTheDocument();
    await answer(user, { right: false, confidence: '99%' });
    for (let i = 1; i < 5; i++) await answer(user);
    expect(await screen.findByText(/You got 3 of 4 scored practice questions right/)).toBeInTheDocument();

    // Test: 8 items.
    await user.click(screen.getByRole('link', { name: 'Take the Level 1 test' }));
    await user.click(await screen.findByRole('button', { name: 'Start the test' }));
    for (let i = 0; i < 8; i++) {
      expect(await screen.findByText(`Level 1 test · question ${i + 1} of 8`)).toBeInTheDocument();
      await answer(user, { right: i !== 0, confidence: '80%' });
    }

    // Results
    expect(await screen.findByRole('heading', { level: 1, name: 'Level 1 test results' })).toBeInTheDocument();
    expect(screen.getByText('✓ Passed.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Skills in this test/ })).toBeInTheDocument();
    expect(screen.getAllByText(/When you said 80% sure, you were right/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Brier score/)).toBeInTheDocument();

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(saved.unlockedThrough).toBe(2);
    expect(saved.levels[1]).toEqual({ lessonDone: true, practiceDone: true, passed: true });

    // "Reload": unmount and render fresh from storage.
    unmount();
    act(() => {
      window.location.hash = '#/profile';
    });
    renderApp();
    expect(await screen.findByRole('heading', { level: 1, name: 'Your results' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skill profile' })).toBeInTheDocument();
    expect(screen.getByText(/Level 1 test/)).toBeInTheDocument();
    expect(screen.getAllByText(/When you said 99% sure, you were right 0% of the time/).length).toBeGreaterThan(0);
  }, 30000);

  it('resumes a test in progress after a reload', async () => {
    window.location.hash = '#/level/1/test';
    const user = userEvent.setup();
    const { unmount } = renderApp();
    await user.click(await screen.findByRole('button', { name: 'Start the test' }));
    await answer(user);
    await answer(user);
    expect(await screen.findByText('Level 1 test · question 3 of 8')).toBeInTheDocument();
    unmount();
    renderApp();
    expect(await screen.findByText('Level 1 test · question 3 of 8')).toBeInTheDocument();
  });

  it('keeps locked levels locked', async () => {
    window.location.hash = '#/level/2';
    renderApp();
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/Level 2/);
  });

  it.each([2, 3, 4, 5] as const)('walks the whole Level %i lesson, with every quick check answered', async (level) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress(), unlockedThrough: 5 }));
    window.location.hash = `#/level/${level}/lesson/0`;
    const user = userEvent.setup();
    renderApp();
    const total = (await screen.findByText(/lesson · screen 1 of/)).textContent!.match(/of (\d+)/)![1];
    for (let i = 0; i < Number(total); i++) {
      expect(await screen.findByText(`Level ${level} lesson · screen ${i + 1} of ${total}`)).toBeInTheDocument();
      if (screen.queryByRole('button', { name: /Show the next piece of evidence/ })) {
        // Probability walkthrough: step through to the end.
        while (screen.queryByRole('button', { name: /Show the next piece of evidence/ })) {
          await user.click(screen.getByRole('button', { name: /Show the next piece of evidence/ }));
        }
        expect(screen.getByRole('button', { name: 'Start again' })).toBeInTheDocument();
      }
      await answer(user);
    }
    expect(await screen.findByRole('heading', { level: 1, name: `Level ${level} practice` })).toBeInTheDocument();
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(saved.levels[level].lessonDone).toBe(true);
    const checks = saved.attempts.filter((a: { runId: string }) => a.runId === `check-l${level}`);
    expect(checks.length).toBe(Number(total));
    expect(checks.every((a: { correct: boolean | null }) => a.correct !== false)).toBe(true);
  }, 30000);

  it('Level 4 practice holds back paired-study feedback and reveals the double standard at the end', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress(), unlockedThrough: 4 }));
    window.location.hash = '#/level/4/practice';
    const user = userEvent.setup();
    renderApp();
    expect(await screen.findByRole('heading', { level: 1, name: 'Level 4 practice' })).toBeInTheDocument();
    await answer(user); // paired side A (stance asked first)
    for (let i = 1; i < 6; i++) await answer(user);
    expect(await screen.findByRole('heading', { name: 'Did you judge both sides the same way?' })).toBeInTheDocument();
    expect(screen.getByText('✗ Double standard detected')).toBeInTheDocument();
  }, 30000);

  it('Level 4 test includes a paired-framing pair, side A first, and 2 earlier-level questions', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress(), unlockedThrough: 4 }));
    window.location.hash = '#/level/4/test';
    const user = userEvent.setup();
    renderApp();
    await user.click(await screen.findByRole('button', { name: 'Start the test' }));
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    const ids: string[] = saved.runs[0].itemIds;
    expect(ids).toHaveLength(8);
    const items = ids.map((id) => getItem(id)!);
    const paired = items.filter((i) => i.type === 'paired');
    expect(paired).toHaveLength(2);
    expect(paired[0].type === 'paired' && paired[0].side).toBe('A');
    expect(items.filter((i) => i.level < 4)).toHaveLength(2);
  });

  it.each([
    ['answering everything right recommends Level 5', true, 5],
    ['missing the Level 1 questions recommends Level 1', false, 1],
  ] as const)('placement: %s, and choosing a start unlocks it', async (_, allRight, expected) => {
    window.location.hash = '#/placement';
    const user = userEvent.setup();
    renderApp();
    await user.click(await screen.findByRole('button', { name: 'Start the placement check' }));
    for (let i = 0; i < 10; i++) {
      expect(await screen.findByText(`Placement check · question ${i + 1} of 10`)).toBeInTheDocument();
      await answer(user, { right: allRight || i >= 2 });
    }
    expect(await screen.findByRole('heading', { level: 1, name: 'Placement check results' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(`Recommended start: Level ${expected}`) })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: `Start at Level ${expected} (recommended)` }));
    expect(await screen.findByRole('heading', { level: 1, name: new RegExp(getLevel(expected)!.title.replace('.', '\\.')) })).toBeInTheDocument();
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(saved.placement).toMatchObject({ recommended: expected, chosen: expected });
    expect(saved.unlockedThrough).toBe(expected);
  }, 30000);

  it('final assessment is locked until Level 5 is passed', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress(), unlockedThrough: 5 }));
    window.location.hash = '#/final';
    renderApp();
    expect(await screen.findByRole('heading', { level: 1, name: 'Final assessment is locked' })).toBeInTheDocument();
  });

  it('final assessment: 20 mixed questions, then results by level with the paired-study reveal', async () => {
    const p = emptyProgress();
    p.unlockedThrough = 5;
    p.levels[5].passed = true;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    window.location.hash = '#/final';
    const user = userEvent.setup();
    renderApp();
    await user.click(await screen.findByRole('button', { name: 'Start the final assessment' }));
    for (let i = 0; i < 20; i++) {
      expect(await screen.findByText(`Final assessment · question ${i + 1} of 20`)).toBeInTheDocument();
      await answer(user);
    }
    expect(await screen.findByRole('heading', { level: 1, name: 'Final assessment results' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Score by level' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Did you judge both sides the same way?' })).toBeInTheDocument();
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    const levels = saved.runs[0].itemIds.map((id: string) => getItem(id)!.level);
    expect(levels.filter((l: number) => l >= 3).length).toBe(15);
  }, 60000);
});
