import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi, useDebouncedValue } from '../hooks/useApi.js';
import api from '../services/api.js';
import { LORE_CATEGORIES } from '../constants.js';
import PageHeader from '../components/PageHeader.jsx';
import SearchField from '../components/SearchField.jsx';
import LoreCard from '../components/LoreCard.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback.jsx';
import { BookIcon, PlusIcon } from '../components/Icons.jsx';

const filterChip = (active) =>
  [
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
    active
      ? 'border-ink bg-ink text-parchment'
      : 'border-line bg-parchment-light text-ink-soft hover:border-gold/60 hover:text-ink',
  ].join(' ');

export default function LorePage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [category, setCategory] = useState(() => {
    const requested = searchParams.get('category');
    return LORE_CATEGORIES.some((item) => item.value === requested) ? requested : 'all';
  });
  const debouncedQuery = useDebouncedValue(query, 250);

  const { data: entries, loading, error, reload } = useApi(
    () =>
      api.listLoreEntries({
        q: debouncedQuery,
        category: category === 'all' ? undefined : category,
      }),
    [debouncedQuery, category],
  );

  const [entryToDelete, setEntryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete() {
    if (!entryToDelete) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      await api.deleteLoreEntry(entryToDelete.id);
      setEntryToDelete(null);
      reload();
    } catch (requestError) {
      setDeleteError(requestError);
    } finally {
      setDeleting(false);
    }
  }

  const hasFilters = Boolean(debouncedQuery) || category !== 'all';

  return (
    <div>
      <PageHeader
        eyebrow="Facts, theories & questions"
        title="Lore library"
        description="Every note carries a category and a source. Filter by what you trust, or search for a title you remember."
        actions={
          <Link to="/lore/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add lore entry
          </Link>
        }
      />

      <div className="surface mb-6 space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search lore by title…"
            className="flex-1"
          />
          <p className="text-xs text-ink-muted sm:px-2">
            {entries ? (
              <>
                <span className="font-semibold text-ink">{entries.length}</span>{' '}
                {entries.length === 1 ? 'entry' : 'entries'}
              </>
            ) : (
              'Loading entries…'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setCategory('all')} className={filterChip(category === 'all')}>
            All categories
          </button>
          {LORE_CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={filterChip(category === item.value)}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <ErrorMessage error={error} onRetry={reload} title="Could not load the lore library" /> : null}

      {loading && !entries ? <Loader label="Opening the lore library…" /> : null}

      {entries && entries.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={<BookIcon className="h-5 w-5" />}
            title="No entries match these filters"
            description="Try a different category, a shorter search term, or clear the filters to see everything."
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<BookIcon className="h-5 w-5" />}
            title="The library is empty"
            description="Record an important fact, an open question or a theory — each entry needs a source."
            action={
              <Link to="/lore/new" className="btn-primary">
                <PlusIcon className="h-4 w-4" />
                Add the first entry
              </Link>
            }
          />
        )
      ) : null}

      {entries && entries.length > 0 ? (
        <div className={`grid gap-5 lg:grid-cols-2 ${loading ? 'opacity-60 transition-opacity' : ''}`}>
          {entries.map((entry) => (
            <LoreCard key={entry.id} entry={entry} onDelete={setEntryToDelete} />
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(entryToDelete)}
        title="Delete this lore entry?"
        description={entryToDelete ? `“${entryToDelete.title}” will be removed permanently.` : ''}
        busy={deleting}
        error={deleteError}
        onCancel={() => {
          setEntryToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
