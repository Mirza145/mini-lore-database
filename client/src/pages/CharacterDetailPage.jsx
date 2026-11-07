import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import api from '../services/api.js';
import { RELATIONSHIP_TYPE_MAP } from '../constants.js';
import Avatar from '../components/Avatar.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import RelationshipForm from '../components/RelationshipForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback.jsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  GraphIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '../components/Icons.jsx';
import { formatDate } from '../utils/format.js';

export default function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const characterRequest = useApi(() => api.getCharacter(id), [id]);
  const relationshipsRequest = useApi(() => api.listRelationships({ characterId: id }), [id]);
  const loreRequest = useApi(() => api.listLoreEntries({ characterId: id }), [id]);
  const allCharactersRequest = useApi(() => api.listCharacters(), []);

  const [relationshipFormOpen, setRelationshipFormOpen] = useState(false);
  const [relationshipToDelete, setRelationshipToDelete] = useState(null);
  const [deletingRelationship, setDeletingRelationship] = useState(false);
  const [relationshipDeleteError, setRelationshipDeleteError] = useState(null);

  const [deleteCharacterOpen, setDeleteCharacterOpen] = useState(false);
  const [deletingCharacter, setDeletingCharacter] = useState(false);
  const [characterDeleteError, setCharacterDeleteError] = useState(null);

  const character = characterRequest.data?.id === id ? characterRequest.data : null;
  const relationships = (relationshipsRequest.data ?? []).filter(
    (relationship) =>
      relationship.fromCharacter?.id === id || relationship.toCharacter?.id === id,
  );
  const loreEntries = (loreRequest.data ?? []).filter((entry) =>
    (entry.characters ?? []).some((linked) => linked.id === id),
  );
  const allCharacters = allCharactersRequest.data ?? [];

  async function handleDeleteRelationship() {
    if (!relationshipToDelete) return;
    setDeletingRelationship(true);
    setRelationshipDeleteError(null);

    try {
      await api.deleteRelationship(relationshipToDelete.id);
      setRelationshipToDelete(null);
      relationshipsRequest.reload();
    } catch (error) {
      setRelationshipDeleteError(error);
    } finally {
      setDeletingRelationship(false);
    }
  }

  async function handleDeleteCharacter() {
    setDeletingCharacter(true);
    setCharacterDeleteError(null);

    try {
      await api.deleteCharacter(id);
      navigate('/characters');
    } catch (error) {
      setCharacterDeleteError(error);
    } finally {
      setDeletingCharacter(false);
    }
  }

  if (characterRequest.loading && !character) return <Loader label="Loading character…" />;

  if (characterRequest.error) {
    return (
      <div className="space-y-4">
        <ErrorMessage error={characterRequest.error} onRetry={characterRequest.reload} title="Could not open this character" />
        <Link to="/characters" className="btn-secondary">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to characters
        </Link>
      </div>
    );
  }

  if (!character) return null;

  const aliases = character.aliases ?? [];

  return (
    <div>
      <Link
        to="/characters"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted transition hover:text-crimson"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Character directory
      </Link>

      <header className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="paper-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar name={character.name} size="xl" />
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Character profile</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{character.name}</h1>

            {aliases.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {aliases.map((alias) => (
                  <span key={alias} className="chip">
                    {alias}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {character.description || 'No description has been written for this character yet.'}
            </p>

            {character.firstAppearance ? (
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-xs text-ink-soft">
                <BookIcon className="h-3.5 w-3.5" />
                First appearance: {character.firstAppearance}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link to={`/characters/${id}/edit`} className="btn-secondary">
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
            <button type="button" className="btn-danger" onClick={() => setDeleteCharacterOpen(true)}>
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="surface overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-line/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  Direct connections
                  <span className="ml-2 rounded-full bg-ink/5 px-2 py-0.5 align-middle text-xs font-semibold text-ink-soft">
                    {relationships.length}
                  </span>
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Relationships keep their stored direction. Each sentence reads from subject to object.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0 self-start sm:self-auto"
                onClick={() => setRelationshipFormOpen(true)}
                disabled={allCharacters.length < 2}
              >
                <PlusIcon className="h-4 w-4" />
                Add relationship
              </button>
            </div>

            {relationshipsRequest.loading && !relationshipsRequest.data ? (
              <Loader label="Loading connections…" className="py-10" />
            ) : null}

            {relationshipsRequest.error ? (
              <div className="p-5">
                <ErrorMessage
                  error={relationshipsRequest.error}
                  onRetry={relationshipsRequest.reload}
                  title="Could not load connections"
                />
              </div>
            ) : null}

            {relationshipsRequest.data && relationships.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={<GraphIcon className="h-5 w-5" />}
                  title="No direct connections yet"
                  description={
                    allCharacters.length < 2
                      ? 'Add another character first, then connect the two.'
                      : 'Link this character to someone else to start mapping their story.'
                  }
                  action={
                    allCharacters.length >= 2 ? (
                      <button type="button" className="btn-primary" onClick={() => setRelationshipFormOpen(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Add relationship
                      </button>
                    ) : (
                      <Link to="/characters/new" className="btn-primary">
                        Add another character
                      </Link>
                    )
                  }
                />
              </div>
            ) : null}

            {relationships.length > 0 ? (
              <ul className="divide-y divide-line/70">
                {relationships.map((relationship) => {
                  const type = RELATIONSHIP_TYPE_MAP[relationship.type] ?? {
                    label: relationship.type,
                    phrase: 'is connected to',
                    color: '#6f7789',
                  };
                  const isOutgoing = relationship.fromCharacter.id === character.id;

                  return (
                    <li key={relationship.id} className="group flex items-start gap-3 px-5 py-4 transition hover:bg-gold/5">
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${type.color}14`, color: type.color }}
                        title={isOutgoing ? 'Outgoing relationship' : 'Incoming relationship'}
                      >
                        {isOutgoing ? (
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowLeftIcon className="h-3.5 w-3.5" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed">
                          <Link
                            to={`/characters/${relationship.fromCharacter.id}`}
                            className="font-semibold link-underline"
                          >
                            {relationship.fromCharacter.name}
                          </Link>{' '}
                          <span className="text-ink-soft">{type.phrase}</span>{' '}
                          <Link
                            to={`/characters/${relationship.toCharacter.id}`}
                            className="font-semibold link-underline"
                          >
                            {relationship.toCharacter.name}
                          </Link>
                        </p>

                        {relationship.description ? (
                          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{relationship.description}</p>
                        ) : null}

                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]"
                            style={{ backgroundColor: `${type.color}14`, color: type.color }}
                          >
                            {type.label}
                          </span>
                          {relationship.sourceReference ? (
                            <span className="text-[0.68rem] text-ink-muted">{relationship.sourceReference}</span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setRelationshipDeleteError(null);
                          setRelationshipToDelete(relationship);
                        }}
                        className="rounded-full p-1.5 text-ink-muted/60 transition hover:bg-crimson/10 hover:text-crimson sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                        aria-label={`Delete relationship between ${relationship.fromCharacter.name} and ${relationship.toCharacter.name}`}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line/80 px-5 py-4">
              <h2 className="font-display text-xl font-semibold">Lore entries</h2>
              <Link
                to={`/lore/new?characterId=${character.id}`}
                className="btn-ghost text-xs"
                aria-label={`Add a lore entry about ${character.name}`}
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add
              </Link>
            </div>

            {loreRequest.loading && !loreRequest.data ? <Loader label="Loading lore…" className="py-10" /> : null}

            {loreRequest.error ? (
              <div className="p-4">
                <ErrorMessage error={loreRequest.error} onRetry={loreRequest.reload} title="Could not load lore" />
              </div>
            ) : null}

            {loreRequest.data && loreEntries.length === 0 ? (
              <div className="px-5 py-6 text-sm leading-relaxed text-ink-soft">
                No lore entries mention this character yet.{' '}
                <Link
                  to={`/lore/new?characterId=${character.id}`}
                  className="font-semibold text-crimson link-underline"
                >
                  Add one
                </Link>
                .
              </div>
            ) : null}

            {loreEntries.length > 0 ? (
              <ul className="divide-y divide-line/70">
                {loreEntries.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      to={`/lore?q=${encodeURIComponent(entry.title)}`}
                      className="block px-5 py-4 transition hover:bg-gold/5"
                    >
                      <CategoryBadge category={entry.category} />
                      <span className="mt-2 block text-sm font-semibold leading-snug">{entry.title}</span>
                      <span className="mt-1 block text-xs text-ink-muted">{entry.sourceTitle}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="surface p-5">
            <h2 className="font-display text-lg font-semibold">Record</h2>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Universe</dt>
                <dd className="font-medium text-ink-soft">{character.universe}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Added</dt>
                <dd className="font-medium text-ink-soft">{formatDate(character.createdAt) || '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Updated</dt>
                <dd className="font-medium text-ink-soft">{formatDate(character.updatedAt) || '—'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <RelationshipForm
        open={relationshipFormOpen}
        onClose={() => setRelationshipFormOpen(false)}
        character={character}
        characters={allCharacters}
        onSaved={relationshipsRequest.reload}
      />

      <ConfirmDialog
        open={Boolean(relationshipToDelete)}
        title="Delete this relationship?"
        description={
          relationshipToDelete
            ? `${relationshipToDelete.fromCharacter.name} → ${relationshipToDelete.toCharacter.name} will be removed from the archive.`
            : ''
        }
        busy={deletingRelationship}
        error={relationshipDeleteError}
        onCancel={() => {
          setRelationshipToDelete(null);
          setRelationshipDeleteError(null);
        }}
        onConfirm={handleDeleteRelationship}
      />

      <ConfirmDialog
        open={deleteCharacterOpen}
        title={`Delete ${character.name}?`}
        description="This removes the character permanently. It is blocked while any relationships or lore entries still reference them."
        busy={deletingCharacter}
        busyLabel="Deleting…"
        confirmLabel="Delete character"
        error={characterDeleteError}
        onCancel={() => {
          setDeleteCharacterOpen(false);
          setCharacterDeleteError(null);
        }}
        onConfirm={handleDeleteCharacter}
      />
    </div>
  );
}
