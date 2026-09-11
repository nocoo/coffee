import {
  ArrowUpRight,
  Bookmark,
  Check,
  Copy,
  Download,
  FileDown,
  NotebookPen,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppLink, Modal, PageHeading, RangeField } from '../components/shared';
import { processes, roasts } from '../data/agriculture';
import { familyById, flavors } from '../data/flavors';
import { methods } from '../data/methods';
import { origins } from '../data/origins';
import { useCoffee } from '../lib/context';
import {
  createNote,
  deleteNote,
  downloadText,
  noteMarkdown,
  readNotes,
  saveNote,
  type TastingNote,
} from '../lib/journal';

const localDate = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const blank = () => ({
  title: '',
  date: localDate(),
  origin: '',
  method: 'v60',
  process: '',
  roast: 'medium',
  dose: 15,
  water: 240,
  acidity: 3,
  sweetness: 3,
  bitterness: 2,
  body: 3,
  liking: 3,
  notes: '',
});
function storedNotes() {
  try {
    return readNotes(window.localStorage);
  } catch {
    return { notes: [], error: 'unavailable' as const };
  }
}

export default function Journal() {
  const {
    ui,
    l,
    settings,
    notify,
    draftFlavors,
    setDraftFlavors,
    draftRecipe,
    setDraftRecipe,
    journalDraft,
    setJournalDraft,
    journalEditing: editing,
    setJournalEditing: setEditing,
  } = useCoffee();
  const [form, setForm] = useState(() => ({
    ...blank(),
    ...journalDraft,
    ...(draftRecipe
      ? {
          method: draftRecipe.method,
          dose: draftRecipe.dose,
          water: draftRecipe.water,
          ...(draftRecipe.origin ? { origin: draftRecipe.origin } : {}),
          ...(draftRecipe.roast ? { roast: draftRecipe.roast } : {}),
          ...(draftRecipe.process ? { process: draftRecipe.process } : {}),
        }
      : {}),
  }));
  const [stored, setStored] = useState(storedNotes);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  useEffect(() => {
    setDraftRecipe(null);
  }, [setDraftRecipe]);
  useEffect(() => {
    setJournalDraft(form);
    setHasSaved(false);
  }, [form, setJournalDraft]);
  useEffect(() => {
    const synchronize = (event: StorageEvent) => {
      if (event.key === 'coffee.journal.v1') setStored(storedNotes());
    };
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, []);
  const method = methods.find((m) => m.id === form.method);
  const update = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const currentNote = () =>
    createNote({ ...form, flavors: draftFlavors }, editing?.id, editing?.createdAt);
  const exportCurrent = () => {
    try {
      const note = currentNote();
      downloadText(
        noteMarkdown(note, settings.locale),
        `coffee-${note.date}.md`,
        'text/markdown;charset=utf-8',
      );
    } catch {
      notify(ui.invalidNote);
    }
  };
  const copyCurrent = async () => {
    let text: string;
    try {
      text = noteMarkdown(currentNote(), settings.locale);
    } catch {
      notify(ui.invalidNote);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      notify(ui.copied);
    } catch {
      notify(ui.copyError);
    }
  };
  const save = () => {
    let note: TastingNote;
    try {
      note = currentNote();
    } catch {
      notify(ui.invalidNote);
      return;
    }
    try {
      const notes = saveNote(window.localStorage, note);
      setStored({ notes, error: null });
      setEditing({ id: note.id, createdAt: note.createdAt });
      setHasSaved(true);
      notify(ui.noteSaved);
    } catch {
      notify(ui.storageError);
    }
  };
  const startNew = () => {
    setForm(blank());
    setDraftFlavors([]);
    setEditing(null);
    setHasSaved(false);
  };
  return (
    <div className="journal-page">
      <PageHeading
        eyebrow={ui.journalEyebrow}
        title={ui.journalTitle}
        description={ui.journalDescription}
      />
      {stored.error && (
        <div className="storage-warning" role="status">
          <p>{stored.error === 'corrupt' ? ui.corruptStorage : ui.storageError}</p>
          {'raw' in stored && stored.raw && (
            <button
              type="button"
              className="button button-outline"
              onClick={() =>
                downloadText(stored.raw ?? '', 'coffee-original-backup.json', 'application/json')
              }
            >
              {ui.rawBackup}
              <Download size={14} />
            </button>
          )}
        </div>
      )}
      <div className="journal-workspace">
        <form
          className="journal-form"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <div className="journal-form-heading">
            <span className="eyebrow">
              <NotebookPen size={14} />
              {ui.newNote}
            </span>
            <button type="button" className="text-link" onClick={startNew}>
              <Plus size={14} />
              {ui.newNote}
            </button>
          </div>
          <div className="form-row title-row">
            <label>
              {ui.noteTitle}
              <input
                required
                maxLength={100}
                placeholder={ui.notePlaceholder}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
              />
            </label>
            <label>
              {ui.date}
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              {ui.origin}
              <select value={form.origin} onChange={(e) => update('origin', e.target.value)}>
                <option value="">{ui.unspecified}</option>
                {origins.map((o) => (
                  <option value={o.id} key={o.id}>
                    {l(o.name)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {ui.method}
              <select
                value={form.method}
                onChange={(e) => {
                  const next = methods.find((m) => m.id === e.target.value);
                  if (next)
                    setForm({
                      ...form,
                      method: next.id,
                      dose: next.dose,
                      water: next.dose * next.ratio,
                    });
                }}
              >
                {methods.map((m) => (
                  <option value={m.id} key={m.id}>
                    {l(m.name)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              {ui.process}
              <select value={form.process} onChange={(e) => update('process', e.target.value)}>
                <option value="">{ui.unspecified}</option>
                {processes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {l(p.name)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {ui.roast}
              <select value={form.roast} onChange={(e) => update('roast', e.target.value)}>
                {roasts.map((r) => (
                  <option key={r.id} value={r.id}>
                    {l(r.name)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              {ui.coffee} (g)
              <input
                type="number"
                min="0.1"
                max="10000"
                step="any"
                value={form.dose || ''}
                required
                onChange={(e) => update('dose', Number(e.target.value))}
              />
            </label>
            <label>
              {method?.ratioBasis === 'yield' ? ui.yield : ui.water} (g)
              <input
                type="number"
                min="0.1"
                max="10000"
                step="any"
                value={form.water || ''}
                required
                onChange={(e) => update('water', Number(e.target.value))}
              />
            </label>
          </div>
          <div className="note-flavors">
            <div>
              <label htmlFor="add-note-flavor">
                {ui.selectedNotes}
                <span>{draftFlavors.length}/12</span>
              </label>
              <AppLink to="/" className="text-link">
                {ui.chooseFlavors}
                <ArrowUpRight size={13} />
              </AppLink>
            </div>
            <div className="note-flavor-chips">
              {draftFlavors.map((id) => {
                const flavor = flavors.find((f) => f.id === id);
                return flavor ? (
                  <button
                    type="button"
                    className="chip"
                    key={id}
                    onClick={() => {
                      setDraftFlavors(draftFlavors.filter((f) => f !== id));
                      setHasSaved(false);
                    }}
                    aria-label={`${ui.removeFlavor}: ${l(flavor.name)}`}
                  >
                    <span
                      className="flavor-dot"
                      style={{ background: familyById[flavor.family].color }}
                    />
                    {l(flavor.name)}
                    <X size={11} />
                  </button>
                ) : null;
              })}
            </div>
            <select
              id="add-note-flavor"
              value=""
              onChange={(e) => {
                if (!e.target.value) return;
                if (draftFlavors.length >= 12) {
                  notify(ui.maxFlavors);
                  return;
                }
                setDraftFlavors([...new Set([...draftFlavors, e.target.value])]);
                setHasSaved(false);
              }}
            >
              <option value="">+ {ui.flavor}</option>
              {flavors
                .filter((f) => !draftFlavors.includes(f.id))
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {l(f.name)} · {l(familyById[f.family].name)}
                  </option>
                ))}
            </select>
          </div>
          <fieldset className="intensity-fields">
            <legend>{ui.intensity}</legend>
            <p>{ui.intensityNote}</p>
            <div className="intensity-grid">
              {(['acidity', 'sweetness', 'bitterness', 'body'] as const).map((key) => (
                <RangeField
                  key={key}
                  label={ui[key]}
                  value={form[key]}
                  onChange={(value) => update(key, value)}
                  low={ui.low}
                  high={ui.high}
                />
              ))}
            </div>
          </fieldset>
          <div className="liking-field">
            <RangeField
              label={ui.liking}
              value={form.liking}
              onChange={(value) => update('liking', value)}
              low={l({ zh: '不太合意', en: 'Not for me' })}
              high={l({ zh: '非常喜欢', en: 'Love it' })}
            />
            <p>{ui.likingNote}</p>
          </div>
          <label className="notes-field">
            {ui.notes}
            <textarea
              maxLength={6000}
              rows={5}
              placeholder={ui.noteBodyPlaceholder}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </label>
          <div className="journal-form-actions">
            <button type="submit" className="button button-dark">
              {hasSaved ? <Check size={15} /> : <Bookmark size={15} />}
              {hasSaved ? ui.saved : ui.saveNote}
            </button>
            <button
              type="button"
              className="button button-outline"
              onClick={() => {
                void copyCurrent();
              }}
            >
              <Copy size={15} />
              {ui.copyNote}
            </button>
            <button type="button" className="button button-text" onClick={exportCurrent}>
              <FileDown size={15} />
              {ui.exportNote}
            </button>
          </div>
        </form>
        <aside className="journal-preview">
          <div className="journal-paper">
            <span className="paper-brand">
              coffee<span>{l({ zh: '品鉴手记', en: 'FIELD NOTES' })}</span>
            </span>
            <span className="paper-date">{form.date}</span>
            <h2>{form.title || ui.noNotes}</h2>
            <div className="paper-rule" />
            <div className="paper-meta">
              <span>
                {origins.find((o) => o.id === form.origin)
                  ? l(origins.find((o) => o.id === form.origin)?.name ?? { zh: '', en: '' })
                  : ui.unspecified}
              </span>
              <span>
                {method ? l(method.name) : ''} · {form.dose} g / {form.water} g
              </span>
            </div>
            <div className="paper-flavors">
              {draftFlavors.length ? (
                draftFlavors.map((id) => {
                  const f = flavors.find((item) => item.id === id);
                  return f ? <span key={id}>{l(f.name)}</span> : null;
                })
              ) : (
                <span className="paper-empty">✧ {ui.selectedNotes}</span>
              )}
            </div>
            <div className="paper-intensity">
              {(['acidity', 'sweetness', 'bitterness', 'body'] as const).map((key) => (
                <div key={key}>
                  <span>{ui[key]}</span>
                  <span className="intensity-dots">
                    <span className="sr-only">{form[key]} / 5</span>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <i key={value} className={value <= form[key] ? 'filled' : ''} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <p className="paper-liking">
              {ui.liking}
              <span>{form.liking} / 5</span>
            </p>
            <p className="paper-notes">{form.notes || ui.noteBodyPlaceholder}</p>
            <div className="paper-bottom">
              <span>{ui.intensityNote}</span>
              <span aria-hidden="true">✳</span>
            </div>
          </div>
          <p className="gentle-note">
            {l({
              zh: '这是一份个人感官手记，不是官方 CVA 评分表。导出后，你可以把它带到下一次杯测。',
              en: 'A personal sensory record, not an official CVA scoring form. Export it and bring it to your next tasting.',
            })}
          </p>
        </aside>
      </div>
      <section className="section saved-notes">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {stored.notes.length} {ui.journal}
            </span>
            <h2>{ui.savedNotes}</h2>
          </div>
          <button
            type="button"
            className="button button-outline"
            disabled={!stored.notes.length}
            onClick={() =>
              downloadText(
                JSON.stringify({ version: 1, notes: stored.notes }, null, 2),
                `coffee-journal-${localDate()}.json`,
                'application/json',
              )
            }
          >
            <Download size={15} />
            {ui.exportAll}
          </button>
        </div>
        {!stored.notes.length ? (
          <div className="empty-notebook">
            <NotebookPen size={33} strokeWidth={1.2} />
            <p>{ui.noNotes}</p>
          </div>
        ) : (
          <div className="saved-note-grid">
            {stored.notes.map((note) => (
              <article key={note.id} className="saved-note">
                <span className="micro">{note.date}</span>
                <h3>{note.title}</h3>
                <p>
                  {methods.find((m) => m.id === note.method)?.name[settings.locale]} · {note.dose} g
                  / {note.water} g
                </p>
                <div className="saved-note-flavors">
                  {note.flavors.map((id) => (
                    <span key={id}>{flavors.find((f) => f.id === id)?.name[settings.locale]}</span>
                  ))}
                </div>
                <p className="saved-note-excerpt">{note.notes}</p>
                <div className="saved-note-actions">
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      const { id, createdAt, flavors: noteFlavors, ...values } = note;
                      setForm(values);
                      setEditing({ id, createdAt });
                      setDraftFlavors(noteFlavors);
                      document.querySelector('.journal-form')?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    {l({ zh: '查看与编辑', en: 'View & edit' })}
                    <ArrowUpRight size={13} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`${ui.exportNote}: ${note.title}`}
                    onClick={() =>
                      downloadText(
                        noteMarkdown(note, settings.locale),
                        `coffee-${note.date}.md`,
                        'text/markdown;charset=utf-8',
                      )
                    }
                  >
                    <Download size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`${ui.deleteNote}: ${note.title}`}
                    onClick={() => setDeleteId(note.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {deleteId && (
        <Modal title={ui.confirmDelete} onClose={() => setDeleteId(null)} className="confirm-modal">
          <p>{stored.notes.find((note) => note.id === deleteId)?.title}</p>
          <div className="confirm-actions">
            <button
              type="button"
              className="button button-outline"
              onClick={() => setDeleteId(null)}
            >
              {ui.cancel}
            </button>
            <button
              type="button"
              className="button button-dark"
              onClick={() => {
                try {
                  const notes = deleteNote(window.localStorage, deleteId);
                  setStored({ notes, error: null });
                  if (editing?.id === deleteId) setEditing(null);
                  setDeleteId(null);
                } catch {
                  notify(ui.storageError);
                }
              }}
            >
              {ui.confirm}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
