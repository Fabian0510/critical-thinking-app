// @vitest-environment node
/**
 * WCAG AA contrast for every text/background pairing the app uses, in light and dark themes.
 * Text needs 4.5:1; UI component boundaries (borders, focus) need 3:1.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

function tokens(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2];
  return out;
}
const light = tokens(css.split('@media')[0]);
const dark = { ...light, ...tokens(css.split('@media')[1]) };

function lum(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const TEXT_PAIRS: [string, string][] = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['text', 'surface-2'],
  ['text', 'accent-soft'],
  ['text', 'correct-soft'],
  ['text', 'incorrect-soft'],
  ['text', 'partial-soft'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['muted', 'surface-2'],
  ['muted', 'accent-soft'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accent', 'surface-2'],
  ['accent-text', 'accent'],
  ['correct', 'surface'],
  ['correct', 'correct-soft'],
  ['incorrect', 'surface'],
  ['incorrect', 'incorrect-soft'],
  ['partial', 'surface'],
  ['partial', 'partial-soft'],
];
const UI_PAIRS: [string, string][] = [
  ['border', 'surface'],
  ['border', 'bg'],
  ['focus', 'bg'],
  ['focus', 'surface'],
];

describe.each([
  ['light', light],
  ['dark', dark],
])('%s theme contrast', (_, t) => {
  it.each(TEXT_PAIRS)('%s on %s ≥ 4.5:1', (fg, bg) => {
    expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
  it.each(UI_PAIRS)('%s on %s ≥ 3:1', (fg, bg) => {
    expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(3);
  });
});
