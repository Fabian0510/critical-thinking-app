import type { GridCell } from '../../types/content';

const CELLS: { cell: GridCell; valid: boolean; premisesTrue: boolean; name: string }[] = [
  { cell: 'valid-true', valid: true, premisesTrue: true, name: 'Valid, true premises = SOUND' },
  { cell: 'valid-false', valid: true, premisesTrue: false, name: 'Valid, but a premise is false' },
  { cell: 'invalid-true', valid: false, premisesTrue: true, name: 'Invalid, though the premises are true' },
  { cell: 'invalid-false', valid: false, premisesTrue: false, name: 'Invalid, and a premise is false' },
];

export const cellOf = (valid: boolean, premisesTrue: boolean): GridCell =>
  `${valid ? 'valid' : 'invalid'}-${premisesTrue ? 'true' : 'false'}` as GridCell;

/**
 * The validity × truth grid. Only the top-left cell is sound.
 * Markers use text ("Your answer", "Correct") as well as colour.
 */
export function ValidityGrid2x2({
  selected,
  correct,
  onSelect,
  disabled,
  name = 'grid',
}: {
  selected?: GridCell;
  correct?: GridCell;
  onSelect?: (valid: boolean, premisesTrue: boolean) => void;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <div role={onSelect ? 'radiogroup' : undefined} aria-label={onSelect ? 'Choose a cell of the grid' : 'Validity and soundness grid'}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 6, alignItems: 'stretch' }}>
        <span />
        <span className="eyebrow" style={{ textAlign: 'center' }}>Premises all true</span>
        <span className="eyebrow" style={{ textAlign: 'center' }}>A premise is false</span>
        {[true, false].map((valid) => (
          <div key={String(valid)} style={{ display: 'contents' }}>
            <span className="eyebrow" style={{ alignSelf: 'center', writingMode: 'horizontal-tb', maxWidth: 80 }}>
              {valid ? 'Valid (follows)' : 'Invalid (doesn’t follow)'}
            </span>
            {[true, false].map((pt) => {
              const c = CELLS.find((x) => x.valid === valid && x.premisesTrue === pt)!;
              const isSel = selected === c.cell;
              const isCorrect = correct === c.cell;
              const style = {
                border: `${isSel || isCorrect ? 3 : 1}px solid ${isCorrect ? 'var(--correct)' : isSel ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8,
                padding: '10px 8px',
                minHeight: 72,
                background: c.cell === 'valid-true' ? 'var(--accent-soft)' : 'var(--surface)',
                textAlign: 'center' as const,
                font: 'inherit',
                color: 'var(--text)',
                cursor: onSelect && !disabled ? 'pointer' : 'default',
              };
              const content = (
                <>
                  <span style={{ display: 'block', fontWeight: c.cell === 'valid-true' ? 700 : 400, fontSize: '0.9rem' }}>{c.name}</span>
                  {isSel && <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700 }}>● Your answer</span>}
                  {isCorrect && <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--correct)' }}>✓ Correct</span>}
                </>
              );
              return onSelect ? (
                <button
                  key={c.cell}
                  type="button"
                  role="radio"
                  aria-checked={isSel}
                  name={name}
                  disabled={disabled}
                  style={style}
                  onClick={() => onSelect(valid, pt)}
                >
                  {content}
                </button>
              ) : (
                <div key={c.cell} style={style}>
                  {content}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
