import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Contrast,
  Globe2,
  Monitor,
  Moon,
  Search,
  Sprout,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { SearchModal } from './components/SearchModal';
import { SourcesModal } from './components/SourcesModal';
import { AppLink, Logo } from './components/shared';
import { useCoffee } from './lib/context';
import Universe from './pages/Universe';
import './styles.css';

const Origins = lazy(() => import('./pages/Origins'));
const Lab = lazy(() => import('./pages/Lab'));
const Learn = lazy(() => import('./pages/Learn'));
const Journal = lazy(() => import('./pages/Journal'));
const Exhibition = lazy(() => import('./pages/Exhibition'));

export default function App() {
  const {
    ui,
    l,
    settings,
    setSetting,
    route,
    go,
    systemReducedMotion,
    temporary,
    toast,
    sound,
    notify,
  } = useCoffee();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const path = route.split('?')[0];
  const exhibition = path === '/display';
  const navigation = [
    { to: '/', label: ui.universe },
    { to: '/origins', label: ui.origins },
    { to: '/brew', label: ui.lab },
    { to: '/learn', label: ui.learn },
    { to: '/journal', label: ui.journal },
  ];
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  return (
    <>
      <a href="#main" className="skip-link">
        {ui.skip}
      </a>
      {!exhibition && (
        <header className="site-header">
          <div className="header-inner">
            <AppLink to="/" className="brand-link" aria-label={`coffee · ${ui.universe}`}>
              <Logo />
            </AppLink>
            <nav className="main-nav" aria-label={l({ zh: '主导航', en: 'Main navigation' })}>
              {navigation.map((item) => (
                <AppLink
                  key={item.to}
                  to={item.to}
                  className={path === item.to ? 'active' : ''}
                  aria-current={path === item.to ? 'page' : undefined}
                >
                  {item.label}
                </AppLink>
              ))}
            </nav>
            <div className="header-actions">
              <button
                type="button"
                className="icon-button search-trigger"
                aria-label={ui.search}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={19} />
                <kbd>⌘ K</kbd>
              </button>
              <span className="header-separator" />
              <button
                type="button"
                className="locale-button"
                onClick={() => setSetting('locale', settings.locale === 'zh' ? 'en' : 'zh')}
                aria-label={settings.locale === 'zh' ? 'Switch to English' : '切换为中文'}
              >
                <Globe2 size={15} />
                <span>{settings.locale === 'zh' ? 'EN' : '中文'}</span>
              </button>
              <details className="settings-menu">
                <summary aria-label={ui.settings}>
                  {settings.theme === 'espresso' ? (
                    <Moon size={18} />
                  ) : settings.theme === 'terroir' ? (
                    <Sprout size={18} />
                  ) : (
                    <Sun size={18} />
                  )}
                  <ChevronDown size={11} />
                </summary>
                <div className="settings-popover">
                  <span className="eyebrow">{ui.appearance}</span>
                  <div className="theme-options">
                    {(['daylight', 'espresso', 'terroir'] as const).map((theme) => (
                      <button
                        type="button"
                        key={theme}
                        className={settings.theme === theme ? 'active' : ''}
                        aria-pressed={settings.theme === theme}
                        onClick={() => setSetting('theme', theme)}
                      >
                        <span className={`theme-swatch swatch-${theme}`} />
                        {ui[theme]}
                        {theme === 'daylight' ? (
                          <Sun size={15} />
                        ) : theme === 'espresso' ? (
                          <Moon size={15} />
                        ) : (
                          <Sprout size={15} />
                        )}
                      </button>
                    ))}
                  </div>
                  <label className="setting-check">
                    <Contrast size={15} />
                    <span>{ui.highContrast}</span>
                    <input
                      type="checkbox"
                      checked={settings.contrast}
                      onChange={(e) => setSetting('contrast', e.target.checked)}
                    />
                  </label>
                  <label className="setting-check">
                    <span>{ui.reducedMotion}</span>
                    <input
                      type="checkbox"
                      checked={settings.motion || systemReducedMotion}
                      disabled={systemReducedMotion}
                      onChange={(e) => setSetting('motion', e.target.checked)}
                    />
                  </label>
                  {systemReducedMotion && <p className="settings-hint">{ui.systemMotion}</p>}
                  <label className="setting-check">
                    <span>{ui.simpleGraphics}</span>
                    <input
                      type="checkbox"
                      checked={settings.flat}
                      onChange={(e) => setSetting('flat', e.target.checked)}
                    />
                  </label>
                </div>
              </details>
              <AppLink to="/display" className="display-button" aria-label={ui.display}>
                <Monitor size={15} />
                <span>{ui.display}</span>
                <ArrowUpRight size={13} />
              </AppLink>
            </div>
          </div>
        </header>
      )}
      <main id="main" tabIndex={-1} className={exhibition ? 'exhibition-main' : 'site-main'}>
        <Suspense
          fallback={
            <div className="loading-page" aria-busy="true">
              <Logo />
              <p>{ui.wheelNote}</p>
            </div>
          }
        >
          {path === '/' ? (
            <Universe />
          ) : path === '/origins' ? (
            <Origins />
          ) : path === '/brew' ? (
            <Lab />
          ) : path === '/learn' ? (
            <Learn />
          ) : path === '/journal' ? (
            <Journal />
          ) : path === '/display' ? (
            <Exhibition />
          ) : (
            <section className="not-found">
              <span className="display-serif">
                404<span>✧</span>
              </span>
              <h1>{ui.notFoundTitle}</h1>
              <p>{ui.notFoundDescription}</p>
              <button type="button" className="button button-dark" onClick={() => go('/')}>
                {ui.backHome}
                <ArrowUpRight size={16} />
              </button>
            </section>
          )}
        </Suspense>
      </main>
      {!exhibition && (
        <footer className="site-footer">
          <div className="footer-top">
            <div>
              <Logo small />
              <h2>{ui.footerLine}</h2>
              <p>{ui.footerSub}</p>
            </div>
            <div className="footer-links">
              <button type="button" onClick={() => setSourcesOpen(true)}>
                <CircleHelp size={15} />
                {ui.sources}
                <ArrowUpRight size={13} />
              </button>
              <a href="https://github.com/nocoo/coffee" target="_blank" rel="noreferrer">
                <BookOpen size={15} />
                {ui.openSource}
                <ArrowUpRight size={13} />
              </a>
              <AppLink to="/display">
                <Monitor size={15} />
                {ui.display}
                <ArrowUpRight size={13} />
              </AppLink>
            </div>
            <div className="footer-sound">
              <button
                type="button"
                className={sound.enabled ? 'sound-toggle active' : 'sound-toggle'}
                aria-pressed={sound.enabled}
                onClick={() => {
                  void sound.toggle().catch(() => notify(ui.soundError));
                }}
              >
                {sound.enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
                {sound.enabled ? ui.soundOff : ui.soundOn}
              </button>
              <span>{ui.soundCaption}</span>
              {sound.enabled && (
                <label className="volume-control">
                  {ui.volume}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sound.volume}
                    onChange={(e) => sound.setVolume(Number(e.target.value))}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 coffee · {ui.independent}</span>
            <span>
              {l({ zh: '好奇心，让每一杯不同', en: 'MADE WITH CURIOSITY' })}{' '}
              <span aria-hidden="true">✳</span>
            </span>
          </div>
        </footer>
      )}
      {temporary && (
        <div className="temporary-settings" role="status">
          {ui.temporarySettings}
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {sourcesOpen && <SourcesModal onClose={() => setSourcesOpen(false)} />}
    </>
  );
}
