import { describe, expect, it } from 'vitest';
import { calculateRecipe, formatDuration, recommend } from '../src/lib/core';
import { searchContent, searchIndex } from '../src/lib/search';

describe('recipe arithmetic', () => {
  it('scales an actual V60 recipe by servings without rounding intermediate values', () => {
    expect(calculateRecipe({ amount: 15, basis: 'coffee', ratio: 16, servings: 2 })).toEqual({
      coffee: 15,
      water: 240,
      totalCoffee: 30,
      totalWater: 480,
      servings: 2,
      ratio: 16,
    });
    const recipe = calculateRecipe({ amount: 250, basis: 'water', ratio: 16, servings: 3 });
    expect(recipe.coffee).toBe(15.625);
    expect(recipe.totalWater).toBe(750);
    expect(recipe.totalCoffee).toBe(46.875);
  });
  it('also calculates espresso beverage yield without relabeling it as water', () => {
    expect(calculateRecipe({ amount: 18, basis: 'coffee', ratio: 2, servings: 1 }).water).toBe(36);
  });
  it('keeps scaled batches within the journal’s supported 10 kg limit', () => {
    expect(() =>
      calculateRecipe({ amount: 600, basis: 'coffee', ratio: 16, servings: 2 }),
    ).toThrow();
    expect(
      calculateRecipe({ amount: 500, basis: 'water', ratio: 16, servings: 20 }).totalWater,
    ).toBe(10000);
  });
  it.each([NaN, Infinity, -10, 0, 10001])('rejects invalid input amount %s', (amount) => {
    expect(() => calculateRecipe({ amount, basis: 'coffee', ratio: 16, servings: 1 })).toThrow();
  });
  it('rejects unsafe ratios and non-integer or excessive servings', () => {
    for (const ratio of [0, 31, NaN])
      expect(() => calculateRecipe({ amount: 15, basis: 'coffee', ratio, servings: 1 })).toThrow();
    for (const servings of [0, 1.5, 21])
      expect(() => calculateRecipe({ amount: 15, basis: 'coffee', ratio: 16, servings })).toThrow();
  });
  it('formats long cold brews and short espresso in the selected language', () => {
    expect(formatDuration(43200, 'en')).toBe('12 h');
    expect(formatDuration(180, 'zh')).toBe('3 分钟');
    expect(formatDuration(30, 'en')).toBe('30 s');
  });
});

describe('transparent recommendations', () => {
  const preference = {
    family: 'floral' as const,
    acidity: 5,
    body: 2,
    process: 'washed',
    roast: 'light',
  };
  it('ranks matching floral profiles ahead of heavy low-acidity profiles', () => {
    const results = recommend(preference);
    expect(results).toHaveLength(3);
    expect(['ethiopia', 'panama']).toContain(results[0]?.origin.id);
    for (const result of results) {
      expect(result.origin.processes).toContain('washed');
      expect(result.process.id).toBe('washed');
      expect(result.roast.id).toBe('light');
      expect(result.method.id).toBe('v60');
      expect(result.reasons.length).toBeGreaterThan(0);
    }
    expect(recommend(preference)).toEqual(results);
  });
  it('honors hard process filters and returns no fabricated matches', () => {
    expect(recommend({ ...preference, process: 'wet-hulled', body: 5 })[0]?.origin.id).toBe(
      'indonesia',
    );
    expect(recommend({ ...preference, process: 'not-a-process' })).toEqual([]);
    expect(recommend({ ...preference, roast: 'invalid' })).toEqual([]);
    expect(recommend({ ...preference, body: 99 })).toEqual([]);
  });
});

describe('bilingual global search and combined filters', () => {
  it('finds either language and preserves the selected entry path', () => {
    expect(searchContent('茉莉')[0]?.id).toBe('jasmine');
    expect(searchContent('JASMINE')[0]?.id).toBe('jasmine');
    expect(searchContent('水质').some((e) => e.path === '/learn?article=water')).toBe(true);
    expect(searchContent('  AeroPress  ')[0]?.kind).toBe('method');
  });
  it('combines type, family, continent and process without silently dropping filters', () => {
    const results = searchContent('', {
      kind: 'origin',
      family: 'floral',
      continent: 'africa',
      process: 'washed',
    });
    expect(results.some((r) => r.id === 'ethiopia')).toBe(true);
    expect(
      results.every(
        (r) => r.kind === 'origin' && r.continent === 'africa' && r.processes?.includes('washed'),
      ),
    ).toBe(true);
    expect(searchContent('kenya', { continent: 'americas' })).toEqual([]);
    expect(searchContent('unfindable unicorn xyz')).toEqual([]);
    expect(new Set(searchIndex.map((e) => `${e.kind}:${e.id}`)).size).toBe(searchIndex.length);
  });
});
