import { Fragment, type ReactNode } from 'react';

/** Renders `**bold**` and `*emphasis*` in content strings. Nothing else is interpreted. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    out.push(m[1] !== undefined ? <strong key={k++}>{m[1]}</strong> : <em key={k++}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/** Paragraphs separated by blank lines. */
export function Paragraphs({ text }: { text: string | string[] }) {
  const paras = Array.isArray(text) ? text : text.split(/\n\s*\n/);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </>
  );
}
