import { useState } from 'react';
import { useProgress } from '../state/ProgressContext';
import { deriveResults } from '../state/derived';

export function SettingsPage() {
  const { progress, dispatch, persistent } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState('');

  function exportJson() {
    const d = deriveResults(progress.attempts);
    const data = {
      exportedAt: new Date().toISOString(),
      app: 'Think Again',
      summary: { skillProfile: d.profile, brierScore: d.brier, calibration: d.buckets, calibrationVerdict: d.verdict.verdict },
      progress,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `think-again-results-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus('Exported.');
  }

  return (
    <div className="stack">
      <h1 tabIndex={-1}>Settings</h1>
      <section className="card">
        <h2>Saving</h2>
        <p>
          {persistent
            ? 'Your progress is saved in this browser only. Nothing is sent anywhere.'
            : 'This browser isn’t letting the app save, so your progress will be lost when you close or reload the page. Export your results to keep them.'}
        </p>
      </section>
      <section className="card">
        <h2>Export results</h2>
        <p>Download everything — answers, confidence ratings, skill profile and calibration — as a JSON file.</p>
        <button type="button" className="btn" onClick={exportJson}>
          Export as JSON
        </button>
      </section>
      <section className="card">
        <h2>Reset progress</h2>
        <p>Deletes all answers, test results and unlocked levels in this browser. This can’t be undone.</p>
        {!confirming ? (
          <button type="button" className="btn btn--secondary" onClick={() => setConfirming(true)}>
            Reset progress…
          </button>
        ) : (
          <div className="row">
            <button
              type="button"
              className="btn"
              onClick={() => {
                dispatch({ type: 'reset' });
                setConfirming(false);
                setStatus('Progress reset.');
              }}
            >
              Yes, delete everything
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}
      </section>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
