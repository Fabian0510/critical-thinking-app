import type { PairedItem } from '../../types/content';
import type { PairedResponse } from '../../types/progress';
import { Paragraphs } from '../Rich';
import type { InputProps } from './types';

export const RATING_LABELS = ['Very weak', 'Weak', 'Fairly weak', 'Middling', 'Fairly strong', 'Strong', 'Very strong'];

/**
 * Rate how strongly a study supports its conclusion (1–7). Its near-twin, supporting
 * the opposite conclusion, appears later in the same test; the gap is revealed at the end.
 */
export function PairedRating({ item, value, onChange, submitted }: InputProps<PairedItem, PairedResponse>) {
  const needsStance = !!item.stancePrompt;
  const stanceChosen = !needsStance || !!value?.stance;
  return (
    <div className="stack">
      {item.stancePrompt && (
        <fieldset>
          <legend>{item.stancePrompt.question}</legend>
          <div className="chips">
            {item.stancePrompt.options.map((o) => (
              <label key={o.id} className="chip">
                <input
                  type="radio"
                  name={`stance-${item.id}`}
                  checked={value?.stance === o.id}
                  disabled={submitted}
                  onChange={() => onChange({ rating: value?.rating ?? 0, stance: o.id })}
                />
                <span>{o.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {stanceChosen && (
        <>
          <div className="scenario">
            <div className="scenario__label">{item.study.label}</div>
            {item.study.title && <h3>{item.study.title}</h3>}
            <Paragraphs text={item.study.body} />
          </div>
          <fieldset>
            <legend>How strongly does this study support its conclusion?</legend>
            <div className="chips">
              {RATING_LABELS.map((label, i) => (
                <label key={i} className="chip">
                  <input
                    type="radio"
                    name={`rating-${item.id}`}
                    checked={value?.rating === i + 1}
                    disabled={submitted}
                    onChange={() => onChange({ rating: i + 1, stance: value?.stance })}
                  />
                  <span>
                    {i + 1}
                    <small>{label}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}
    </div>
  );
}

export const pairedComplete = (item: PairedItem, v?: PairedResponse) =>
  !!v && v.rating >= 1 && v.rating <= 7 && (!item.stancePrompt || !!v.stance);
