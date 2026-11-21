import { expectedCounts, type TestParams } from '../../scoring/probability';

type Group = 'tp' | 'fn' | 'fp' | 'tn';

const LEGEND: Record<Group, string> = {
  tp: 'Has it, tests positive',
  fn: 'Has it, tests negative',
  fp: 'Doesn’t have it, tests positive',
  tn: 'Doesn’t have it, tests negative',
};

/** One mark per person; shape AND fill distinguish the groups, so colour isn't needed. */
function Mark({ g, x, y, s }: { g: Group; x: number; y: number; s: number }) {
  const r = s * 0.38;
  const cx = x + s / 2;
  const cy = y + s / 2;
  switch (g) {
    case 'tp':
      return <circle cx={cx} cy={cy} r={r} fill="var(--incorrect)" />;
    case 'fn':
      return <circle cx={cx} cy={cy} r={r * 0.85} fill="none" stroke="var(--incorrect)" strokeWidth={s * 0.14} />;
    case 'fp':
      return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="var(--accent)" />;
    case 'tn':
      return <circle cx={cx} cy={cy} r={r * 0.35} fill="var(--border)" />;
  }
}

export function LegendMark({ g }: { g: Group }) {
  return (
    <svg width="16" height="16" viewBox="0 0 10 10" aria-hidden="true" style={{ verticalAlign: '-2px' }}>
      <Mark g={g} x={0} y={0} s={10} />
    </svg>
  );
}

/**
 * A grid of `population` people (default 1,000), grouped so all positives sit together.
 * Answers "of everyone who tests positive, how many actually have it?" visually.
 */
export function PopulationGrid({ population = 1000, ...p }: TestParams & { population?: number }) {
  const c = expectedCounts(population, p);
  const cols = 40;
  const size = 10;
  const order: Group[] = [
    ...Array<Group>(c.truePositive).fill('tp'),
    ...Array<Group>(c.falsePositive).fill('fp'),
    ...Array<Group>(c.falseNegative).fill('fn'),
    ...Array<Group>(c.trueNegative).fill('tn'),
  ];
  const rows = Math.ceil(order.length / cols);
  const positives = c.truePositive + c.falsePositive;
  const summary = `Of ${population.toLocaleString()} people, ${c.truePositive + c.falseNegative} have the condition. ${positives} test positive: ${c.truePositive} who have it and ${c.falsePositive} who don’t. So of those who test positive, ${c.truePositive} in ${positives} (${Math.round((c.truePositive / positives) * 100)}%) actually have it.`;
  return (
    <figure style={{ margin: 0 }}>
      <svg className="chart" viewBox={`0 0 ${cols * size} ${rows * size}`} role="img" aria-label={summary}>
        {order.map((g, i) => (
          <Mark key={i} g={g} x={(i % cols) * size} y={Math.floor(i / cols) * size} s={size} />
        ))}
      </svg>
      <figcaption>
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'grid', gap: 4, fontSize: '0.9rem' }}>
          {(['tp', 'fp', 'fn', 'tn'] as Group[]).map((g) => (
            <li key={g}>
              <LegendMark g={g} /> {LEGEND[g]}:{' '}
              <strong>{{ tp: c.truePositive, fp: c.falsePositive, fn: c.falseNegative, tn: c.trueNegative }[g]}</strong>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: '0.95rem' }}>{summary}</p>
        <p className="muted" style={{ fontSize: '0.8rem' }}>Counts are rounded to whole people.</p>
      </figcaption>
    </figure>
  );
}
