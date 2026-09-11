import { processes, roasts } from '../data/agriculture';
import { flavors } from '../data/flavors';
import { methods } from '../data/methods';
import { origins } from '../data/origins';
import { b, type FamilyId, type Localized, type Method, type Origin } from '../data/types';

export interface RecipeInput {
  amount: number;
  basis: 'coffee' | 'water';
  ratio: number;
  servings: number;
}

export function calculateRecipe({ amount, basis, ratio, servings }: RecipeInput) {
  if (![amount, ratio, servings].every(Number.isFinite)) throw new Error('finite');
  if (amount <= 0 || amount > 10000 || ratio < 1 || ratio > 30) throw new Error('range');
  if (!Number.isInteger(servings) || servings < 1 || servings > 20) throw new Error('servings');
  const coffee = basis === 'coffee' ? amount : amount / ratio;
  const water = coffee * ratio;
  if (coffee < 0.1 || coffee > 1000 || water > 10000) throw new Error('range');
  if (coffee * servings > 10000 || water * servings > 10000) throw new Error('total-range');
  return {
    coffee,
    water,
    totalCoffee: coffee * servings,
    totalWater: water * servings,
    servings,
    ratio,
  };
}

export interface Preferences {
  family: FamilyId | 'any';
  acidity: number;
  body: number;
  process: string;
  roast: string;
}

export interface Recommendation {
  origin: Origin;
  process: (typeof processes)[number];
  roast: (typeof roasts)[number];
  method: Method;
  reasons: Localized[];
  score: number;
}

export function recommend(preferences: Preferences): Recommendation[] {
  if (
    ![preferences.acidity, preferences.body].every((v) => Number.isInteger(v) && v >= 1 && v <= 5)
  )
    return [];
  const roast = roasts.find((r) => r.id === preferences.roast);
  const method = methods.find((m) => m.id === (preferences.body >= 4 ? 'french-press' : 'v60'));
  if (!roast || !method) return [];
  return origins
    .filter(
      (origin) => preferences.process === 'any' || origin.processes.includes(preferences.process),
    )
    .map((origin) => {
      const hasFamily = origin.flavors.some((id) =>
        flavors.some((f) => f.id === id && f.family === preferences.family),
      );
      const acidityDistance = Math.abs(origin.acidity - preferences.acidity);
      const bodyDistance = Math.abs(origin.body - preferences.body);
      const process = processes.find(
        (p) => p.id === (preferences.process === 'any' ? origin.processes[0] : preferences.process),
      );
      if (!process) return null;
      const reasons: Localized[] = [];
      if (hasFamily)
        reasons.push(b('有你感兴趣的风味联想', 'Offers flavor associations you are curious about'));
      if (acidityDistance <= 1)
        reasons.push(
          b('适合作为酸感偏好的探索方向', 'A starting direction for your acidity preference'),
        );
      if (bodyDistance <= 1)
        reasons.push(b('杯感探索方向接近你的偏好', 'A body direction close to your preference'));
      if (!reasons.length)
        reasons.push(b('作为不同风格的对照样本', 'A contrasting style to compare'));
      return {
        origin,
        process,
        roast,
        method,
        reasons,
        score: (hasFamily ? 6 : 0) + 10 - acidityDistance - bodyDistance,
      };
    })
    .filter((result): result is Recommendation => result !== null)
    .sort((a, b) => b.score - a.score || a.origin.id.localeCompare(b.origin.id))
    .slice(0, 3);
}

export function formatDuration(seconds: number, locale: 'en' | 'zh') {
  if (seconds >= 3600)
    return `${Number((seconds / 3600).toFixed(1))} ${locale === 'zh' ? '小时' : 'h'}`;
  if (seconds >= 60)
    return `${Number((seconds / 60).toFixed(1))} ${locale === 'zh' ? '分钟' : 'min'}`;
  return `${seconds} ${locale === 'zh' ? '秒' : 's'}`;
}

export function formatMass(value: number) {
  return Number(value.toFixed(1)).toLocaleString('en-US', { maximumFractionDigits: 1 });
}
