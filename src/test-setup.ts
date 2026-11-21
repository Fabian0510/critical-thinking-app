import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  if (typeof window === 'undefined') return;
  cleanup();
  try {
    window.localStorage.clear();
  } catch {
    /* storage may be unavailable */
  }
});

// jsdom doesn't implement scrolling. (Some tests run in the plain node environment, without window.)
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
}
