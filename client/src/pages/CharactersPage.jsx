import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useDebouncedValue } from '../hooks/useApi.js';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import SearchField from '../components/SearchField.jsx';
import CharacterCard from '../components/CharacterCard.jsx';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback.jsx';
import { PlusIcon, UsersIcon } from '../components/Icons.jsx';

export default function CharactersPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);
  const { data: characters, loading, error, reload } = useApi(
    () => api.listCharacters({ q: debouncedQuery }),
    [debouncedQuery],
  );

  return (
    <div>
      <PageHeader
        eyebrow="The crew & rivals"
        title="Character directory"
        description="Every character in the notebook. Search by name or alias, then open a profile to see their connections and lore."
        actions={
          <Link to="/characters/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add character
          </Link>
        }
      />

      <div className="surface mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search by name or alias…"
          className="flex-1"
        />
        <p className="text-xs text-ink-muted sm:px-2">
          {characters ? (
            <>
              <span className="font-semibold text-ink">{characters.length}</span>{' '}
              {characters.length === 1 ? 'character' : 'characters'}
              {debouncedQuery ? ` matching “${debouncedQuery}”` : ''}
            </>
          ) : (
            'Loading characters…'
          )}
        </p>
      </div>

      {error ? <ErrorMessage error={error} onRetry={reload} title="Could not load characters" /> : null}

      {loading && !characters ? <Loader label="Loading characters…" /> : null}

      {characters && characters.length === 0 ? (
        debouncedQuery ? (
          <EmptyState
            icon={<UsersIcon className="h-5 w-5" />}
            title="No characters match that search"
            description="Try a different name or alias, or clear the search to see everyone."
            action={
              <button type="button" className="btn-secondary" onClick={() => setQuery('')}>
                Clear search
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<UsersIcon className="h-5 w-5" />}
            title="No characters yet"
            description="Add the first character to start building the archive."
            action={
              <Link to="/characters/new" className="btn-primary">
                <PlusIcon className="h-4 w-4" />
                Add character
              </Link>
            }
          />
        )
      ) : null}

      {characters && characters.length > 0 ? (
        <div
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            loading ? 'opacity-60 transition-opacity' : ''
          }`}
        >
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
