import { useEffect } from 'react';
import { href, useRoute, type Route } from './router';
import { useProgress } from './state/ProgressContext';
import type { LevelId } from './types/content';
import { Home } from './pages/Home';
import { LevelPage } from './pages/LevelPage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { TestPage } from './pages/TestPage';
import { RunResults } from './pages/RunResults';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PlacementPage } from './pages/PlacementPage';
import { FinalPage } from './pages/FinalPage';

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <Home />;
    case 'level':
      return <LevelPage level={route.level as LevelId} />;
    case 'lesson':
      return <LessonPage level={route.level as LevelId} screen={route.screen} />;
    case 'practice':
      return <PracticePage level={route.level as LevelId} />;
    case 'test':
      return <TestPage level={route.level as LevelId} />;
    case 'run':
      return <RunResults runId={route.runId} />;
    case 'profile':
      return <ProfilePage />;
    case 'settings':
      return <SettingsPage />;
    case 'placement':
      return <PlacementPage />;
    case 'final':
      return <FinalPage />;
    case 'not-found':
      return (
        <div>
          <h1 tabIndex={-1}>Page not found</h1>
          <a href={href.home()}>Back to home</a>
        </div>
      );
  }
}

const NAV = [
  { to: href.home(), label: 'Home', match: (r: Route) => r.name === 'home' },
  { to: href.profile(), label: 'Results', match: (r: Route) => r.name === 'profile' || r.name === 'run' },
  { to: href.settings(), label: 'Settings', match: (r: Route) => r.name === 'settings' },
];

export function App() {
  const route = useRoute();
  const { persistent } = useProgress();
  const key = JSON.stringify(route);

  // On navigation, move focus to the page heading so screen readers announce the new page.
  useEffect(() => {
    window.scrollTo?.(0, 0);
    document.querySelector<HTMLElement>('main h1')?.focus();
    const h1 = document.querySelector('main h1')?.textContent;
    document.title = h1 && route.name !== 'home' ? `${h1} · Think Again` : 'Think Again';
  }, [key, route.name]);

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href={href.home()}>
            Think Again
          </a>
          <nav className="site-nav" aria-label="Main">
            {NAV.map((n) => (
              <a key={n.to} href={n.to} aria-current={n.match(route) ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {!persistent && (
          <p className="notice" role="note">
            Your browser isn’t allowing this app to save. Everything works, but progress will be lost when you leave. You can
            export results from Settings.
          </p>
        )}
        <Page key={key} route={route} />
      </main>
    </>
  );
}
