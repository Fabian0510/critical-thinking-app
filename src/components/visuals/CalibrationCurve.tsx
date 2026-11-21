import type { CalibrationBucket } from '../../scoring/calibration';
import { describeBucket } from '../../scoring/calibration';

/**
 * Stated confidence (x) vs. actual accuracy (y). The dashed diagonal is perfect
 * calibration: points below it are overconfidence, above it underconfidence.
 * Every point is labelled with its numbers; a text list follows for screen readers.
 */
export function CalibrationCurve({ buckets }: { buckets: CalibrationBucket[] }) {
  const W = 360;
  const H = 300;
  const m = { l: 48, r: 40, t: 22, b: 44 };
  const x = (c: number) => m.l + ((c - 0.5) / 0.5) * (W - m.l - m.r);
  const y = (a: number) => H - m.b - a * (H - m.t - m.b);
  const pts = buckets.filter((b) => b.accuracy !== null);
  const lines = pts.map((b) => describeBucket(b)).filter(Boolean) as string[];
  return (
    <figure style={{ margin: 0 }}>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Calibration curve. ${lines.join(' ') || 'No data yet.'}`}>
        {[0, 0.25, 0.5, 0.75, 1].map((a) => (
          <g key={a}>
            <line className="grid-line" x1={m.l} x2={W - m.r} y1={y(a)} y2={y(a)} />
            <text x={m.l - 6} y={y(a) + 4} fontSize="11" textAnchor="end">
              {a * 100}%
            </text>
          </g>
        ))}
        {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((c) => (
          <text key={c} x={x(c)} y={H - m.b + 16} fontSize="11" textAnchor="middle">
            {Math.round(c * 100)}%
          </text>
        ))}
        <line className="axis" x1={m.l} x2={W - m.r} y1={y(0)} y2={y(0)} />
        <line className="axis" x1={m.l} x2={m.l} y1={y(0)} y2={y(1)} />
        <text x={(m.l + W - m.r) / 2} y={H - 6} fontSize="12" textAnchor="middle">
          How sure you said you were
        </text>
        <text transform={`translate(12 ${(m.t + H - m.b) / 2}) rotate(-90)`} fontSize="12" textAnchor="middle">
          How often you were right
        </text>
        {/* perfect calibration */}
        <line x1={x(0.5)} y1={y(0.5)} x2={x(1)} y2={y(1)} stroke="var(--muted)" strokeDasharray="5 4" strokeWidth="1.5" />
        <text x={x(0.97)} y={y(0.97) + 16} fontSize="10" textAnchor="end" fill="var(--muted)">
          perfect calibration
        </text>
        {pts.length > 1 && (
          <polyline
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            points={pts.map((b) => `${x(b.confidence)},${y(b.accuracy as number)}`).join(' ')}
          />
        )}
        {pts.map((b, i) => (
          <g key={b.confidence}>
            <circle cx={x(b.confidence)} cy={y(b.accuracy as number)} r={4 + Math.min(6, Math.sqrt(b.n) * 1.5)} fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
            <text
              x={x(b.confidence)}
              // Alternate labels above/below so neighbouring points at similar heights don't collide.
              y={y(b.accuracy as number) + (i % 2 === 0 ? -12 : 22)}
              fontSize="10.5"
              textAnchor="middle"
              fontWeight="600"
            >
              {Math.round((b.accuracy as number) * 100)}% (n={b.n})
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        {lines.length === 0 ? (
          <p className="muted">No answers with a confidence rating yet.</p>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}
