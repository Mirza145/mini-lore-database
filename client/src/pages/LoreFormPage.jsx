import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import api from '../services/api.js';
import { LORE_CATEGORIES } from '../constants.js';
import PageHeader from '../components/PageHeader.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback.jsx';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '../components/Icons.jsx';
import { safeHttpUrl } from '../utils/format.js';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-crimson">{message}</p>;
}

function emptyForm(preselectedCharacterId) {
  return {
    title: '',
    content: '',
    category: 'canon',
    characters: preselectedCharacterId ? [preselectedCharacterId] : [],
    sourceTitle: '',
    sourceUrl: '',
    episodeOrChapter: '',
  };
}

export default function LoreFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const preselectedCharacterId = searchParams.get('characterId');

  const entryRequest = useApi(
    () => (isEdit ? api.getLoreEntry(id) : Promise.resolve(null)),
    [id, isEdit],
  );
  const charactersRequest = useApi(() => api.listCharacters(), []);

  const [form, setForm] = useState(() => emptyForm(preselectedCharacterId));
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestError, setRequestError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const loadedEntry = entryRequest.data?.id === id ? entryRequest.data : null;

  useEffect(() => {
    if (!loadedEntry) return;
    setForm({
      title: loadedEntry.title ?? '',
      content: loadedEntry.content ?? '',
      category: loadedEntry.category ?? 'canon',
      characters: (loadedEntry.characters ?? []).map((character) => character.id),
      sourceTitle: loadedEntry.sourceTitle ?? '',
      sourceUrl: loadedEntry.sourceUrl ?? '',
      episodeOrChapter: loadedEntry.episodeOrChapter ?? '',
    });
  }, [loadedEntry]);

  const update = (field) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const toggleCharacter = (characterId) => {
    setForm((previous) => ({
      ...previous,
      characters: previous.characters.includes(characterId)
        ? previous.characters.filter((value) => value !== characterId)
        : [...previous.characters, characterId],
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = {};
    if (!form.title.trim()) errors.title = 'A title is required.';
    if (!form.content.trim()) errors.content = 'Content is required.';
    if (!form.sourceTitle.trim()) errors.sourceTitle = 'A source title is required.';
    if (form.sourceUrl.trim() && !safeHttpUrl(form.sourceUrl.trim())) {
      errors.sourceUrl = 'Enter a valid http or https URL.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      characters: form.characters,
      sourceTitle: form.sourceTitle.trim(),
      sourceUrl: form.sourceUrl.trim(),
      episodeOrChapter: form.episodeOrChapter.trim(),
    };

    setSaving(true);
    setRequestError(null);

    try {
      if (isEdit) {
        await api.updateLoreEntry(id, payload);
      } else {
        await api.createLoreEntry(payload);
      }
      navigate('/lore');
    } catch (error) {
      setRequestError(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);

    try {
      await api.deleteLoreEntry(id);
      navigate('/lore');
    } catch (error) {
      setDeleteError(error);
    } finally {
      setDeleting(false);
    }
  }

  if (isEdit && entryRequest.loading && !loadedEntry) {
    return <Loader label="Loading lore entry…" />;
  }

  if (isEdit && entryRequest.error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          error={entryRequest.error}
          onRetry={entryRequest.reload}
          title="Could not load this lore entry"
        />
        <Link to="/lore" className="btn-secondary">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to the lore library
        </Link>
      </div>
    );
  }

  const characters = charactersRequest.data ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/lore"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted transition hover:text-crimson"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Lore library
      </Link>

      <PageHeader
        eyebrow={isEdit ? 'Edit entry' : 'New entry'}
        title={isEdit ? 'Edit lore entry' : 'Add a lore entry'}
        description="Write the note in your own words, pick what kind of claim it is, and record where it came from."
      />

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {requestError ? <ErrorMessage error={requestError} title="Could not save this entry" /> : null}

        <section className="surface space-y-5 p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-parchment">
              1
            </span>
            <h2 className="font-display text-xl font-semibold">The note</h2>
          </div>

          <div>
            <label className="label" htmlFor="lore-title">
              Title <span className="text-crimson">*</span>
            </label>
            <input
              id="lore-title"
              className="input"
              value={form.title}
              onChange={update('title')}
              maxLength={160}
              autoFocus
              placeholder="e.g. The straw hat is a promise"
              aria-invalid={Boolean(fieldErrors.title)}
            />
            <FieldError message={fieldErrors.title} />
          </div>

          <div>
            <span className="label">Category</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {LORE_CATEGORIES.map((item) => {
                const active = form.category === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => update('category')(item.value)}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-gold bg-gold/10 ring-1 ring-gold/30'
                        : 'border-line bg-white/60 hover:border-gold/50'
                    }`}
                    aria-pressed={active}
                  >
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{item.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="lore-content">
              Content <span className="text-crimson">*</span>
            </label>
            <textarea
              id="lore-content"
              className="input min-h-40 resize-y leading-relaxed"
              value={form.content}
              onChange={update('content')}
              maxLength={4000}
              placeholder="What happened, what is claimed, and why does it matter?"
              aria-invalid={Boolean(fieldErrors.content)}
            />
            <div className="mt-1 flex items-center justify-between gap-3">
              <FieldError message={fieldErrors.content} />
              <p className="ml-auto text-xs text-ink-muted">{form.content.length}/4000</p>
            </div>
          </div>
        </section>

        <section className="surface space-y-4 p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-parchment">
              2
            </span>
            <h2 className="font-display text-xl font-semibold">Connected characters</h2>
          </div>
          <p className="text-xs text-ink-muted">
            Optional. Select everyone the note is about so it appears on their profiles.
          </p>

          {charactersRequest.error ? (
            <ErrorMessage error={charactersRequest.error} onRetry={charactersRequest.reload} title="Could not load characters" />
          ) : null}

          {charactersRequest.loading && !charactersRequest.data ? <Loader label="Loading characters…" className="py-8" /> : null}

          {charactersRequest.data && characters.length === 0 ? (
            <EmptyState
              title="No characters yet"
              description="Add a character first so lore entries can be linked to them."
              action={
                <Link to="/characters/new" className="btn-secondary">
                  <PlusIcon className="h-4 w-4" />
                  Add a character
                </Link>
              }
            />
          ) : null}

          {characters.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {characters.map((character) => {
                const checked = form.characters.includes(character.id);
                return (
                  <label
                    key={character.id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-sm transition ${
                      checked
                        ? 'border-gold bg-gold/10'
                        : 'border-line bg-white/60 hover:border-gold/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCharacter(character.id)}
                      className="h-4 w-4 shrink-0 accent-crimson"
                    />
                    <span className="min-w-0 flex-1 truncate font-medium">{character.name}</span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="surface space-y-4 p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-parchment">
              3
            </span>
            <h2 className="font-display text-xl font-semibold">Source</h2>
          </div>
          <p className="text-xs text-ink-muted">
            Every entry needs a source. Link a reference page or record the episode or chapter.
          </p>

          <div>
            <label className="label" htmlFor="lore-source-title">
              Source title <span className="text-crimson">*</span>
            </label>
            <input
              id="lore-source-title"
              className="input"
              value={form.sourceTitle}
              onChange={update('sourceTitle')}
              maxLength={200}
              placeholder="e.g. One Piece Wiki — Straw Hat"
              aria-invalid={Boolean(fieldErrors.sourceTitle)}
            />
            <FieldError message={fieldErrors.sourceTitle} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="lore-source-url">
                Source URL
              </label>
              <input
                id="lore-source-url"
                className="input"
                value={form.sourceUrl}
                onChange={update('sourceUrl')}
                maxLength={500}
                placeholder="https://…"
                inputMode="url"
                aria-invalid={Boolean(fieldErrors.sourceUrl)}
              />
              <FieldError message={fieldErrors.sourceUrl} />
            </div>

            <div>
              <label className="label" htmlFor="lore-episode">
                Episode / chapter
              </label>
              <input
                id="lore-episode"
                className="input"
                value={form.episodeOrChapter}
                onChange={update('episodeOrChapter')}
                maxLength={120}
                placeholder="e.g. Manga Chapter 1"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {isEdit ? (
            <button type="button" className="btn-danger" onClick={() => setDeleteOpen(true)}>
              <TrashIcon className="h-4 w-4" />
              Delete entry
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-2">
            <Link to="/lore" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add lore entry'}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this lore entry?"
        description={
          loadedEntry
            ? `“${loadedEntry.title}” will be removed from the archive. This cannot be undone.`
            : 'This entry will be removed from the archive. This cannot be undone.'
        }
        busy={deleting}
        busyLabel="Deleting…"
        confirmLabel="Delete entry"
        error={deleteError}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
