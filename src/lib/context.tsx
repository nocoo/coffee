import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { flavors } from '../data/flavors';
import { knowledge } from '../data/knowledge';
import type { Locale, Localized, Theme } from '../data/types';
import { type Messages, messages } from '../data/ui';
import type { TastingNote } from './journal';
import { useAmbientSound } from './sound';

interface Settings {
  locale: Locale;
  theme: Theme;
  contrast: boolean;
  motion: boolean;
  flat: boolean;
  favorites: string[];
  completed: string[];
}
const SETTINGS_KEY = 'coffee.preferences.v1';
function initialSettings(): Settings {
  const defaults: Settings = {
    locale: 'zh',
    theme: 'daylight',
    contrast: window.matchMedia('(prefers-contrast: more)').matches,
    motion: false,
    flat: false,
    favorites: [],
    completed: [],
  };
  try {
    const value = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
    if (value && typeof value === 'object') {
      if (value.locale === 'en' || value.locale === 'zh') defaults.locale = value.locale;
      if (['daylight', 'espresso', 'terroir'].includes(value.theme)) defaults.theme = value.theme;
      for (const key of ['contrast', 'motion', 'flat'] as const)
        if (typeof value[key] === 'boolean') defaults[key] = value[key];
      if (Array.isArray(value.favorites))
        defaults.favorites = [
          ...new Set(value.favorites.filter((id: unknown) => flavors.some((f) => f.id === id))),
        ] as string[];
      if (Array.isArray(value.completed))
        defaults.completed = [
          ...new Set(value.completed.filter((id: unknown) => knowledge.some((k) => k.id === id))),
        ] as string[];
    }
  } catch {
    /* Invalid preferences fall back to defaults; journal storage is separate. */
  }
  const queryLocale = new URLSearchParams(window.location.search).get('lang');
  if (queryLocale === 'zh' || queryLocale === 'en') defaults.locale = queryLocale;
  return defaults;
}

export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

interface CoffeeContext {
  settings: Settings;
  setSetting: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void;
  ui: Messages;
  l: (value: Localized) => string;
  route: string;
  go: (path: string, scroll?: boolean) => void;
  reducedMotion: boolean;
  systemReducedMotion: boolean;
  temporary: boolean;
  toast: string;
  notify: (message: string) => void;
  sound: ReturnType<typeof useAmbientSound>;
  draftFlavors: string[];
  setDraftFlavors: (value: string[]) => void;
  draftRecipe: {
    method: string;
    dose: number;
    water: number;
    origin?: string;
    roast?: string;
    process?: string;
  } | null;
  setDraftRecipe: (value: CoffeeContext['draftRecipe']) => void;
  journalDraft: Omit<TastingNote, 'id' | 'createdAt' | 'flavors'> | null;
  setJournalDraft: (value: Omit<TastingNote, 'id' | 'createdAt' | 'flavors'> | null) => void;
  journalEditing: Pick<TastingNote, 'id' | 'createdAt'> | null;
  setJournalEditing: (value: CoffeeContext['journalEditing']) => void;
}
const Context = createContext<CoffeeContext | null>(null);

export function CoffeeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(initialSettings);
  const [route, setRoute] = useState(() => window.location.pathname + window.location.search);
  const [temporary, setTemporary] = useState(false);
  const [toast, notify] = useState('');
  const [draftFlavors, setDraftFlavors] = useState<string[]>([]);
  const [draftRecipe, setDraftRecipe] = useState<CoffeeContext['draftRecipe']>(null);
  const [journalDraft, setJournalDraft] = useState<CoffeeContext['journalDraft']>(null);
  const [journalEditing, setJournalEditing] = useState<CoffeeContext['journalEditing']>(null);
  const systemReducedMotion = useMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = settings.motion || systemReducedMotion;
  const sound = useAmbientSound();
  const setSetting = useCallback(<Key extends keyof Settings>(key: Key, value: Settings[Key]) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    if (key === 'locale') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', String(value));
      const next = url.pathname + url.search;
      window.history.replaceState({}, '', next);
      setRoute(next);
    }
  }, []);
  const ui = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(messages).map(([key, value]) => [key, value[settings.locale]]),
      ) as Messages,
    [settings.locale],
  );
  const l = useCallback((value: Localized) => value[settings.locale], [settings.locale]);
  const go = useCallback((path: string, scroll = true) => {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return;
    const next = url.pathname + url.search;
    if (next !== window.location.pathname + window.location.search)
      window.history.pushState({}, '', next);
    setRoute(next);
    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true }),
      );
    }
  }, []);
  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname + window.location.search);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setTemporary(false);
    } catch {
      setTemporary(true);
    }
    document.documentElement.lang = settings.locale === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.contrast = String(settings.contrast);
    document.documentElement.dataset.motion = reducedMotion ? 'reduce' : 'full';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        settings.theme === 'espresso'
          ? '#252328'
          : settings.theme === 'terroir'
            ? '#edf0e5'
            : '#f8f6f0',
      );
  }, [settings, reducedMotion]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => notify(''), 5500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': ui.universe,
      '/origins': ui.origins,
      '/brew': ui.lab,
      '/learn': ui.learn,
      '/journal': ui.journal,
      '/display': ui.display,
    };
    const path = route.split('?')[0] ?? '/';
    document.title = `${titles[path] ?? '404'} · coffee`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', `${ui.tagline} ${ui.heroDescription}`);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', `https://coffee.hexly.ai${titles[path] ? path : '/'}`);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute('content', titles[path] ? 'index,follow' : 'noindex,follow');
  }, [route, ui]);
  return (
    <Context.Provider
      value={{
        settings,
        setSetting,
        ui,
        l,
        route,
        go,
        reducedMotion,
        systemReducedMotion,
        temporary,
        toast,
        notify,
        sound,
        draftFlavors,
        setDraftFlavors,
        draftRecipe,
        setDraftRecipe,
        journalDraft,
        setJournalDraft,
        journalEditing,
        setJournalEditing,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCoffee() {
  const context = useContext(Context);
  if (!context) throw new Error('CoffeeProvider is required');
  return context;
}
