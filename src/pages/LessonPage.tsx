import { getLevel } from '../content';
import { href, navigate } from '../router';
import { useProgress } from '../state/ProgressContext';
import type { LevelId, Visual } from '../types/content';
import { Paragraphs } from '../components/Rich';
import { ItemCard } from '../components/items/ItemCard';
import { LevelGate } from './LevelPage';
import { PopulationGrid } from '../components/visuals/PopulationGrid';
import { ValidityGrid2x2 } from '../components/visuals/ValidityGrid2x2';
import { ArcBanner } from '../components/visuals/ArcBanner';
import { ProbabilityWalkthrough } from '../components/visuals/ProbabilityWalkthrough';
import { CalibrationDemo } from '../components/visuals/CalibrationDemo';

function VisualBlock({ v }: { v: Visual }) {
  switch (v.kind) {
    case 'population-grid':
      return <PopulationGrid {...v} />;
    case 'validity-grid':
      return <ValidityGrid2x2 />;
    case 'arc':
      return <ArcBanner level={v.highlight} />;
    case 'probability-slider':
      return <ProbabilityWalkthrough hypothesis={v.hypothesis} prior={v.prior} steps={v.steps} />;
    case 'calibration-demo':
      return <CalibrationDemo />;
  }
}

export function LessonPage({ level, screen }: { level: LevelId; screen: number }) {
  const { progress, dispatch } = useProgress();
  const content = getLevel(level);
  return (
    <LevelGate level={level}>
      {content &&
        (() => {
          const i = Math.min(Math.max(0, screen), content.screens.length - 1);
          const s = content.screens[i];
          const last = i === content.screens.length - 1;
          const runId = `check-l${level}`;
          const prior = progress.attempts.find((a) => a.runId === runId && a.itemId === s.check.id);
          return (
            <div className="stack" key={s.id}>
              <div>
                <div className="progress-text">
                  Level {level} lesson · screen {i + 1} of {content.screens.length}
                </div>
                <progress max={content.screens.length} value={i + 1} aria-label="Lesson progress" />
              </div>
              <h1 tabIndex={-1}>{s.title}</h1>
              <Paragraphs text={s.body} />
              <section className="example" aria-label="Worked example">
                <h2>{s.example.title}</h2>
                <Paragraphs text={s.example.body} />
              </section>
              {s.visual && <VisualBlock v={s.visual} />}
              <section aria-label="Quick check">
                <div className="eyebrow">Quick check</div>
                <ItemCard
                  item={s.check}
                  initial={prior ? { response: prior.response, confidence: prior.confidence } : undefined}
                  onSubmit={(response, r, confidence) =>
                    dispatch({
                      type: 'record-attempt',
                      attempt: { itemId: s.check.id, runId, context: 'check', ts: Date.now(), response, ...r, confidence },
                    })
                  }
                  onUpdate={(response) => prior && dispatch({ type: 'record-attempt', attempt: { ...prior, response } })}
                  nextLabel={last ? 'Finish the lesson' : 'Next screen'}
                  onNext={() => {
                    if (last) {
                      dispatch({ type: 'lesson-done', level });
                      navigate(href.practice(level));
                    } else navigate(href.lesson(level, i + 1));
                  }}
                />
              </section>
              <nav className="row" aria-label="Lesson navigation">
                {i > 0 && (
                  <a className="btn btn--secondary" href={href.lesson(level, i - 1)}>
                    ← Previous screen
                  </a>
                )}
                <a href={href.level(level)}>Back to Level {level}</a>
              </nav>
            </div>
          );
        })()}
    </LevelGate>
  );
}
