import { findScreen, getItem } from '../../content';
import { href } from '../../router';
import type { PairedResult } from '../../scoring/paired';
import type { Recommendation } from '../../scoring/recommend';
import { RATING_LABELS } from '../items/PairedRating';
import { Paragraphs } from '../Rich';

export function BrierLine({ brier, n }: { brier: number | null; n: number }) {
  if (brier === null) return null;
  return (
    <p>
      <strong>Brier score: {brier.toFixed(3)}</strong> across {n} {n === 1 ? 'answer' : 'answers'}.{' '}
      <span className="muted">
        0 is perfect; always saying “50%” would score 0.250. Lower is better: it rewards being right <em>and</em> being honest
        about how sure you are.
      </span>
    </p>
  );
}

export function PairedReveal({ results }: { results: PairedResult[] }) {
  if (results.length === 0) return null;
  return (
    <section className="stack">
      <h2>Did you judge both sides the same way?</h2>
      {results.map((r) => (
        <div key={`${r.runId}-${r.pairId}`} className={`feedback ${r.inconsistent ? 'feedback--incorrect' : 'feedback--correct'}`}>
          <h3>{r.inconsistent ? '✗ Double standard detected' : '✓ Consistent'}</h3>
          <p>
            Two of the studies you rated were near-identical — same design, same sample, same method. The only difference was
            which conclusion they reached.
          </p>
          <ul>
            <li>
              Supporting “{r.itemA.stancePrompt?.options.find((o) => o.id === r.itemA.supports)?.text ?? r.itemA.supports}”: you rated it{' '}
              <strong>
                {r.ratingA}/7 ({RATING_LABELS[r.ratingA - 1]})
              </strong>
            </li>
            <li>
              Supporting “{r.itemA.stancePrompt?.options.find((o) => o.id === r.itemB.supports)?.text ?? r.itemB.supports}”: you rated it{' '}
              <strong>
                {r.ratingB}/7 ({RATING_LABELS[r.ratingB - 1]})
              </strong>
            </li>
          </ul>
          {r.inconsistent ? (
            <p>
              A gap of {r.gap} points.{' '}
              {r.favouredOwnSide === true && 'The study you rated higher was the one supporting the side you said you favour. '}
              {r.favouredOwnSide === false && 'Interestingly, you rated the study against your own side higher — over-correcting is a bias too. '}
              Same evidence, different verdict: that’s the signature of motivated reasoning, and it happens to almost everyone.
            </p>
          ) : (
            <p>Your ratings were within a point of each other — you judged the method, not the conclusion.</p>
          )}
        </div>
      ))}
    </section>
  );
}

export function Recommendations({ recs }: { recs: Recommendation[] }) {
  if (recs.length === 0) return null;
  return (
    <section>
      <h2>What to work on next</h2>
      <ol className="stack" style={{ paddingLeft: 20 }}>
        {recs.map((r) => {
          const loc = findScreen(r.screenId);
          return (
            <li key={r.screenId + r.title}>
              <strong>{r.title}</strong>
              <Paragraphs text={r.reason} />
              {loc && <a href={href.lesson(loc.level, loc.index)}>Go to Level {loc.level}, screen {loc.index + 1}</a>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export const promptOf = (id: string) => getItem(id)?.prompt ?? id;
