import { CONFIDENCES, type Confidence } from '../../types/content';

const HINTS: Partial<Record<Confidence, string>> = { 0.5: 'coin flip', 0.99: 'near certain' };

export function ConfidencePicker({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value?: Confidence;
  onChange: (c: Confidence) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset>
      <legend>How sure are you that your answer is right?</legend>
      <div className="chips">
        {CONFIDENCES.map((c) => (
          <label key={c} className="chip">
            <input type="radio" name={name} checked={value === c} disabled={disabled} onChange={() => onChange(c)} />
            <span>
              {Math.round(c * 100)}%{HINTS[c] && <small> {HINTS[c]}</small>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
