import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createNote,
  deleteNote,
  downloadText,
  MAX_NOTES,
  NOTES_KEY,
  noteMarkdown,
  readNotes,
  saveNote,
  validNote,
} from '../src/lib/journal';

const draft = {
  title: '  Morning cup  ',
  date: '2026-09-11',
  origin: 'ethiopia',
  method: 'v60',
  process: 'washed',
  roast: 'light',
  dose: 15,
  water: 240,
  flavors: ['jasmine', 'lemon'],
  acidity: 4,
  sweetness: 3,
  bitterness: 2,
  body: 2,
  liking: 5,
  notes: '  Floral while cooling.  ',
};
const items = new Map<string, string>();
const storage = {
  getItem: (key: string) => items.get(key) ?? null,
  setItem: (key: string, value: string) => {
    items.set(key, value);
  },
};

beforeEach(() => items.clear());
describe('local tasting records', () => {
  it('saves, reloads, updates and deletes a valid record without duplication', () => {
    const note = createNote(draft, 'test-1', '2026-09-11T01:00:00.000Z');
    expect(note.title).toBe('Morning cup');
    expect(saveNote(storage, note)).toHaveLength(1);
    expect(readNotes(storage).notes[0]).toEqual(note);
    expect(saveNote(storage, { ...note, liking: 4 })).toHaveLength(1);
    expect(readNotes(storage).notes[0]?.liking).toBe(4);
    expect(deleteNote(storage, note.id)).toHaveLength(0);
  });
  it('refuses malformed IDs, dates, duplicates and invalid intensity values', () => {
    const note = createNote(draft);
    for (const change of [
      { date: 'not-a-date' },
      { date: '2026-02-30' },
      { date: '2026-99-99' },
      { method: 'unknown' },
      { flavors: ['jasmine', 'jasmine'] },
      { flavors: ['unknown'] },
      { acidity: 8 },
      { dose: NaN },
      { title: '   ' },
    ]) {
      expect(validNote({ ...note, ...change })).toBe(false);
    }
    expect(validNote(null)).toBe(false);
    expect(validNote({})).toBe(false);
  });
  it('preserves corrupt or future-version data without overwriting it', () => {
    for (const raw of [
      '{broken',
      'null',
      '[]',
      '{"notes":[]}',
      '{"version":1}',
      '{"version":2,"notes":[]}',
      '{"version":1,"notes":[{}]}',
    ]) {
      items.set(NOTES_KEY, raw);
      expect(readNotes(storage)).toMatchObject({ error: 'corrupt', raw });
      expect(() => saveNote(storage, createNote(draft))).toThrow('corrupt');
      expect(() => deleteNote(storage, 'missing')).toThrow('corrupt');
      expect(items.get(NOTES_KEY)).toBe(raw);
    }
  });
  it('rejects invalid drafts and records before writing storage', () => {
    expect(() => createNote({ ...draft, title: '   ' })).toThrow('invalid-note');
    const note = createNote(draft);
    expect(() => saveNote(storage, { ...note, water: 0 })).toThrow('invalid-note');
    expect(items.has(NOTES_KEY)).toBe(false);
  });
  it('preserves a full journal while allowing updates to an existing record', () => {
    const note = createNote(draft);
    const notes = Array.from({ length: MAX_NOTES }, (_, index) => ({
      ...note,
      id: `note-${index}`,
    }));
    const raw = JSON.stringify({ version: 1, notes });
    items.set(NOTES_KEY, raw);
    expect(() => saveNote(storage, note)).toThrow('full');
    expect(items.get(NOTES_KEY)).toBe(raw);
    expect(saveNote(storage, { ...note, id: 'note-0', notes: 'Updated' })).toHaveLength(MAX_NOTES);
    expect(readNotes(storage).notes[0]?.notes).toBe('Updated');
    for (const corrupt of [
      [note, note],
      [...notes, note],
    ]) {
      const damaged = JSON.stringify({ version: 1, notes: corrupt });
      items.set(NOTES_KEY, damaged);
      expect(readNotes(storage)).toMatchObject({ error: 'corrupt', raw: damaged });
      expect(() => deleteNote(storage, note.id)).toThrow('corrupt');
      expect(items.get(NOTES_KEY)).toBe(damaged);
    }
  });
  it('surfaces storage denial and quota errors instead of reporting a false save', () => {
    expect(
      readNotes({
        ...storage,
        getItem: () => {
          throw new Error('denied');
        },
      }).error,
    ).toBe('unavailable');
    expect(() =>
      saveNote(
        {
          ...storage,
          setItem: () => {
            throw new Error('quota');
          },
        },
        createNote(draft),
      ),
    ).toThrow('quota');
  });
  it('exports localized, escaped notes and keeps intensity separate from liking', () => {
    const note = createNote({ ...draft, title: 'Cup <script>alert(1)</script>' });
    const en = noteMarkdown(note, 'en');
    expect(en).toContain('Jasmine · Lemon');
    expect(en).toContain('Descriptive intensity (1–5, not quality)');
    expect(en).toContain('Personal liking (recorded separately): 5/5');
    expect(en).not.toContain('<script>');
    expect(noteMarkdown(note, 'zh')).toContain('茉莉 · 柠檬');
    expect(
      noteMarkdown(createNote({ ...draft, method: 'espresso', dose: 18, water: 36 }), 'en'),
    ).toContain('Beverage yield: 36 g');
  });
  it('exports unspecified origin and process without inventing flavor descriptors', () => {
    const note = createNote({ ...draft, origin: '', process: '', flavors: [] });
    expect(noteMarkdown(note, 'en')).toContain('Origin: Unspecified');
    expect(noteMarkdown(note, 'en')).toContain('Process: Unspecified');
    expect(noteMarkdown(note, 'en')).toContain('Flavor descriptors: —');
    expect(noteMarkdown(note, 'zh')).toContain('产地: 未指定');
  });
  it('downloads the requested text and releases its temporary object URL asynchronously', async () => {
    vi.useFakeTimers();
    const anchor = { href: '', download: '', click: vi.fn() };
    const createElement = vi.fn().mockReturnValue(anchor);
    vi.stubGlobal('document', { createElement });
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:coffee-export');
    const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    try {
      downloadText('Tasting notes', 'journal.txt');
      expect(createElement).toHaveBeenCalledWith('a');
      expect(anchor.href).toBe('blob:coffee-export');
      expect(anchor.download).toBe('journal.txt');
      expect(anchor.click).toHaveBeenCalledOnce();
      const blob = createUrl.mock.calls[0]?.[0];
      expect(blob).toBeInstanceOf(Blob);
      if (!(blob instanceof Blob)) throw new Error('Expected a download Blob');
      expect(blob.type).toBe('text/plain;charset=utf-8');
      expect(await blob.text()).toBe('Tasting notes');
      expect(revokeUrl).not.toHaveBeenCalled();
      vi.runOnlyPendingTimers();
      expect(revokeUrl).toHaveBeenCalledWith('blob:coffee-export');
    } finally {
      vi.useRealTimers();
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    }
  });
});
