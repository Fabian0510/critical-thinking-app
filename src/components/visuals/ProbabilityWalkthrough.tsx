import { useState } from 'react';
import { updateTrajectory } from '../../scoring/probability';
import { Rich } from '../Rich';

const pctText = (p: number) => `${Math.round(p * 100)}%`;

/**
 * A worked, ungraded walk through evidence cards. Each "Show next" reveals a card
 * and moves a probability bar to the value Bayes' rule gives (computed, not typed in).
 * The bar's value is always written as text too.
 */
export function ProbabilityWalkthrough({
  hypothesis,
  prior,
  steps,
}: {
  hypothesis: string;
  prior: number;
  steps: { text: string; likelihoodRatio: number }[];
}) {
  const [shown, setShown] = useState(0);
  const trajectory = updateTrajectory(
    prior,
    steps.map((s) => s.likelihoodRatio),
  );
  const current = shown === 0 ? prior : trajectory[shown - 1];
  const strength = (lr: number) =>
    lr >= 1
      ? `${lr % 1 === 0 ? lr : lr.toFixed(1)} times as likely if the idea is true`
      : `${(1 / lr) % 1 === 0 ? 1 / lr : (1 / lr).toFixed(1)} times as likely if the idea is false`;

  return (
    <figure className="card stack" style={{ margin: 0 }} aria-label="Probability walkthrough">
      <div>
        <div className="eyebrow">Try it: watch a probability update</div>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Idea:</strong> <Rich text={hypothesis} />
        </p>
      </div>
      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>How likely now</span>
          <strong aria-live="polite">{pctText(current)}</strong>
        </div>
        <div className="skill-bar__track" aria-hidden="true">
          <div className="skill-bar__fill" style={{ width: `${current * 100}%` }} />
        </div>
      </div>
      <ol style={{ paddingLeft: 22, margin: 0 }}>
        <li>
          Starting point: <strong>{pctText(prior)}</strong>
        </li>
        {steps.slice(0, shown).map((s, i) => (
          <li key={i}>
            <Rich text={s.text} />{' '}
            <span className="muted">
              (Evidence {strength(s.likelihoodRatio)}.) {pctText(i === 0 ? prior : trajectory[i - 1])} → <strong>{pctText(trajectory[i])}</strong>
            </span>
          </li>
        ))}
      </ol>
      <div className="row">
        {shown < steps.length ? (
          <button type="button" className="btn btn--secondary" onClick={() => setShown(shown + 1)}>
            Show the next piece of evidence ({shown + 1} of {steps.length})
          </button>
        ) : (
          <button type="button" className="btn btn--secondary" onClick={() => setShown(0)}>
            Start again
          </button>
        )}
      </div>
    </figure>
  );
}
