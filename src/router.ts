/**
 * Minimal hash router. Hash URLs (#/level/1) work on any static host with no
 * server rewrite rules.
 */
import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'level'; level: number }
  | { name: 'lesson'; level: number; screen: number }
  | { name: 'practice'; level: number }
  | { name: 'test'; level: number }
  | { name: 'run'; runId: string }
  | { name: 'placement' }
  | { name: 'final' }
  | { name: 'profile' }
  | { name: 'settings' }
  | { name: 'not-found' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [a, b, c, d] = parts;
  const n = (s: string | undefined) => (s && /^\d+$/.test(s) ? Number(s) : NaN);
  if (parts.length === 0) return { name: 'home' };
  if (a === 'level' && n(b) >= 1 && n(b) <= 5) {
    const level = n(b);
    if (!c) return { name: 'level', level };
    if (c === 'lesson') return { name: 'lesson', level, screen: Number.isNaN(n(d)) ? 0 : n(d) };
    if (c === 'practice') return { name: 'practice', level };
    if (c === 'test') return { name: 'test', level };
  }
  if (a === 'run' && b) return { name: 'run', runId: decodeURIComponent(b) };
  if (a === 'placement' && !b) return { name: 'placement' };
  if (a === 'final' && !b) return { name: 'final' };
  if (a === 'profile' && !b) return { name: 'profile' };
  if (a === 'settings' && !b) return { name: 'settings' };
  return { name: 'not-found' };
}

export const href = {
  home: () => '#/',
  level: (l: number) => `#/level/${l}`,
  lesson: (l: number, screen = 0) => `#/level/${l}/lesson/${screen}`,
  practice: (l: number) => `#/level/${l}/practice`,
  test: (l: number) => `#/level/${l}/test`,
  run: (id: string) => `#/run/${encodeURIComponent(id)}`,
  placement: () => '#/placement',
  final: () => '#/final',
  profile: () => '#/profile',
  settings: () => '#/settings',
};

export function navigate(to: string) {
  window.location.hash = to.replace(/^#/, '');
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
