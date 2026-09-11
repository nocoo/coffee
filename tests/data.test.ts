import { describe, expect, it } from 'vitest';
import { processes, roasts, varieties } from '../src/data/agriculture';
import { families, flavorGroups, flavors } from '../src/data/flavors';
import { knowledge, learningPaths, quiz } from '../src/data/knowledge';
import { methods } from '../src/data/methods';
import { origins } from '../src/data/origins';
import { sources } from '../src/data/sources';
import { messages } from '../src/data/ui';

const collections = {
  families,
  flavorGroups,
  flavors,
  knowledge,
  learningPaths,
  methods,
  origins,
  processes,
  roasts,
  varieties,
  quiz,
};
const exists = (items: { id: string }[], id: string) =>
  expect(
    items.some((item) => item.id === id),
    `Unresolved relationship: ${id}`,
  ).toBe(true);

function checkLocalized(value: unknown, path = 'root') {
  if (!value || typeof value !== 'object') return;
  if ('zh' in value || 'en' in value) {
    expect(Object.keys(value).sort(), path).toEqual(['en', 'zh']);
    for (const [locale, text] of Object.entries(value)) {
      expect(typeof text, `${path}.${locale}`).toBe('string');
      expect(String(text).trim().length, `${path}.${locale}`).toBeGreaterThan(0);
      expect(String(text), `${path}.${locale}`).not.toMatch(/TODO|lorem ipsum|待翻译/i);
    }
  } else for (const [key, child] of Object.entries(value)) checkLocalized(child, `${path}.${key}`);
}

describe('the complete bilingual knowledge graph', () => {
  it('contains the promised breadth and no duplicate IDs within namespaces', () => {
    expect(families).toHaveLength(8);
    expect(flavorGroups).toHaveLength(24);
    expect(flavors).toHaveLength(96);
    expect(origins.length).toBeGreaterThanOrEqual(20);
    expect(methods).toHaveLength(10);
    expect(knowledge.length).toBeGreaterThanOrEqual(30);
    expect(varieties.length).toBeGreaterThanOrEqual(14);
    for (const [name, values] of Object.entries(collections)) {
      expect(new Set(values.map((v) => v.id)).size, name).toBe(values.length);
      for (const value of values) expect(value.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });
  it('validates every locale key in content, navigation, labels and source notes', () => {
    checkLocalized(collections);
    checkLocalized(messages);
    checkLocalized(sources);
  });
  it('resolves all flavor parents, siblings and source references', () => {
    for (const group of flavorGroups) {
      exists(families, group.family);
      expect(flavors.filter((flavor) => flavor.group === group.id)).toHaveLength(4);
    }
    for (const flavor of flavors) {
      exists(families, flavor.family);
      const group = flavorGroups.find((item) => item.id === flavor.group);
      expect(group?.family).toBe(flavor.family);
      expect(flavor.related).toHaveLength(3);
      for (const id of flavor.related) {
        exists(flavors, id);
        expect(id).not.toBe(flavor.id);
      }
      checkLocalized([flavor.name, flavor.description, flavor.reference, flavor.distinction]);
    }
    for (const items of Object.values(collections))
      for (const item of items) {
        if ('sources' in item) {
          expect(item.sources.length).toBeGreaterThan(0);
          for (const id of item.sources) expect(sources).toHaveProperty(id);
        }
      }
    for (const source of Object.values(sources))
      expect(new URL(source.url).protocol).toBe('https:');
  });
  it('resolves origin links and bounds geographic and editorial matching values', () => {
    for (const origin of origins) {
      for (const id of origin.flavors) exists(flavors, id);
      for (const id of origin.varieties) exists(varieties, id);
      for (const id of origin.processes) exists(processes, id);
      expect(origin.coordinates[0]).toBeGreaterThanOrEqual(-180);
      expect(origin.coordinates[0]).toBeLessThanOrEqual(180);
      expect(origin.coordinates[1]).toBeGreaterThanOrEqual(-90);
      expect(origin.coordinates[1]).toBeLessThanOrEqual(90);
      expect(origin.elevation[0]).toBeLessThan(origin.elevation[1]);
      for (const value of [origin.body, origin.acidity])
        expect(value >= 1 && value <= 5).toBe(true);
    }
  });
  it('keeps recipe ranges and learning paths internally consistent', () => {
    for (const method of methods) {
      expect(method.ratio).toBeGreaterThanOrEqual(method.ratioRange[0]);
      expect(method.ratio).toBeLessThanOrEqual(method.ratioRange[1]);
      expect(method.temperature[0]).toBeLessThanOrEqual(method.temperature[1]);
      expect(method.seconds[0]).toBeLessThanOrEqual(method.seconds[1]);
      expect(method.steps.length).toBeGreaterThanOrEqual(4);
      if (method.id === 'espresso') expect(method.ratioBasis).toBe('yield');
      else expect(method.ratioBasis).toBe('water');
    }
    for (const path of learningPaths) {
      expect(path.lessons).toHaveLength(path.exercises.length);
      for (const id of path.lessons) exists(knowledge, id);
    }
    for (const question of quiz)
      expect(question.answer >= 0 && question.answer < question.options.length).toBe(true);
  });
});
