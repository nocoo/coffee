import { ArrowRight, ArrowUpRight, MapPin, Mountain, Search } from 'lucide-react';
import { useState } from 'react';
import { AppLink, PageHeading, SourceLinks } from '../components/shared';
import { processes, varieties } from '../data/agriculture';
import { families, familyById, flavors } from '../data/flavors';
import { origins } from '../data/origins';
import worldPaths from '../data/world-map.json';
import { useCoffee } from '../lib/context';

export default function Origins() {
  const { ui, l, route, go, sound, setDraftRecipe } = useCoffee();
  const params = new URLSearchParams(route.split('?')[1]);
  const selected = origins.find((origin) => origin.id === params.get('origin')) ?? origins[0];
  const [continent, setContinent] = useState('all');
  const [process, setProcess] = useState('all');
  const [family, setFamily] = useState('all');
  const [query, setQuery] = useState('');
  if (!selected) throw new Error('No origin data');
  const filtered = origins.filter(
    (origin) =>
      (continent === 'all' || origin.continent === continent) &&
      (process === 'all' || origin.processes.includes(process)) &&
      (family === 'all' ||
        origin.flavors.some((id) => flavors.find((f) => f.id === id)?.family === family)) &&
      [origin.name.zh, origin.name.en, origin.region.zh, origin.region.en]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const choose = (id: string) => {
    go(`/origins?origin=${id}`, false);
    sound.ping();
  };
  const project = ([lng, lat]: [number, number]) => [
    ((lng + 180) / 360) * 1000,
    ((85 - lat) / 145) * 420,
  ];
  return (
    <div className="atlas-page">
      <PageHeading
        eyebrow={ui.atlasEyebrow}
        title={ui.atlasTitle}
        description={ui.atlasDescription}
      />
      <div className="atlas-filters">
        <div className="continent-tabs">
          {(['all', 'africa', 'americas', 'asia'] as const).map((item) => (
            <button
              type="button"
              className={continent === item ? 'chip active' : 'chip'}
              key={item}
              onClick={() => setContinent(item)}
              aria-pressed={continent === item}
            >
              {ui[item]}
            </button>
          ))}
        </div>
        <div className="atlas-selects">
          <select
            aria-label={ui.allFamilies}
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="all">{ui.allFamilies}</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {l(f.name)}
              </option>
            ))}
          </select>
          <select
            aria-label={ui.allProcesses}
            value={process}
            onChange={(e) => setProcess(e.target.value)}
          >
            <option value="all">{ui.allProcesses}</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {l(p.name)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="atlas-layout">
        <div className="map-panel">
          <div className="map-caption">
            <span className="micro">
              {l({ zh: '23 个产国 · 同一条咖啡带', en: '23 ORIGINS · ONE COFFEE BELT' })}
            </span>
            <span className="micro">23°26′ N — 23°26′ S</span>
          </div>
          <svg className="world-map" viewBox="0 0 1000 440" aria-label={ui.mapLabel}>
            <title>{ui.mapLabel}</title>
            <defs>
              <pattern
                id="map-dots"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".18" />
              </pattern>
            </defs>
            <rect width="1000" height="420" fill="url(#map-dots)" />
            <rect
              x="0"
              y={((85 - 23.44) / 145) * 420}
              width="1000"
              height={(46.88 / 145) * 420}
              fill="var(--accent)"
              opacity=".16"
            />
            {worldPaths.map((d) => (
              <path
                key={d.slice(0, 100)}
                d={d}
                fill="var(--map-land)"
                stroke="var(--bg)"
                strokeWidth=".7"
              />
            ))}
            <path
              d={`M0 ${((85 - 23.44) / 145) * 420}H1000M0 ${((85 + 23.44) / 145) * 420}H1000`}
              stroke="currentColor"
              opacity=".18"
              strokeDasharray="5 6"
              strokeWidth="1"
            />
            <path
              d={`M0 ${(85 / 145) * 420}H1000`}
              stroke="currentColor"
              opacity=".15"
              strokeWidth="1"
            />
            <text x="18" y={(85 / 145) * 420 - 9} className="map-small-label">
              {l({ zh: '赤道', en: 'EQUATOR' })} 0°
            </text>
            {filtered.map((origin) => {
              const [x, y] = project(origin.coordinates);
              const active = selected.id === origin.id;
              return (
                <a
                  key={origin.id}
                  href={`/origins?origin=${origin.id}`}
                  className={`map-marker ${active ? 'active' : ''}`}
                  aria-label={l(origin.name)}
                  aria-current={active ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    choose(origin.id);
                  }}
                >
                  <g transform={`translate(${x} ${y})`}>
                    <circle r={active ? 16 : 12} fill="transparent" />
                    {active && (
                      <circle
                        r="14"
                        fill="var(--pink)"
                        stroke="var(--ink)"
                        strokeWidth=".6"
                        opacity=".7"
                      />
                    )}
                    <circle
                      r={active ? 6 : 3.6}
                      fill={active ? 'var(--ink)' : '#b77c6d'}
                      stroke="var(--surface)"
                      strokeWidth="1.4"
                    />
                    {active && (
                      <g transform="translate(0 -30)">
                        <rect
                          x={-l(origin.name).length * 4 - 10}
                          y="-12"
                          width={l(origin.name).length * 8 + 20}
                          height="26"
                          rx="13"
                          fill="var(--ink)"
                        />
                        <text textAnchor="middle" y="5" fill="var(--bg)" fontSize="12">
                          {l(origin.name)}
                        </text>
                      </g>
                    )}
                  </g>
                </a>
              );
            })}
          </svg>
          <div className="map-footer">
            <span>
              <span className="map-key-dot" />
              {l({
                zh: '点击一个地名，听听土地的故事。',
                en: 'Choose a place. Listen to its story.',
              })}
            </span>
            <span>
              {l({ zh: 'Natural Earth · 公共领域', en: 'Natural Earth · public domain' })}
            </span>
          </div>
          <div className="map-origin-caption">
            <span className="coordinate-label">
              {Math.abs(selected.coordinates[1]).toFixed(2)}°{' '}
              {selected.coordinates[1] >= 0 ? 'N' : 'S'} ·{' '}
              {Math.abs(selected.coordinates[0]).toFixed(2)}°{' '}
              {selected.coordinates[0] >= 0 ? 'E' : 'W'}
            </span>
            <h2>
              {l(selected.name)}
              <span aria-hidden="true">↗</span>
            </h2>
            <p>{l(selected.description)}</p>
          </div>
        </div>
        <article className="origin-detail" data-testid="origin-detail">
          <div className="origin-detail-top">
            <span className="eyebrow">
              <MapPin size={13} />
              {ui[selected.continent]}
            </span>
            <h2>{l(selected.name)}</h2>
            <p>{l(selected.region)}</p>
          </div>
          <div className="altitude-line">
            <Mountain size={20} />
            <div>
              <span>{ui.elevation}</span>
              <strong>
                {selected.elevation[0].toLocaleString()}–{selected.elevation[1].toLocaleString()}{' '}
                <small>{ui.meters}</small>
              </strong>
            </div>
          </div>
          <p className="origin-context">{l(selected.context)}</p>
          <h3>{ui.potentialNotes}</h3>
          <div className="origin-flavors">
            {selected.flavors.map((id) => {
              const flavor = flavors.find((f) => f.id === id);
              return flavor ? (
                <AppLink key={id} className="chip" to={`/?flavor=${id}`}>
                  <span
                    className="flavor-dot"
                    style={{ background: familyById[flavor.family].color }}
                  />
                  {l(flavor.name)}
                  <ArrowUpRight size={11} />
                </AppLink>
              ) : null;
            })}
          </div>
          <h3>{ui.varieties}</h3>
          <div className="origin-links">
            {selected.varieties.map((id) => (
              <AppLink key={id} to={`/learn?topic=varieties&item=${id}`}>
                {l(varieties.find((v) => v.id === id)?.name ?? { zh: id, en: id })}
                <ArrowUpRight size={10} />
              </AppLink>
            ))}
          </div>
          <h3>{ui.processes}</h3>
          <div className="origin-links">
            {selected.processes.map((id) => (
              <AppLink key={id} to={`/learn?topic=processes&item=${id}`}>
                {l(processes.find((p) => p.id === id)?.name ?? { zh: id, en: id })}
                <ArrowUpRight size={10} />
              </AppLink>
            ))}
          </div>
          <button
            type="button"
            className="button button-dark full-width"
            onClick={() => {
              setDraftRecipe({ method: 'v60', dose: 15, water: 240, origin: selected.id });
              go(`/brew?method=v60&origin=${selected.id}`);
            }}
          >
            {ui.brewThis}
            <ArrowRight size={16} />
          </button>
          <SourceLinks ids={selected.sources} />
        </article>
      </div>
      <p className="gentle-note">{ui.originCaveat}</p>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ui.origins}</span>
            <h2>{l({ zh: '继续走，世界还很大。', en: 'There is a whole world to taste.' })}</h2>
          </div>
          <div className="inline-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={ui.origin}
              placeholder={ui.origin}
            />
          </div>
        </div>
        <div className="atlas-result-bar">
          <span>
            {filtered.length} {ui.results}
          </span>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery('');
              setContinent('all');
              setFamily('all');
              setProcess('all');
            }}
          >
            {ui.clearFilters}
          </button>
        </div>
        <div className="country-grid">
          {filtered.map((origin, index) => (
            <button
              type="button"
              key={origin.id}
              className={`country-card ${selected.id === origin.id ? 'selected' : ''}`}
              onClick={() => {
                choose(origin.id);
                document.querySelector('.atlas-layout')?.scrollIntoView({ block: 'start' });
              }}
            >
              <div className={`country-landscape landscape-${index % 4}`}>
                <svg viewBox="0 0 300 110" aria-hidden="true">
                  <circle cx={210 + (index % 3) * 10} cy="28" r="17" fill="var(--land-sun)" />
                  <path d="M-10 103L53 41L108 77L157 23L246 104Z" fill="var(--land-back)" />
                  <path
                    d="M-20 120L51 79L82 95L142 64L188 92L257 43L320 115Z"
                    fill="var(--land-front)"
                  />
                  <path
                    d="M0 108Q87 89 164 107T310 104"
                    fill="none"
                    stroke="var(--surface)"
                    strokeWidth="1"
                    opacity=".55"
                  />
                </svg>
                <span className="micro">{ui[origin.continent]}</span>
              </div>
              <div className="country-card-body">
                <h3>
                  {l(origin.name)}
                  <ArrowUpRight size={17} />
                </h3>
                <p>{l(origin.region)}</p>
                <span>
                  {origin.elevation[0]}–{origin.elevation[1]} {ui.meters}
                </span>
              </div>
            </button>
          ))}
        </div>
        {!filtered.length && <p className="empty-state">{ui.noResults}</p>}
      </section>
    </div>
  );
}
