export type Locale = 'zh' | 'en';
export type Localized = { zh: string; en: string };
export const b = (zh: string, en: string): Localized => ({ zh, en });

export type FamilyId = 'fruit' | 'floral' | 'sweet' | 'nut' | 'spice' | 'roast' | 'green' | 'earth';
export type Theme = 'daylight' | 'espresso' | 'terroir';
export type SourceId =
  | 'wcr-lexicon'
  | 'wcr-varieties'
  | 'sca-cva'
  | 'sca-standards'
  | 'cqi'
  | 'ico'
  | 'ucdavis'
  | 'icafe'
  | 'anacafe'
  | 'fnc'
  | 'hario'
  | 'chemex'
  | 'aeropress'
  | 'bialetti'
  | 'sca-water'
  | 'india-board'
  | 'uganda-profiles'
  | 'ico-china'
  | 'vicofa'
  | 'cafeimports';

export interface Family {
  id: FamilyId;
  name: Localized;
  subtitle: Localized;
  description: Localized;
  color: string;
  darkColor: string;
  icon: string;
}

export interface FlavorGroup {
  id: string;
  family: FamilyId;
  name: Localized;
  description: Localized;
}

export interface Flavor {
  id: string;
  family: FamilyId;
  group: string;
  name: Localized;
  description: Localized;
  reference: Localized;
  distinction: Localized;
  related: string[];
  sources: SourceId[];
}

export interface Origin {
  id: string;
  name: Localized;
  region: Localized;
  continent: 'africa' | 'americas' | 'asia';
  coordinates: [number, number];
  elevation: [number, number];
  description: Localized;
  context: Localized;
  varieties: string[];
  processes: string[];
  flavors: string[];
  acidity: number;
  body: number;
  sources: SourceId[];
}

export interface Method {
  id: string;
  name: Localized;
  category: 'filter' | 'immersion' | 'pressure' | 'decoction';
  description: Localized;
  ratio: number;
  ratioRange: [number, number];
  ratioBasis: 'water' | 'yield';
  dose: number;
  temperature: [number, number];
  seconds: [number, number];
  grind: Localized;
  steps: Localized[];
  tip: Localized;
  caution: Localized;
  sources: SourceId[];
}

export interface Knowledge {
  id: string;
  name: Localized;
  category: 'sensory' | 'extraction' | 'cupping' | 'defects';
  summary: Localized;
  body: Localized;
  practice: Localized;
  sources: SourceId[];
}

export interface Variety {
  id: string;
  name: Localized;
  description: Localized;
  species: 'arabica' | 'canephora';
  sources: SourceId[];
}

export interface Process {
  id: string;
  name: Localized;
  description: Localized;
  effect: Localized;
  sources: SourceId[];
}

export interface Roast {
  id: string;
  name: Localized;
  description: Localized;
  tip: Localized;
}

export interface LearningPath {
  id: string;
  name: Localized;
  description: Localized;
  duration: Localized;
  lessons: string[];
  exercises: Localized[];
}
