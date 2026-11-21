import type { ReflectionItem } from '../../types/content';
import type { ReflectionResponse } from '../../types/progress';
import { Rich } from '../Rich';
import type { FeedbackProps, InputProps } from './types';

export function Reflection({ item, value, onChange, submitted }: InputProps<ReflectionItem, ReflectionResponse>) {
  const id = `refl-${item.id}`;
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
        Your answer
      </label>
      <textarea
        id={id}
        rows={5}
        value={value?.text ?? ''}
        readOnly={submitted}
        onChange={(e) => onChange({ text: e.target.value, selfCheck: value?.selfCheck ?? item.rubric.map(() => false) })}
      />
      <p className="muted" style={{ fontSize: '0.9rem', marginTop: 6 }}>
        This isn’t marked automatically. After you submit, you’ll see example answers and a short checklist to judge your own.
      </p>
    </div>
  );
}

/** Model answers plus a self-assessment checklist. Ticking boxes updates the saved attempt. */
export function ReflectionFeedback({
  item,
  value,
  onChange,
}: FeedbackProps<ReflectionItem, ReflectionResponse> & { onChange: (v: ReflectionResponse) => void }) {
  return (
    <>
      <h4 style={{ margin: '4px 0' }}>Example answers</h4>
      <ul>
        {item.modelAnswers.map((m, i) => (
          <li key={i}>
            <Rich text={m} />
          </li>
        ))}
      </ul>
      <fieldset>
        <legend>Check your own answer. Did it…</legend>
        {item.rubric.map((r, i) => (
          <label key={i} className="choice">
            <input
              type="checkbox"
              checked={value.selfCheck[i] ?? false}
              onChange={(e) => {
                const selfCheck = item.rubric.map((_, j) => (j === i ? e.target.checked : (value.selfCheck[j] ?? false)));
                onChange({ ...value, selfCheck });
              }}
            />
            <span>{r}</span>
          </label>
        ))}
      </fieldset>
    </>
  );
}

export const reflectionComplete = (_: ReflectionItem, v?: ReflectionResponse) => !!v && v.text.trim().length >= 10;
