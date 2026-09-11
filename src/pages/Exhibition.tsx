import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Moon,
  Pause,
  Play,
  Sprout,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { type CSSProperties, useEffect, useState } from 'react';
import { FlavorWheel } from '../components/FlavorWheel';
import { AppLink, BrewGlyph, Logo } from '../components/shared';
import { families, familyById, flavors } from '../data/flavors';
import { methods } from '../data/methods';
import { origins } from '../data/origins';
import { b } from '../data/types';
import { useCoffee } from '../lib/context';
import { formatDuration } from '../lib/core';

const stops = [
  { kind: 'flavor', id: 'jasmine' },
  { kind: 'origin', id: 'ethiopia' },
  { kind: 'method', id: 'v60' },
  { kind: 'flavor', id: 'caramel' },
  { kind: 'origin', id: 'colombia' },
  { kind: 'method', id: 'espresso' },
  { kind: 'flavor', id: 'hazelnut' },
  { kind: 'origin', id: 'brazil' },
  { kind: 'method', id: 'french-press' },
  { kind: 'flavor', id: 'bergamot' },
  { kind: 'origin', id: 'panama' },
  { kind: 'method', id: 'chemex' },
  { kind: 'flavor', id: 'black-tea' },
  { kind: 'origin', id: 'china' },
  { kind: 'method', id: 'aeropress' },
  { kind: 'flavor', id: 'cinnamon' },
  { kind: 'origin', id: 'yemen' },
  { kind: 'method', id: 'turkish' },
];

export default function Exhibition() {
  const { ui, l, settings, setSetting, sound, notify, go } = useCoffee();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [manualFlavor, setManualFlavor] = useState<string | null>(null);
  const [visible, setVisible] = useState(!document.hidden);
  const stop = stops[index % stops.length] ?? stops[0];
  const origin = origins.find((o) => stop?.kind === 'origin' && o.id === stop.id);
  const method = methods.find((m) => stop?.kind === 'method' && m.id === stop.id);
  const flavor =
    flavors.find(
      (f) =>
        f.id ===
        (manualFlavor ?? origin?.flavors[0] ?? (stop?.kind === 'flavor' ? stop.id : 'caramel')),
    ) ?? flavors[0];
  useEffect(() => {
    if (!playing || !visible) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % stops.length);
      setManualFlavor(null);
    }, 12000);
    return () => clearInterval(timer);
  }, [playing, visible]);
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.fullscreenElement) go('/');
    };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onEscape);
    };
  }, [go]);
  if (!flavor || !stop) throw new Error('No exhibition content');
  const family = familyById[flavor.family];
  const select = (id: string) => {
    setManualFlavor(id);
    setPlaying(false);
    sound.ping();
  };
  const title = manualFlavor ? flavor.name : (origin?.name ?? method?.name ?? flavor.name);
  const description = manualFlavor
    ? flavor.description
    : (origin?.context ?? method?.description ?? flavor.description);
  const kind = manualFlavor ? 'flavor' : stop.kind;
  const advance = (amount: number) => {
    setIndex((current) => (current + amount + stops.length) % stops.length);
    setManualFlavor(null);
  };
  return (
    <div
      className="exhibition"
      style={{ '--family': family.color, '--family-ink': family.darkColor } as CSSProperties}
    >
      <header className="exhibition-header">
        <AppLink to="/" aria-label={ui.displayExit}>
          <Logo />
        </AppLink>
        <span className="micro">{ui.tour}</span>
        <div>
          <button
            type="button"
            className="locale-button"
            aria-label={settings.locale === 'zh' ? 'Switch to English' : '切换为中文'}
            onClick={() => setSetting('locale', settings.locale === 'zh' ? 'en' : 'zh')}
          >
            {settings.locale === 'zh' ? 'EN' : '中文'}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={ui.appearance}
            onClick={() =>
              setSetting(
                'theme',
                settings.theme === 'daylight'
                  ? 'espresso'
                  : settings.theme === 'espresso'
                    ? 'terroir'
                    : 'daylight',
              )
            }
          >
            {settings.theme === 'daylight' ? (
              <Sun size={18} />
            ) : settings.theme === 'espresso' ? (
              <Moon size={18} />
            ) : (
              <Sprout size={18} />
            )}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={ui.fullscreen}
            onClick={() => {
              if (document.fullscreenElement)
                void document.exitFullscreen().catch(() => notify(ui.fullscreenUnavailable));
              else if (document.documentElement.requestFullscreen)
                void document.documentElement
                  .requestFullscreen()
                  .catch(() => notify(ui.fullscreenUnavailable));
              else notify(ui.fullscreenUnavailable);
            }}
          >
            <Maximize2 size={17} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={ui.displayExit}
            onClick={() => {
              if (document.fullscreenElement) void document.exitFullscreen();
              go('/');
            }}
          >
            <X size={20} />
          </button>
        </div>
      </header>
      <div className="exhibition-stage">
        <div className="exhibition-copy" key={`${index}-${manualFlavor}`}>
          <span className="eyebrow">
            <span aria-hidden="true">✳</span>
            {kind === 'flavor' ? ui.universe : kind === 'origin' ? ui.origins : ui.lab}
          </span>
          <h1 data-testid="exhibition-title">{l(title)}</h1>
          <p>{l(description)}</p>
          <div className="exhibition-note">
            {kind === 'flavor' ? (
              <>
                <span className="micro">{ui.aromaReference}</span>
                <p>{l(flavor.reference)}</p>
              </>
            ) : origin && !manualFlavor ? (
              <>
                <span className="micro">{l(origin.region)}</span>
                <p>
                  {ui.elevation} · {origin.elevation[0]}–{origin.elevation[1]} {ui.meters}
                </p>
              </>
            ) : method ? (
              <>
                <span className="micro">{ui.startingPoint}</span>
                <p>
                  1:{method.ratio} · {method.temperature[0]}–{method.temperature[1]}°C ·{' '}
                  {formatDuration(method.seconds[0], settings.locale)}
                </p>
              </>
            ) : null}
          </div>
          <span className="exhibition-caveat">
            {kind === 'origin'
              ? ui.originCaveat
              : kind === 'method'
                ? l(
                    b(
                      '所有参数都是练习起点。遵守器具容量，按味道微调。',
                      'All parameters are practice starting points. Respect brewer capacity and adjust by taste.',
                    ),
                  )
                : l(b('描述性风味，不是品质评分。', 'Descriptive flavor, not a quality score.'))}
          </span>
        </div>
        <div className="exhibition-visual">
          {method && !manualFlavor ? (
            <div className="exhibition-brewer">
              <div className="exhibition-brewer-circle" />
              <BrewGlyph method={method.id} />
              <span className="micro">{method.name.en}</span>
            </div>
          ) : (
            <FlavorWheel
              family={flavor.family}
              selected={flavor.id}
              onSelect={select}
              onFamily={(id) => {
                const next = flavors.find((f) => f.family === id);
                if (next) select(next.id);
              }}
              onGroup={(id) => {
                const next = flavors.find((f) => f.group === id);
                if (next) select(next.id);
              }}
              exhibition
            />
          )}
        </div>
      </div>
      <footer className="exhibition-controls">
        <div className="tour-transport">
          <button
            type="button"
            className="icon-button"
            aria-label={ui.previous}
            onClick={() => advance(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            className="tour-play"
            aria-label={playing ? ui.pause : ui.play}
            aria-pressed={playing}
            onClick={() => {
              setPlaying(!playing);
              setManualFlavor(null);
            }}
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={ui.next}
            onClick={() => advance(1)}
          >
            <ArrowRight size={18} />
          </button>
          <span>
            {String(index + 1).padStart(2, '0')} <small>/ {stops.length}</small>
          </span>
        </div>
        <div className="tour-progress">
          <div>
            {stops.map((entry, i) => (
              <button
                type="button"
                key={`${entry.kind}-${entry.id}`}
                aria-label={`${ui.tour} ${i + 1}`}
                aria-current={i === index ? 'step' : undefined}
                className={i === index ? 'active' : ''}
                onClick={() => {
                  setIndex(i);
                  setManualFlavor(null);
                }}
              />
            ))}
          </div>
          <span>{playing ? ui.tourNote : ui.pause}</span>
        </div>
        <div className="exhibition-audio">
          <button
            type="button"
            className={sound.enabled ? 'sound-toggle active' : 'sound-toggle'}
            aria-pressed={sound.enabled}
            onClick={() => {
              void sound.toggle().catch(() => notify(ui.soundError));
            }}
          >
            {sound.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {sound.enabled ? ui.soundOff : ui.soundOn}
          </button>
          {sound.enabled ? (
            <label className="volume-control">
              {ui.volume}
              <input
                type="range"
                min="0"
                max="100"
                value={sound.volume}
                onChange={(event) => sound.setVolume(Number(event.target.value))}
              />
            </label>
          ) : (
            <span>{ui.soundCaption}</span>
          )}
        </div>
      </footer>
      <div className="exhibition-signature">
        <span>{ui.displaySubtitle}</span>
        <span>
          {families.length} {ui.family} · COFFEE.HEXLY.AI
        </span>
      </div>
    </div>
  );
}
