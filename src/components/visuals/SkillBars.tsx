import { SKILL_LABELS } from '../../types/content';
import type { SkillScore } from '../../scoring/skills';

/** Horizontal bars with the value written out, so nothing depends on colour or bar length alone. */
export function SkillBars({ profile, hideEmpty }: { profile: SkillScore[]; hideEmpty?: boolean }) {
  const rows = hideEmpty ? profile.filter((s) => s.mean !== null) : profile;
  if (rows.length === 0) return <p className="muted">No scored answers yet.</p>;
  return (
    <ul className="skill-bars">
      {rows.map((s) => {
        const pct = s.mean === null ? null : Math.round(s.mean * 100);
        const id = `skill-${s.skill}`;
        return (
          <li key={s.skill}>
            <div className="skill-bar__label">
              <span id={id}>{SKILL_LABELS[s.skill]}</span>
              <span>
                {pct === null ? <span className="muted">No data yet</span> : <strong>{pct}%</strong>}
                {s.n > 0 && <span className="muted"> · {s.n} {s.n === 1 ? 'answer' : 'answers'}</span>}
              </span>
            </div>
            <div
              className="skill-bar__track"
              role="meter"
              aria-labelledby={id}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct ?? 0}
              aria-valuetext={pct === null ? 'No data yet' : `${pct}%`}
            >
              <div className="skill-bar__fill" style={{ width: `${pct ?? 0}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
