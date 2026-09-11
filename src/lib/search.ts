import { processes, roasts, varieties } from '../data/agriculture';
import { flavors } from '../data/flavors';
import { knowledge } from '../data/knowledge';
import { methods } from '../data/methods';
import { origins } from '../data/origins';
import type { FamilyId, Localized } from '../data/types';

export type SearchKind =
  | 'flavor'
  | 'origin'
  | 'method'
  | 'knowledge'
  | 'variety'
  | 'process'
  | 'roast';
export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: Localized;
  summary: Localized;
  path: string;
  families: FamilyId[];
  continent?: string;
  processes?: string[];
  haystack: string;
}

const normalize = (text: string) =>
  text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim();
const searchable = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(searchable).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(searchable).join(' ');
  return '';
};
const entry = (data: Omit<SearchEntry, 'haystack'>, body: unknown): SearchEntry => ({
  ...data,
  haystack: normalize(searchable([data.title, data.summary, body])),
});

export const searchIndex: SearchEntry[] = [
  ...flavors.map((f) =>
    entry(
      {
        id: f.id,
        kind: 'flavor',
        title: f.name,
        summary: f.description,
        path: `/?flavor=${f.id}`,
        families: [f.family],
      },
      [f.reference, f.distinction],
    ),
  ),
  ...origins.map((o) =>
    entry(
      {
        id: o.id,
        kind: 'origin',
        title: o.name,
        summary: o.region,
        path: `/origins?origin=${o.id}`,
        families: [
          ...new Set(
            o.flavors.flatMap((id) => flavors.filter((f) => f.id === id).map((f) => f.family)),
          ),
        ],
        continent: o.continent,
        processes: o.processes,
      },
      [o.description, o.context, o.varieties.map((id) => varieties.find((v) => v.id === id)?.name)],
    ),
  ),
  ...methods.map((m) =>
    entry(
      {
        id: m.id,
        kind: 'method',
        title: m.name,
        summary: m.description,
        path: `/brew?method=${m.id}`,
        families: [],
      },
      [m.grind, m.steps, m.tip],
    ),
  ),
  ...knowledge.map((k) =>
    entry(
      {
        id: k.id,
        kind: 'knowledge',
        title: k.name,
        summary: k.summary,
        path: `/learn?article=${k.id}`,
        families: [],
      },
      [k.body, k.practice],
    ),
  ),
  ...varieties.map((v) =>
    entry(
      {
        id: v.id,
        kind: 'variety',
        title: v.name,
        summary: v.description,
        path: `/learn?topic=varieties&item=${v.id}`,
        families: [],
      },
      [],
    ),
  ),
  ...processes.map((p) =>
    entry(
      {
        id: p.id,
        kind: 'process',
        title: p.name,
        summary: p.description,
        path: `/learn?topic=processes&item=${p.id}`,
        families: [],
      },
      p.effect,
    ),
  ),
  ...roasts.map((r) =>
    entry(
      {
        id: r.id,
        kind: 'roast',
        title: r.name,
        summary: r.description,
        path: `/learn?topic=roasts&item=${r.id}`,
        families: [],
      },
      r.tip,
    ),
  ),
];

export interface SearchFilters {
  kind?: SearchKind | 'all';
  family?: FamilyId | 'all';
  continent?: string;
  process?: string;
}

export function searchContent(query: string, filters: SearchFilters = {}): SearchEntry[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return searchIndex
    .filter(
      (item) =>
        (!filters.kind || filters.kind === 'all' || item.kind === filters.kind) &&
        (!filters.family || filters.family === 'all' || item.families.includes(filters.family)) &&
        (!filters.continent ||
          filters.continent === 'all' ||
          item.continent === filters.continent) &&
        (!filters.process ||
          filters.process === 'all' ||
          item.processes?.includes(filters.process)) &&
        terms.every((term) => item.haystack.includes(term)),
    )
    .sort((a, b) => {
      const score = (e: SearchEntry) =>
        terms.reduce(
          (sum, term) => sum + (normalize(searchable(e.title)).includes(term) ? 2 : 0),
          0,
        );
      return score(b) - score(a) || a.id.localeCompare(b.id);
    });
}
