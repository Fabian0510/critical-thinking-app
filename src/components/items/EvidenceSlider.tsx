import { useState } from 'react';
import type { SliderItem } from '../../types/content';
import type { SliderResponse } from '../../types/progress';
import { sliderSteps } from '../../scoring/scoreItem';
import { Rich } from '../Rich';
import { RightMark, WrongMark } from './Marks';
import type { FeedbackProps, InputProps } from './types';

const pctText = (p: number) => `${Math.round(p * 100)}%`;

/**
 * Evidence cards are revealed one at a time. After each, the learner moves the
 * slider to their new estimate and locks it in. Earlier estimates can't be changed.
 */
export function EvidenceSlider({ item, value, onChange, submitted }: InputProps<SliderItem, SliderResponse>) {
  const locked = value?.estimates ?? [];
  const prev = locked.length ? locked[locked.length - 1] : item.prior;
  const [current, setCurrent] = useState(Math.round(prev * 100));
  const step = locked.length;
  const done = step >= item.evidence.length;
  const sliderId = `slider-${item.id}`;

  return (
    <div>
      <div className="scenario">
        <div className="scenario__label">Hypothesis</div>
        <p style={{ margin: 0 }}>
          <Rich text={item.hypothesis} />
        </p>
        <p className="muted" style={{ margin: '6px 0 0' }}>
          Starting estimate: <strong>{pctText(item.prior)}</strong> likely to be true.
        </p>
      </div>
      <ol style={{ paddingLeft: 22 }}>
        {item.evidence.slice(0, Math.min(step + 1, item.evidence.length)).map((card, i) => (
          <li key={card.id} style={{ marginBottom: 12 }}>
            <div className="card" style={{ padding: 12 }}>
              <div className="eyebrow">Evidence {i + 1} of {item.evidence.length}</div>
              <Rich text={card.text} />
              {i < step && (
                <p style={{ margin: '6px 0 0' }}>
                  Your estimate after this: <strong>{pctText(locked[i])}</strong>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      {!done && !submitted && (
        <div className="card" style={{ padding: 12 }}>
          <label htmlFor={sliderId} style={{ fontWeight: 600 }}>
            How likely is the hypothesis now? <output htmlFor={sliderId}>{current}%</output>
          </label>
          <input
            id={sliderId}
            type="range"
            min={1}
            max={99}
            step={1}
            value={current}
            aria-valuetext={`${current}%`}
            onChange={(e) => setCurrent(Number(e.target.value))}
          />
          <div className="row" style={{ justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span className="muted">1% almost certainly false</span>
            <span className="muted">99% almost certainly true</span>
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            style={{ marginTop: 8 }}
            onClick={() => onChange({ estimates: [...locked, current / 100] })}
          >
            Lock in {current}%{step < item.evidence.length - 1 ? ' and see the next evidence' : ''}
          </button>
        </div>
      )}
      {done && !submitted && <p className="muted">All evidence seen. Submit when ready.</p>}
    </div>
  );
}

export function SliderFeedback({ item, value }: FeedbackProps<SliderItem, SliderResponse>) {
  const steps = sliderSteps(item, value);
  return (
    <>
      <p>
        Each step is judged from <em>your own</em> previous estimate: did you move in the right direction, and roughly the right
        amount? The “about right” figure is what Bayes’ rule gives for how strong that evidence is.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Evidence</th>
              <th scope="col">You moved</th>
              <th scope="col">About right</th>
              <th scope="col">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {pctText(s.from)} → {pctText(s.to)}
                </td>
                <td>{pctText(s.target)}</td>
                <td>
                  {s.directionOk ? <RightMark label="Direction" /> : <WrongMark label="Direction" />}
                  <br />
                  {s.magnitude === 1 ? (
                    <RightMark label="Size" />
                  ) : s.magnitude === 0.5 ? (
                    <span className="mark mark--partial">◐ Size roughly</span>
                  ) : (
                    <WrongMark label="Size" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ol style={{ paddingLeft: 22 }}>
        {item.evidence.map((e) => (
          <li key={e.id}>
            <Rich text={e.why} />
          </li>
        ))}
      </ol>
    </>
  );
}

export const sliderComplete = (item: SliderItem, v?: SliderResponse) => !!v && v.estimates.length === item.evidence.length;
