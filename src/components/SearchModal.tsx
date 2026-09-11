import { ArrowUpRight, Search } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { processes } from '../data/agriculture';
import { families } from '../data/flavors';
import type { FamilyId } from '../data/types';
import { useCoffee } from '../lib/context';
import { type SearchFilters, type SearchKind, searchContent } from '../lib/search';
import { AppLink, Modal } from './shared';

export function SearchModal({ onClose }: { onClose: () => void }) {
  const { ui, l } = useCoffee();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const [filters, setFilters] = useState<SearchFilters>({});
  const results = searchContent(deferred, filters);
  const kinds: SearchKind[] = [
    'flavor',
    'origin',
    'method',
    'knowledge',
    'variety',
    'process',
    'roast',
  ];
  return (
    <Modal title={ui.search} onClose={onClose} className="search-modal">
      <p className="modal-intro">{ui.searchHint}</p>
      <div className="global-search-input">
        <Search size={23} aria-hidden="true" />
        <input
          type="search"
          aria-label={ui.searchShort}
          placeholder={ui.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="search-filters">
        <label>
          <span>{ui.allTypes}</span>
          <select
            aria-label={ui.allTypes}
            value={filters.kind ?? 'all'}
            onChange={(e) => setFilters({ ...filters, kind: e.target.value as SearchKind | 'all' })}
          >
            <option value="all">{ui.allTypes}</option>
            {kinds.map((kind) => (
              <option key={kind} value={kind}>
                {ui[kind]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{ui.family}</span>
          <select
            aria-label={ui.allFamilies}
            value={filters.family ?? 'all'}
            onChange={(e) => setFilters({ ...filters, family: e.target.value as FamilyId | 'all' })}
          >
            <option value="all">{ui.allFamilies}</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {l(f.name)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{ui.origin}</span>
          <select
            aria-label={ui.allRegions}
            value={filters.continent ?? 'all'}
            onChange={(e) => setFilters({ ...filters, continent: e.target.value })}
          >
            <option value="all">{ui.allRegions}</option>
            {(['africa', 'americas', 'asia'] as const).map((c) => (
              <option key={c} value={c}>
                {ui[c]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{ui.process}</span>
          <select
            aria-label={ui.allProcesses}
            value={filters.process ?? 'all'}
            onChange={(e) => setFilters({ ...filters, process: e.target.value })}
          >
            <option value="all">{ui.allProcesses}</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {l(p.name)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="search-result-count" role="status">
        <span>
          {results.length} {ui.results}
        </span>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setQuery('');
            setFilters({});
          }}
        >
          {ui.clearFilters}
        </button>
      </div>
      <div className="search-results">
        {results.slice(0, 80).map((entry) => (
          <AppLink
            className="search-result"
            key={`${entry.kind}:${entry.id}`}
            to={entry.path}
            onNavigate={onClose}
          >
            <span className="search-kind">{ui[entry.kind]}</span>
            <div>
              <strong>{l(entry.title)}</strong>
              <p>{l(entry.summary)}</p>
            </div>
            <ArrowUpRight size={17} />
          </AppLink>
        ))}
        {!results.length && <p className="empty-state">{ui.noResults}</p>}
        {results.length > 80 && (
          <p className="gentle-note">
            {l({
              zh: '先显示 80 项；继续输入关键词或组合筛选，可缩小范围。',
              en: 'Showing the first 80. Add a keyword or combine filters to narrow the list.',
            })}
          </p>
        )}
      </div>
    </Modal>
  );
}
