import { Minus, Plus, RotateCcw, RotateCw } from 'lucide-react';
import {
  Component,
  type CSSProperties,
  lazy,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { families, flavorGroups, flavors } from '../data/flavors';
import type { FamilyId } from '../data/types';
import { useCoffee, useMedia } from '../lib/context';

const Scene = lazy(() => import('./FlavorScene'));

class GraphicsBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function arc(inner: number, outer: number, start: number, end: number) {
  const xy = (r: number, a: number) => `${250 + Math.cos(a) * r},${250 - Math.sin(a) * r}`;
  return `M${xy(inner, start)}L${xy(outer, start)}A${outer},${outer} 0 0 0 ${xy(outer, end)}L${xy(inner, end)}A${inner},${inner} 0 0 1 ${xy(inner, start)}Z`;
}

function FlatWheel({
  family,
  selected,
  rotation,
  zoom,
  onSelect,
}: {
  family: FamilyId;
  selected: string;
  rotation: number;
  zoom: number;
  onSelect: (id: string) => void;
}) {
  const { l, ui } = useCoffee();
  return (
    <div className="flat-wheel" data-testid="flat-wheel">
      <svg viewBox="0 0 500 500" aria-label={ui.flatWheelLabel}>
        <title>{ui.flatWheelLabel}</title>
        <g
          transform={`translate(250 250) scale(${zoom}) rotate(${(-rotation * 180) / Math.PI}) translate(-250 -250)`}
        >
          {families.map((item, index) => {
            const start = (index * Math.PI) / 4 + Math.PI / 8;
            const groups = flavorGroups.filter((g) => g.family === item.id);
            return (
              <g key={item.id} fill={item.color} opacity={family === item.id ? 1 : 0.6}>
                <path d={arc(86, 124, start + 0.025, start + Math.PI / 4 - 0.025)} />
                {groups.map((group, gi) => {
                  const gs = start + (gi * Math.PI) / 4 / groups.length;
                  const span = Math.PI / 4 / groups.length;
                  return (
                    <g key={group.id}>
                      <path d={arc(132, 163, gs + 0.02, gs + span - 0.02)} />
                      {flavors
                        .filter((f) => f.group === group.id)
                        .map((flavor, fi) => (
                          <a
                            key={flavor.id}
                            href={`/?flavor=${flavor.id}`}
                            aria-label={l(flavor.name)}
                            onClick={(event) => {
                              event.preventDefault();
                              onSelect(flavor.id);
                            }}
                          >
                            <path
                              className={selected === flavor.id ? 'flat-selected' : ''}
                              d={arc(
                                171,
                                selected === flavor.id ? 201 : 193,
                                gs + (fi * span) / 4 + 0.008,
                                gs + ((fi + 1) * span) / 4 - 0.008,
                              )}
                            />
                            <title>{l(flavor.name)}</title>
                          </a>
                        ))}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
        <circle cx="250" cy="255" r="71" fill="var(--surface)" />
        <path
          d="M293 230C329 222 331 264 300 264"
          stroke="var(--illustration)"
          strokeWidth="12"
          fill="none"
        />
        <circle cx="249" cy="250" r="54" fill="var(--illustration)" />
        <circle cx="249" cy="250" r="43" fill="#735140" />
        <path
          d="M226 229Q240 219 260 225"
          stroke="#dcb891"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".5"
        />
      </svg>
    </div>
  );
}

export function FlavorWheel({
  family,
  selected,
  onSelect,
  onFamily,
  onGroup,
  exhibition = false,
}: {
  family: FamilyId;
  selected: string;
  onSelect: (id: string) => void;
  onFamily: (id: FamilyId) => void;
  onGroup: (id: string) => void;
  exhibition?: boolean;
}) {
  const { ui, l, settings, reducedMotion } = useCoffee();
  const mobile = useMedia('(max-width: 700px)');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [visible, setVisible] = useState(true);
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const element = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; rotation: number } | null>(null);
  const saveData =
    'connection' in navigator && (navigator.connection as { saveData?: boolean }).saveData;
  const flat =
    settings.flat ||
    lost ||
    !('WebGL2RenderingContext' in window) ||
    Boolean(saveData) ||
    navigator.hardwareConcurrency <= 2;
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setLost(true), []);
  useEffect(() => {
    if (!element.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.05 },
    );
    observer.observe(element.current);
    const onVisibility = () => {
      if (document.hidden) setVisible(false);
      else if (element.current) {
        const bounds = element.current.getBoundingClientRect();
        setVisible(bounds.bottom > 0 && bounds.top < window.innerHeight);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  const fallback = (
    <FlatWheel
      family={family}
      selected={selected}
      rotation={rotation}
      zoom={zoom}
      onSelect={onSelect}
    />
  );
  return (
    <div className={`wheel-block ${exhibition ? 'wheel-exhibition' : ''}`}>
      <div
        className="wheel-canvas-wrap"
        ref={element}
        data-graphics={flat ? '2d' : ready ? '3d' : 'loading'}
        onPointerDown={(event) => {
          if (!(event.target instanceof HTMLCanvasElement)) return;
          event.target.setPointerCapture(event.pointerId);
          drag.current = { x: event.clientX, rotation };
        }}
        onPointerMove={(event) => {
          if (drag.current)
            setRotation(drag.current.rotation + (event.clientX - drag.current.x) * 0.006);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <div className="wheel-scene">
          {flat ? (
            fallback
          ) : (
            <GraphicsBoundary fallback={fallback}>
              <Suspense fallback={fallback}>
                <Scene
                  family={family}
                  flavor={selected}
                  rotation={rotation}
                  zoom={zoom}
                  onSelect={onSelect}
                  onFamily={onFamily}
                  onGroup={onGroup}
                  reduced={reducedMotion}
                  low={mobile}
                  theme={settings.theme}
                  visible={visible}
                  onReady={onReady}
                  onLost={onLost}
                />
              </Suspense>
            </GraphicsBoundary>
          )}
        </div>
        <nav className="wheel-family-labels" aria-label={ui.family}>
          {families.map((item, index) => {
            const angle = (index * Math.PI) / 4 + Math.PI / 4 + rotation;
            return (
              <button
                type="button"
                key={item.id}
                className={`wheel-family-label ${family === item.id ? 'active' : ''}`}
                style={
                  {
                    '--family': item.color,
                    '--family-ink': item.darkColor,
                    left: `clamp(49px, ${50 + Math.cos(angle) * 42}%, calc(100% - 49px))`,
                    top: `${50 - Math.sin(angle) * 43}%`,
                  } as CSSProperties
                }
                onClick={() => onFamily(item.id)}
                aria-pressed={family === item.id}
              >
                <span className="color-dot" />
                {l(item.name)}
              </button>
            );
          })}
        </nav>
        <span className="wheel-decoration decor-one" aria-hidden="true">
          ✦
        </span>
        <span className="wheel-decoration decor-two" aria-hidden="true">
          ✧
        </span>
      </div>
      <div className="wheel-toolbar">
        <span className="micro">{flat ? ui.wheelFallback : ui.dragHint}</span>
        <div className="wheel-actions">
          <button
            type="button"
            aria-label={ui.rotateLeft}
            onClick={() => setRotation((value) => value - Math.PI / 12)}
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            aria-label={ui.rotateRight}
            onClick={() => setRotation((value) => value + Math.PI / 12)}
          >
            <RotateCw size={15} />
          </button>
          <span className="toolbar-divider" />
          <button
            type="button"
            aria-label={ui.zoomOut}
            disabled={zoom <= 0.8}
            onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))}
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="zoom-reset"
            aria-label={ui.resetView}
            onClick={() => {
              setRotation(0);
              setZoom(1);
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            aria-label={ui.zoomIn}
            disabled={zoom >= 1.4}
            onClick={() => setZoom((value) => Math.min(1.4, value + 0.1))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
