import { ARC_PHASES, LEVEL_META } from '../../content/meta';
import type { LevelId } from '../../types/content';

/** The four-phase arc of the course, with the current level's phase marked (by text and weight, not just colour). */
export function ArcBanner({ level }: { level?: LevelId }) {
  const current = level ? LEVEL_META[level].phase : -1;
  return (
    <nav aria-label="The course arc">
      <ol className="arc">
        {ARC_PHASES.map((p, i) => (
          <li key={p.name} data-current={i === current}>
            {p.name}
            <span style={{ display: 'block', fontWeight: 400, fontSize: '0.78rem' }}>
              {p.levels}
              {i === current && <span> · you are here</span>}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
