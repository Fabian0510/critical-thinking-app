import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  sampleGrid,
  sampleMC,
  sampleNumeric,
  samplePairA,
  sampleRank,
  sampleReflection,
  sampleSlider,
  sampleTag,
} from '../../test-fixtures';
import type { Item } from '../../types/content';
import { ItemCard } from './ItemCard';
import { initialRankOrder } from './RankList';

function setup(item: Item, extra: Partial<Parameters<typeof ItemCard>[0]> = {}) {
  const onSubmit = vi.fn();
  const onNext = vi.fn();
  const user = userEvent.setup();
  render(<ItemCard item={item} onSubmit={onSubmit} onNext={onNext} {...extra} />);
  const submit = () => screen.getByRole('button', { name: 'Submit answer' });
  return { user, onSubmit, onNext, submit };
}

async function pickConfidence(user: ReturnType<typeof userEvent.setup>, label = '80%') {
  await user.click(screen.getByRole('radio', { name: label }));
}

describe('MultipleChoice', () => {
  it('needs an answer and a confidence, then explains every option', async () => {
    const { user, onSubmit, submit, onNext } = setup(sampleMC);
    expect(submit()).toBeDisabled();
    // keyboard: tab to first option, arrow to choose
    await user.click(screen.getByRole('radio', { name: /Ask the group/ }));
    expect(submit()).toBeDisabled();
    expect(screen.getByText(/Choose how sure you are/)).toBeInTheDocument();
    await pickConfidence(user, '90%');
    await user.click(submit());
    expect(onSubmit).toHaveBeenCalledWith({ choice: 'b' }, { score: 0, correct: false }, 0.9);
    expect(screen.getByText('✗ Not right.')).toBeInTheDocument();
    expect(screen.getByText(/Agreement is not checking/)).toBeInTheDocument();
    expect(screen.getByText(/Goes to the source/)).toBeInTheDocument();
    expect(screen.getByText(/You said you were 90% sure/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalled();
  });
  it('can be answered with the keyboard alone', async () => {
    const { user, onSubmit } = setup(sampleMC);
    await user.tab(); // first radio of the option group
    await user.keyboard(' ');
    await user.tab(); // into confidence group
    await user.keyboard('{ArrowRight}{ArrowRight}');
    await user.tab(); // submit button
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ choice: 'a' });
  });
});

describe('TagSpans', () => {
  it('tags every segment and gives per-segment feedback', async () => {
    const { user, onSubmit, submit } = setup(sampleTag);
    const [claim1, , , evidence2] = screen.getAllByRole('radio').slice(0, 4);
    await user.click(claim1);
    expect(submit()).toBeDisabled();
    await user.click(evidence2);
    await pickConfidence(user);
    await user.click(submit());
    expect(onSubmit.mock.calls[0][1]).toEqual({ score: 1, correct: true });
    expect(screen.getByText('✓ Right.')).toBeInTheDocument();
    expect(screen.getByText(/Offered as support/)).toBeInTheDocument();
  });
});

describe('RankList', () => {
  it('never starts in the correct order', () => {
    expect(initialRankOrder(sampleRank)).not.toEqual(sampleRank.correctOrder);
  });
  it('reorders with Up/Down buttons and scores the order', async () => {
    const { user, onSubmit, submit } = setup(sampleRank);
    // Bubble the best entry to the top using buttons.
    for (let i = 0; i < 3; i++) {
      const up = screen.getByRole('button', { name: 'Move “Measure it for a month” up' });
      if (up.hasAttribute('disabled')) break;
      await user.click(up);
    }
    for (let i = 0; i < 3; i++) {
      const up = screen.getByRole('button', { name: 'Move “Measure it once” up' });
      const items = screen.getAllByRole('listitem');
      if (items[1].getAttribute('aria-label')?.includes('Measure it once')) break;
      await user.click(up);
    }
    const labels = screen.getAllByRole('listitem').map((li) => li.getAttribute('aria-label'));
    expect(labels).toEqual(['1. Measure it for a month', '2. Measure it once', '3. Hear a rumour']);
    await pickConfidence(user);
    await user.click(submit());
    expect(onSubmit.mock.calls[0][0]).toEqual({ order: ['x', 'y', 'z'] });
    expect(screen.getByText(/More direct checking/)).toBeInTheDocument();
  });
  it('supports Alt+Arrow on a focused row', async () => {
    const { user } = setup(sampleRank);
    const first = screen.getAllByRole('listitem')[0];
    const label = first.getAttribute('aria-label')!.slice(3);
    first.focus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(screen.getAllByRole('listitem')[1].getAttribute('aria-label')).toBe(`2. ${label}`);
    expect(screen.getByText(new RegExp(`moved to position 2 of 3`))).toBeInTheDocument();
  });
});

describe('ValiditySoundnessGrid', () => {
  it('selects a cell and explains the right one', async () => {
    const { user, onSubmit, submit } = setup(sampleGrid);
    await user.click(screen.getByRole('radio', { name: /Valid, but a premise is false/ }));
    await pickConfidence(user);
    await user.click(submit());
    expect(onSubmit.mock.calls[0][1]).toEqual({ score: 0.5, correct: false });
    expect(screen.getByText(/Valid and the premises are true, so sound/)).toBeInTheDocument();
    expect(screen.getByText(/About your choice/)).toBeInTheDocument();
  });
});

describe('NumericEstimate', () => {
  it('accepts a typed estimate and flags the common error', async () => {
    const { user, onSubmit, submit } = setup(sampleNumeric);
    await user.type(screen.getByLabelText(/Your estimate/), '95');
    await pickConfidence(user);
    await user.click(submit());
    expect(onSubmit.mock.calls[0][0]).toEqual({ value: 95 });
    expect(screen.getByText(/That is the accuracy, not the answer/)).toBeInTheDocument();
    expect(screen.getByText(/The answer is/)).toHaveTextContent('16.1%');
    expect(screen.getByRole('img', { name: /Of 1,000 people/ })).toBeInTheDocument();
  });
  it('rejects non-numbers', async () => {
    const { user, submit } = setup(sampleNumeric);
    await user.type(screen.getByLabelText(/Your estimate/), 'abc');
    expect(screen.getByText('Please enter a number.')).toBeInTheDocument();
    await pickConfidence(user);
    expect(submit()).toBeDisabled();
  });
});

describe('EvidenceSlider', () => {
  it('reveals evidence one card at a time and scores each update', async () => {
    const { user, onSubmit, submit } = setup(sampleSlider);
    expect(screen.queryByText(/timetable/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
    await user.click(screen.getByRole('button', { name: /Lock in 75% and see the next evidence/ }));
    expect(screen.getByText(/timetable/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '38' } });
    await user.click(screen.getByRole('button', { name: /Lock in 38%/ }));
    await pickConfidence(user);
    await user.click(submit());
    expect(onSubmit.mock.calls[0][0]).toEqual({ estimates: [0.75, 0.38] });
    expect(onSubmit.mock.calls[0][1].correct).toBe(true);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

describe('PairedRating', () => {
  it('asks for a stance first, takes no confidence, and can defer feedback', async () => {
    const { user, onSubmit, submit } = setup(samplePairA, { deferFeedback: true });
    expect(screen.queryByText(/survey of 200/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'For' }));
    await user.click(screen.getByRole('radio', { name: /6\s*Strong/ }));
    expect(screen.queryByText(/How sure are you/)).not.toBeInTheDocument();
    await user.click(submit());
    expect(onSubmit).toHaveBeenCalledWith({ rating: 6, stance: 'for' }, { score: null, correct: null }, undefined);
    expect(screen.getByText(/feedback on this one at the end/)).toBeInTheDocument();
  });
});

describe('Reflection', () => {
  it('shows model answers and a self-check rubric after submitting', async () => {
    const onUpdate = vi.fn();
    const { user, onSubmit, submit } = setup(sampleReflection, { onUpdate });
    await user.type(screen.getByLabelText('Your answer'), 'A fair test showing the opposite result.');
    await user.click(submit());
    expect(onSubmit.mock.calls[0][1]).toEqual({ score: null, correct: null });
    expect(screen.getByText(/Independent source/i)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Names specific evidence' }));
    expect(onUpdate).toHaveBeenLastCalledWith({ text: 'A fair test showing the opposite result.', selfCheck: [true, false] });
  });
});

describe('ItemCard resume', () => {
  it('renders an already-answered item in its submitted state', () => {
    setup(sampleMC, { initial: { response: { choice: 'a' }, confidence: 0.7 } });
    expect(screen.queryByRole('button', { name: 'Submit answer' })).not.toBeInTheDocument();
    expect(screen.getByText('✓ Right.')).toBeInTheDocument();
  });
});
