import { useState } from 'react';
import type { NumericItem } from '../../types/content';
import type { NumericResponse } from '../../types/progress';
import { round } from '../../scoring/probability';
import { Paragraphs } from '../Rich';
import { PopulationGrid } from '../visuals/PopulationGrid';
import type { FeedbackProps, InputProps } from './types';

const UNIT: Record<NumericItem['unit'], string> = { percent: '%', people: 'people', number: '' };

export function parseNumber(s: string): number {
  const cleaned = s.replace(/[,%\s]/g, '');
  return cleaned === '' ? NaN : Number(cleaned);
}

export function NumericEstimate({ item, value, onChange, submitted }: InputProps<NumericItem, NumericResponse>) {
  const [text, setText] = useState(value && Number.isFinite(value.value) ? String(value.value) : '');
  const id = `num-${item.id}`;
  const invalid = text.trim() !== '' && !Number.isFinite(parseNumber(text));
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
        Your estimate{UNIT[item.unit] ? ` (${UNIT[item.unit]})` : ''}
      </label>
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          disabled={submitted}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
          style={{ maxWidth: 160 }}
          onChange={(e) => {
            setText(e.target.value);
            onChange({ value: parseNumber(e.target.value) });
          }}
        />
        <span aria-hidden="true">{UNIT[item.unit]}</span>
      </div>
      {invalid && (
        <p id={`${id}-err`} className="mark--incorrect" style={{ marginTop: 6 }}>
          Please enter a number.
        </p>
      )}
    </div>
  );
}

export function NumericFeedback({ item, value }: FeedbackProps<NumericItem, NumericResponse>) {
  const answer = item.answer();
  const unit = UNIT[item.unit];
  const matched = item.commonErrors?.find((e) => Math.abs(value.value - e.value()) <= e.tolerance);
  return (
    <>
      <p>
        The answer is <strong>{round(answer, 1)}{unit === '%' ? '%' : ` ${unit}`}</strong> (anything within ±{item.tolerance}
        {unit === '%' ? ' percentage points' : ''} counts). You said {Number.isFinite(value.value) ? value.value : '—'}
        {unit === '%' ? '%' : ''}.
      </p>
      {matched && (
        <p>
          <strong>Why your answer is tempting: </strong>
          {matched.explanation}
        </p>
      )}
      <Paragraphs text={item.solution} />
      {item.populationGrid && <PopulationGrid {...item.populationGrid} />}
    </>
  );
}

export const numericComplete = (_: NumericItem, v?: NumericResponse) => !!v && Number.isFinite(v.value);
