import type { TagItem } from '../../types/content';
import type { TagResponse } from '../../types/progress';
import { Rich } from '../Rich';
import { RightMark, WrongMark } from './Marks';
import type { InputProps } from './types';

/** Each pre-cut segment of the passage gets one tag, chosen from the item's tag set. */
export function TagSpans({ item, value, onChange, submitted }: InputProps<TagItem, TagResponse>) {
  const tags = value?.tags ?? {};
  const label = (id: string) => item.tagSet.find((t) => t.id === id)?.label ?? id;
  return (
    <div>
      <details className="muted" style={{ marginBottom: 12 }}>
        <summary>What the labels mean</summary>
        <ul>
          {item.tagSet.map((t) => (
            <li key={t.id}>
              <strong>{t.label}</strong>: {t.hint}
            </li>
          ))}
        </ul>
      </details>
      {item.segments.map((s, i) => {
        const chosen = tags[s.id];
        const right = chosen === s.answer;
        return (
          <fieldset key={s.id} className="segment">
            <legend className="segment__text" style={{ fontWeight: 400 }}>
              <span className="sr-only">Part {i + 1}: </span>“<Rich text={s.text} />”
            </legend>
            <div className="chips" role="presentation">
              {item.tagSet.map((t) => (
                <label key={t.id} className="chip">
                  <input
                    type="radio"
                    name={`tag-${item.id}-${s.id}`}
                    value={t.id}
                    checked={chosen === t.id}
                    disabled={submitted}
                    onChange={() => onChange({ tags: { ...tags, [s.id]: t.id } })}
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
            {submitted && (
              <p style={{ margin: '8px 0 0' }}>
                {right ? <RightMark /> : <WrongMark label={`It’s “${label(s.answer)}”`} />} — <Rich text={s.why} />
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

export const tagComplete = (item: TagItem, v?: TagResponse) => !!v && item.segments.every((s) => v.tags[s.id]);
