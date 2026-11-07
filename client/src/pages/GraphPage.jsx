import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import api from '../services/api.js';
import { RELATIONSHIP_TYPE_MAP } from '../constants.js';
import PageHeader from '../components/PageHeader.jsx';
import GraphView from '../components/GraphView.jsx';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback.jsx';
import { ArrowRightIcon, ChevronDownIcon, GraphIcon, PlusIcon, UsersIcon } from '../components/Icons.jsx';

export default function GraphPage() {
  const navigate = useNavigate();
  const charactersRequest = useApi(() => api.listCharacters(), []);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const characters = charactersRequest.data;
    if (!characters?.length || selectedId) return;
    const preferred =
      characters.find((character) => character.name === 'Monkey D. Luffy') ?? characters[0];
    setSelectedId(preferred.id);
  }, [charactersRequest.data, selectedId]);

  const relationshipsRequest = useApi(
    () =>
      selectedId
        ? api
            .listRelationships({ characterId: selectedId })
            .then((list) => ({ characterId: selectedId, list }))
        : Promise.resolve({ characterId: '', list: [] }),
    [selectedId],
  );

  const selectedCharacter = useMemo(
    () => charactersRequest.data?.find((character) => character.id === selectedId) ?? null,
    [charactersRequest.data, selectedId],
  );

  const handleNodeClick = useCallback((characterId) => navigate(`/characters/${characterId}`), [navigate]);

  // Ignore a previous character's result while the new request is in flight.
  const loadedRelationships =
    relationshipsRequest.data?.characterId === selectedId ? relationshipsRequest.data.list : null;
  const relationshipsLoading =
    !relationshipsRequest.error && (relationshipsRequest.loading || loadedRelationships === null);
  const relationships = relationshipsLoading ? [] : loadedRelationships;
  const presentTypes = [...new Set(relationships.map((relationship) => relationship.type))];

  if (charactersRequest.loading && !charactersRequest.data) {
    return <Loader label="Drawing the map…" />;
  }

  if (charactersRequest.error) {
    return (
      <ErrorMessage
        error={charactersRequest.error}
        onRetry={charactersRequest.reload}
        title="Could not load the character list"
      />
    );
  }

  const characters = charactersRequest.data ?? [];

  if (characters.length === 0) {
    return (
      <div>
        <PageHeader
          eyebrow="Who knows whom"
          title="Relationship graph"
          description="Pick a character to see their direct connections."
        />
        <EmptyState
          icon={<UsersIcon className="h-5 w-5" />}
          title="No characters to map"
          description="The graph needs at least one character. Add a couple of characters and connect them first."
          action={
            <Link to="/characters/new" className="btn-primary">
              <PlusIcon className="h-4 w-4" />
              Add a character
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Who knows whom"
        title="Relationship graph"
        description="Pick a character to see their immediate connections. Arrows follow the stored direction; select any node to open that profile."
      />

      <div className="surface mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label className="label" htmlFor="graph-character">
            Character
          </label>
          <div className="relative">
            <select
              id="graph-character"
              className="input appearance-none pr-9"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          </div>
        </div>

        {selectedCharacter ? (
          <div className="flex flex-wrap gap-2">
            <Link to={`/characters/${selectedCharacter.id}`} className="btn-secondary">
              Open profile
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>

      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {selectedCharacter ? selectedCharacter.name : 'Relationship graph'}
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              {relationshipsLoading
                ? 'Mapping direct connections…'
                : `${relationships.length} direct ${relationships.length === 1 ? 'connection' : 'connections'}`}
            </p>
          </div>

          {presentTypes.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {presentTypes.map((type) => {
                const meta = RELATIONSHIP_TYPE_MAP[type] ?? { label: type, color: '#6f7789' };
                return (
                  <li key={type} className="chip">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    {meta.label}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {relationshipsRequest.error ? (
          <div className="p-5">
            <ErrorMessage
              error={relationshipsRequest.error}
              onRetry={relationshipsRequest.reload}
              title="Could not load the graph"
            />
          </div>
        ) : null}

        {relationshipsLoading ? <Loader label="Mapping connections…" /> : null}

        {!relationshipsLoading && !relationshipsRequest.error && relationships.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<GraphIcon className="h-5 w-5" />}
              title="No connections to show"
              description={
                selectedCharacter
                  ? `${selectedCharacter.name} has no direct relationships yet. Add one from the profile to see it here.`
                  : 'This character has no direct relationships yet.'
              }
              action={
                selectedCharacter ? (
                  <Link to={`/characters/${selectedCharacter.id}`} className="btn-primary">
                    <PlusIcon className="h-4 w-4" />
                    Add a relationship
                  </Link>
                ) : null
              }
            />
          </div>
        ) : null}

        {!relationshipsLoading && !relationshipsRequest.error && relationships.length > 0 && selectedCharacter ? (
          <>
            <div className="bg-parchment-light/40 px-1 py-2">
              <GraphView
                character={selectedCharacter}
                relationships={relationships}
                onNodeClick={handleNodeClick}
              />
            </div>
            <div className="flex flex-col gap-2 border-t border-line/80 px-5 py-3 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
              <p>Drag to pan, scroll to zoom, and select a node to open that character's profile.</p>
              {selectedCharacter ? (
                <Link
                  to={`/characters/${selectedCharacter.id}`}
                  className="font-semibold text-crimson link-underline"
                >
                  Manage connections on the profile
                </Link>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
