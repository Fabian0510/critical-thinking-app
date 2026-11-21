/** Right/wrong markers that never rely on colour alone: each has an icon and a word. */
export function RightMark({ label = 'Correct' }: { label?: string }) {
  return (
    <span className="mark mark--correct">
      <span aria-hidden="true">✓ </span>
      {label}
    </span>
  );
}

export function WrongMark({ label = 'Not right' }: { label?: string }) {
  return (
    <span className="mark mark--incorrect">
      <span aria-hidden="true">✗ </span>
      {label}
    </span>
  );
}

export function PartialMark({ label }: { label: string }) {
  return (
    <span className="mark mark--partial">
      <span aria-hidden="true">◐ </span>
      {label}
    </span>
  );
}
