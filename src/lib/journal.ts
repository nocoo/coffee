import { processes, roasts } from '../data/agriculture';
import { flavors } from '../data/flavors';
import { methods } from '../data/methods';
import { origins } from '../data/origins';
import type { Locale } from '../data/types';

export const NOTES_KEY = 'coffee.journal.v1';
export const MAX_NOTES = 200;

export interface TastingNote {
  id: string;
  createdAt: string;
  date: string;
  title: string;
  origin: string;
  method: string;
  process: string;
  roast: string;
  dose: number;
  water: number;
  flavors: string[];
  acidity: number;
  sweetness: number;
  bitterness: number;
  body: number;
  liking: number;
  notes: string;
}

type NoteDraft = Omit<TastingNote, 'id' | 'createdAt'>;
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function validNote(value: unknown): value is TastingNote {
  if (!value || typeof value !== 'object') return false;
  const note = value as Record<string, unknown>;
  const text = (key: string, max: number) =>
    typeof note[key] === 'string' && note[key].length <= max;
  const date = new Date(`${String(note.date)}T12:00:00Z`);
  return (
    text('id', 80) &&
    Boolean(note.id) &&
    text('createdAt', 40) &&
    Number.isFinite(Date.parse(String(note.createdAt))) &&
    text('date', 10) &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(note.date)) &&
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === note.date &&
    text('title', 100) &&
    Boolean(String(note.title).trim()) &&
    text('notes', 6000) &&
    (note.origin === '' || origins.some((o) => o.id === note.origin)) &&
    methods.some((m) => m.id === note.method) &&
    roasts.some((r) => r.id === note.roast) &&
    (note.process === '' || processes.some((p) => p.id === note.process)) &&
    ['acidity', 'sweetness', 'bitterness', 'body', 'liking'].every(
      (key) => Number.isInteger(note[key]) && Number(note[key]) >= 1 && Number(note[key]) <= 5,
    ) &&
    ['dose', 'water'].every(
      (key) =>
        typeof note[key] === 'number' &&
        Number.isFinite(note[key]) &&
        Number(note[key]) > 0 &&
        Number(note[key]) <= 10000,
    ) &&
    Array.isArray(note.flavors) &&
    note.flavors.length <= 12 &&
    new Set(note.flavors).size === note.flavors.length &&
    note.flavors.every((id: unknown) => typeof id === 'string' && flavors.some((f) => f.id === id))
  );
}

export function createNote(
  draft: NoteDraft,
  id: string = crypto.randomUUID(),
  now = new Date().toISOString(),
): TastingNote {
  const result = {
    ...draft,
    title: draft.title.trim(),
    notes: draft.notes.trim(),
    id,
    createdAt: now,
  };
  if (!validNote(result)) throw new Error('invalid-note');
  return result;
}

export function readNotes(storage: StorageLike): {
  notes: TastingNote[];
  error: 'corrupt' | 'unavailable' | null;
  raw?: string;
} {
  let raw: string | null;
  try {
    raw = storage.getItem(NOTES_KEY);
  } catch {
    return { notes: [], error: 'unavailable' };
  }
  if (!raw) return { notes: [], error: null };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('version' in parsed) ||
      parsed.version !== 1 ||
      !('notes' in parsed) ||
      !Array.isArray(parsed.notes) ||
      parsed.notes.length > MAX_NOTES ||
      !parsed.notes.every(validNote) ||
      new Set(parsed.notes.map((n: TastingNote) => n.id)).size !== parsed.notes.length
    )
      throw new Error('schema');
    return { notes: parsed.notes, error: null };
  } catch {
    return { notes: [], error: 'corrupt', raw };
  }
}

export function saveNote(storage: StorageLike, note: TastingNote): TastingNote[] {
  if (!validNote(note)) throw new Error('invalid-note');
  const existing = readNotes(storage);
  if (existing.error) throw new Error(existing.error);
  const notes = [note, ...existing.notes.filter((n) => n.id !== note.id)];
  if (notes.length > MAX_NOTES) throw new Error('full');
  // A failed write throws before the caller can show success. Corrupt data is never overwritten.
  storage.setItem(NOTES_KEY, JSON.stringify({ version: 1, notes }));
  return notes;
}

export function deleteNote(storage: StorageLike, id: string): TastingNote[] {
  const existing = readNotes(storage);
  if (existing.error) throw new Error(existing.error);
  const notes = existing.notes.filter((n) => n.id !== id);
  storage.setItem(NOTES_KEY, JSON.stringify({ version: 1, notes }));
  return notes;
}

export function noteMarkdown(note: TastingNote, locale: Locale): string {
  const label = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const method = methods.find((m) => m.id === note.method);
  const clean = (text: string) =>
    text.replace(/[\r\n]+/g, ' ').replace(/([\\`*_{}[\]<>#|])/g, '\\$1');
  return [
    `# ${clean(note.title)}`,
    '',
    `${label('日期', 'Date')}: ${note.date}`,
    `${label('产地', 'Origin')}: ${origins.find((o) => o.id === note.origin)?.name[locale] ?? label('未指定', 'Unspecified')}`,
    `${label('处理', 'Process')}: ${processes.find((p) => p.id === note.process)?.name[locale] ?? label('未指定', 'Unspecified')}`,
    `${label('烘焙', 'Roast')}: ${roasts.find((r) => r.id === note.roast)?.name[locale]}`,
    `${label('方法', 'Method')}: ${method?.name[locale]}`,
    `${label('咖啡', 'Coffee')}: ${note.dose} g · ${method?.ratioBasis === 'yield' ? label('出液', 'Beverage yield') : label('注水', 'Input water')}: ${note.water} g`,
    '',
    `${label('风味描述', 'Flavor descriptors')}: ${note.flavors.map((id) => flavors.find((f) => f.id === id)?.name[locale]).join(' · ') || '—'}`,
    '',
    `${label('描述性强度（1–5，非品质分）', 'Descriptive intensity (1–5, not quality)')}`,
    `${label('酸感', 'Acidity')} ${note.acidity} · ${label('甜感', 'Sweetness')} ${note.sweetness} · ${label('苦感', 'Bitterness')} ${note.bitterness} · ${label('醇厚度', 'Body')} ${note.body}`,
    '',
    `${label('个人喜好（单独记录）', 'Personal liking (recorded separately)')}: ${note.liking}/5`,
    '',
    clean(note.notes),
    '',
    label(
      '由 coffee · 风味宇宙生成。非官方 CVA 表。',
      'Created with coffee · a flavor universe. Not an official CVA form.',
    ),
    'https://coffee.hexly.ai',
  ].join('\n');
}

export function downloadText(content: string, filename: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
