import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  Search,
  Shuffle,
} from 'lucide-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { FlavorWheel } from '../components/FlavorWheel';
import { AppLink, SourceLinks } from '../components/shared';
import { families, familyById, flavorGroups, flavors } from '../data/flavors';
import { origins } from '../data/origins';
import type { FamilyId } from '../data/types';
import { useCoffee } from '../lib/context';

export default function Universe() {
  const {
    ui,
    l,
    settings,
    setSetting,
    route,
    go,
    sound,
    draftFlavors,
    setDraftFlavors,
    notify,
    reducedMotion,
  } = useCoffee();
  const query = new URLSearchParams(route.split('?')[1]);
  const flavor =
    flavors.find((f) => f.id === query.get('flavor')) ??
    flavors.find((f) => f.id === 'strawberry') ??
    flavors[0];
  if (!flavor) throw new Error('No flavors');
  const family = familyById[flavor.family];
  const group = flavorGroups.find((g) => g.id === flavor.group);
  const [filter, setFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const explorer = useRef<HTMLElement>(null);
  useEffect(() => {
    if (
      groupFilter !== 'all' &&
      flavorGroups.find((entry) => entry.id === groupFilter)?.family !== flavor.family
    )
      setGroupFilter('all');
  }, [flavor.family, groupFilter]);
  const choose = (id: string) => {
    go(`/?flavor=${id}`, false);
    sound.ping();
  };
  const chooseFamily = (id: FamilyId) => {
    const first = flavors.find((f) => f.family === id);
    if (first) choose(first.id);
  };
  const chooseGroup = (id: string) => {
    const first = flavors.find((f) => f.group === id);
    if (first) {
      choose(first.id);
      setGroupFilter(id);
    }
  };
  const saved = settings.favorites.includes(flavor.id);
  const list = flavors.filter(
    (f) =>
      (filter
        ? [f.name.en, f.name.zh, f.description.en, f.description.zh]
            .join(' ')
            .toLowerCase()
            .includes(filter.toLowerCase().trim())
        : f.family === family.id) &&
      (groupFilter === 'all' || f.group === groupFilter) &&
      (!savedOnly || settings.favorites.includes(f.id)),
  );
  const relatedOrigins = origins.filter((origin) => origin.flavors.includes(flavor.id)).slice(0, 3);
  const addNote = () => {
    if (!draftFlavors.includes(flavor.id) && draftFlavors.length >= 12) {
      notify(ui.maxFlavors);
      return;
    }
    setDraftFlavors([...new Set([...draftFlavors, flavor.id])]);
    go('/journal');
  };
  return (
    <div
      className="universe-page"
      style={{ '--family': family.color, '--family-ink': family.darkColor } as CSSProperties}
    >
      <section className="universe-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-star" aria-hidden="true">
              ✳
            </span>
            {ui.eyebrow}
          </span>
          <h1>
            <span>{ui.heroLine1}</span>
            <em>{ui.heroLine2}</em>
          </h1>
          <p className="hero-description">{ui.heroDescription}</p>
          <div className="hero-cta">
            <button
              type="button"
              className="button button-dark"
              onClick={() =>
                explorer.current?.scrollIntoView({
                  behavior: reducedMotion ? 'instant' : 'smooth',
                  block: 'start',
                })
              }
            >
              {ui.startExploring}
              <ArrowDown size={16} />
            </button>
            <button
              type="button"
              className="button button-text"
              onClick={() => {
                const next = flavors[Math.floor(Math.random() * flavors.length)];
                if (next) choose(next.id);
              }}
            >
              <Shuffle size={15} />
              {ui.surprise}
            </button>
          </div>
          <div className="hero-footnote">
            <span className="mini-orbits" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{ui.wheelNote}</span>
          </div>
          <div className="selected-preview" aria-live="polite">
            <span className="micro">{ui.selectedFlavor}</span>
            <div>
              <span className="preview-family-symbol" aria-hidden="true">
                {family.icon}
              </span>
              <strong>{l(flavor.name)}</strong>
              <span className="preview-divider" />
              <span>{l(family.name)}</span>
              <ArrowUpRight size={19} />
            </div>
          </div>
        </div>
        <div className="hero-world">
          <span className="scene-caption micro">{ui.wheelCaption}</span>
          <FlavorWheel
            family={flavor.family}
            selected={flavor.id}
            onSelect={choose}
            onFamily={chooseFamily}
            onGroup={chooseGroup}
          />
        </div>
      </section>
      <div className="universe-ribbon">
        <span>01 — 08</span>
        <span>{ui.familyExploreDescription}</span>
        <span aria-hidden="true">✳</span>
      </div>
      <section
        className="flavor-explorer section"
        ref={explorer}
        id="flavor-explorer"
        aria-labelledby="explorer-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ui.universe}</span>
            <h2 id="explorer-heading">{ui.familyExplore}</h2>
          </div>
          <div className="inline-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              aria-label={ui.filterFlavors}
              placeholder={ui.filterFlavors}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setGroupFilter('all');
              }}
            />
          </div>
        </div>
        <nav className="family-tabs" aria-label={ui.family}>
          {families.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={item.id === family.id ? 'active' : ''}
              style={{ '--swatch': item.color } as CSSProperties}
              aria-pressed={item.id === family.id}
              onClick={() => {
                setFilter('');
                chooseFamily(item.id);
              }}
            >
              <span className="family-symbol" aria-hidden="true">
                {item.icon}
              </span>
              <span>{l(item.name)}</span>
              <small>{String(index + 1).padStart(2, '0')}</small>
            </button>
          ))}
        </nav>
        <div className="flavor-content-grid">
          <div className="flavor-index">
            <div className="group-filters">
              <button
                type="button"
                className={groupFilter === 'all' ? 'chip active' : 'chip'}
                onClick={() => setGroupFilter('all')}
              >
                {ui.showAllGroups}
              </button>
              {flavorGroups
                .filter((g) => g.family === family.id)
                .map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    className={groupFilter === g.id ? 'chip active' : 'chip'}
                    onClick={() => setGroupFilter(g.id)}
                  >
                    {l(g.name)}
                  </button>
                ))}
            </div>
            <div className="flavor-list-heading">
              <span>
                {list.length} {ui.results}
              </span>
              <button
                type="button"
                className={`text-toggle ${savedOnly ? 'active' : ''}`}
                aria-pressed={savedOnly}
                onClick={() => setSavedOnly(!savedOnly)}
              >
                <Bookmark size={13} />
                {ui.savedOnly}
              </button>
            </div>
            <div className="flavor-grid">
              {list.map((item) => (
                <button
                  type="button"
                  className={`flavor-tile ${flavor.id === item.id ? 'selected' : ''}`}
                  key={item.id}
                  onClick={() => choose(item.id)}
                  aria-pressed={flavor.id === item.id}
                >
                  <span
                    className="flavor-dot"
                    style={{ background: familyById[item.family].color }}
                  />
                  <span>
                    <strong>{l(item.name)}</strong>
                    <small>
                      {settings.locale === 'zh'
                        ? item.name.en
                        : l(flavorGroups.find((g) => g.id === item.group)?.name ?? family.name)}
                    </small>
                  </span>
                  {flavor.id === item.id ? <Check size={15} /> : <ArrowUpRight size={14} />}
                </button>
              ))}
            </div>
            {!list.length && (
              <div className="empty-state">
                <span aria-hidden="true">✧</span>
                <p>{ui.noResults}</p>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => {
                    setFilter('');
                    setSavedOnly(false);
                    setGroupFilter('all');
                  }}
                >
                  {ui.clearFilters}
                </button>
              </div>
            )}
            <p className="gentle-note">{l(family.description)}</p>
          </div>
          <article
            className="flavor-detail"
            data-testid="flavor-detail"
            aria-label={l(flavor.name)}
          >
            <nav className="breadcrumbs" aria-label={ui.family}>
              <button type="button" onClick={() => chooseFamily(family.id)}>
                {l(family.name)}
              </button>
              <ChevronRight size={12} />
              <button type="button" onClick={() => chooseGroup(flavor.group)}>
                {group ? l(group.name) : ''}
              </button>
              <ChevronRight size={12} />
              <span>{l(flavor.name)}</span>
            </nav>
            <div className="detail-title">
              <div>
                <span className="micro">{ui.selectedFlavor}</span>
                <h3>{l(flavor.name)}</h3>
                {settings.locale === 'zh' && (
                  <span className="detail-english">{flavor.name.en}</span>
                )}
              </div>
              <button
                type="button"
                className={`detail-bookmark ${saved ? 'saved' : ''}`}
                aria-label={saved ? ui.unsaveFlavor : ui.saveFlavor}
                aria-pressed={saved}
                onClick={() =>
                  setSetting(
                    'favorites',
                    saved
                      ? settings.favorites.filter((id) => id !== flavor.id)
                      : [...settings.favorites, flavor.id],
                  )
                }
              >
                <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className="detail-description">{l(flavor.description)}</p>
            <div className="reference-box">
              <span className="micro">{ui.aromaReference}</span>
              <p>{l(flavor.reference)}</p>
            </div>
            <div className="detail-distinction">
              <h4>{ui.distinguish}</h4>
              <p>{l(flavor.distinction)}</p>
            </div>
            <div className="related-flavors">
              <h4>{ui.relatedFlavors}</h4>
              <div>
                {flavor.related.map((id) => {
                  const item = flavors.find((f) => f.id === id);
                  return item ? (
                    <button type="button" key={id} className="chip" onClick={() => choose(id)}>
                      {l(item.name)}
                      <ArrowUpRight size={11} />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
            <button type="button" className="button button-dark full-width" onClick={addNote}>
              {ui.addToJournal}
              <ArrowRight size={16} />
            </button>
            <SourceLinks ids={flavor.sources} />
          </article>
        </div>
      </section>
      <section className="origin-teaser section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ui.origins}</span>
            <h2>{ui.exploreOrigin}</h2>
          </div>
          <AppLink to="/origins" className="text-link">
            {ui.all}
            <ArrowUpRight size={16} />
          </AppLink>
        </div>
        <div className="teaser-origins">
          {(relatedOrigins.length
            ? relatedOrigins
            : origins
                .filter((o) =>
                  o.flavors.some((id) => flavors.find((f) => f.id === id)?.family === family.id),
                )
                .slice(0, 3)
          ).map((origin, index) => (
            <AppLink key={origin.id} to={`/origins?origin=${origin.id}`} className="teaser-origin">
              <span className="micro">
                0{index + 1} / {l(origin.region)}
              </span>
              <h3>{l(origin.name)}</h3>
              <p>{l(origin.context)}</p>
              <ArrowUpRight size={24} />
            </AppLink>
          ))}
        </div>
        <p className="gentle-note">{ui.originCaveat}</p>
      </section>
    </div>
  );
}
