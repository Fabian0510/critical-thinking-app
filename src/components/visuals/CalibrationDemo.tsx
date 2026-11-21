import { useProgress } from '../../state/ProgressContext';
import { calibrationBuckets, calibrationPoints, calibrationVerdict, type CalibrationPoint } from '../../scoring/calibration';
import { CalibrationCurve } from './CalibrationCurve';

/** How many of the learner's own answers we need before showing their curve instead of the illustration. */
const MIN_OWN = 8;

/**
 * An invented forecaster who is overconfident at the top end, for learners who
 * haven't answered enough questions yet. Clearly labelled as an illustration.
 */
function illustration(): CalibrationPoint[] {
  const make = (confidence: number, right: number, n: number) =>
    Array.from({ length: n }, (_, i) => ({ confidence, correct: i < right }));
  return [...make(0.6, 6, 10), ...make(0.7, 7, 10), ...make(0.8, 6, 10), ...make(0.9, 6, 10), ...make(0.99, 7, 10)];
}

export function CalibrationDemo() {
  const { progress } = useProgress();
  const own = calibrationPoints(progress.attempts);
  const useOwn = own.length >= MIN_OWN;
  const points = useOwn ? own : illustration();
  return (
    <figure className="card stack" style={{ margin: 0 }}>
      <div className="eyebrow">{useOwn ? `Your calibration so far (${own.length} answers)` : 'Illustration: an invented quiz player'}</div>
      {useOwn ? (
        <p style={{ margin: 0 }}>{calibrationVerdict(own).summary}</p>
      ) : (
        <p style={{ margin: 0 }}>
          You have {own.length} confidence-rated {own.length === 1 ? 'answer' : 'answers'} so far — not enough for a curve of your own yet
          (it appears once you have {MIN_OWN}). Here is an invented quiz player, 10 answers per confidence level. Up to 70% they’re
          about right; at 80% and above, they’re right far less often than they claim.
        </p>
      )}
      <CalibrationCurve buckets={calibrationBuckets(points)} />
    </figure>
  );
}
