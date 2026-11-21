import type { MCItem } from '../../types/content';
import type { McResponse } from '../../types/progress';
import { Rich } from '../Rich';
import { RightMark, WrongMark } from './Marks';
import type { InputProps } from './types';

export function MultipleChoice({ item, value, onChange, submitted }: InputProps<MCItem, McResponse>) {
  return (
    <fieldset>
      <legend className="sr-only">Choose one answer</legend>
      {item.options.map((o) => {
        const chosen = value?.choice === o.id;
        const cls = submitted ? (o.correct ? 'choice choice--correct' : chosen ? 'choice choice--incorrect' : 'choice') : 'choice';
        return (
          <label key={o.id} className={cls}>
            <input
              type="radio"
              name={`mc-${item.id}`}
              value={o.id}
              checked={chosen}
              disabled={submitted}
              onChange={() => onChange({ choice: o.id })}
            />
            <span>
              <Rich text={o.text} />
              {submitted && (
                <span className="choice__explain" style={{ display: 'block' }}>
                  {o.correct ? <RightMark label="Correct answer" /> : chosen ? <WrongMark label="Your answer" /> : null}
                  {(o.correct || chosen) && ' — '}
                  <Rich text={o.explanation} />
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export const mcComplete = (_: MCItem, v?: McResponse) => !!v?.choice;
