import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { ErrorMessage, Loader } from '../components/Feedback.jsx';
import { ArrowLeftIcon } from '../components/Icons.jsx';

const emptyForm = {
  name: '',
  aliases: '',
  description: '',
  firstAppearance: '',
};

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-crimson">{message}</p>;
}

export default function CharacterFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const characterRequest = useApi(
    () => (isEdit ? api.getCharacter(id) : Promise.resolve(null)),
    [id, isEdit],
  );

  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestError, setRequestError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadedCharacter = characterRequest.data?.id === id ? characterRequest.data : null;

  useEffect(() => {
    if (!loadedCharacter) return;
    setForm({
      name: loadedCharacter.name ?? '',
      aliases: (loadedCharacter.aliases ?? []).join(', '),
      description: loadedCharacter.description ?? '',
      firstAppearance: loadedCharacter.firstAppearance ?? '',
    });
  }, [loadedCharacter]);

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = {};
    if (!form.name.trim()) errors.name = 'A character name is required.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      aliases: form.aliases
        .split(',')
        .map((alias) => alias.trim())
        .filter(Boolean),
      description: form.description.trim(),
      firstAppearance: form.firstAppearance.trim(),
    };

    setSaving(true);
    setRequestError(null);

    try {
      const saved = isEdit
        ? await api.updateCharacter(id, payload)
        : await api.createCharacter(payload);
      navigate(`/characters/${saved.id}`);
    } catch (error) {
      setRequestError(error);
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && characterRequest.loading && !loadedCharacter) {
    return <Loader label="Loading character…" />;
  }

  if (isEdit && characterRequest.error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          error={characterRequest.error}
          onRetry={characterRequest.reload}
          title="Could not load this character"
        />
        <Link to="/characters" className="btn-secondary">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to characters
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={isEdit ? `/characters/${id}` : '/characters'}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted transition hover:text-crimson"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {isEdit ? 'Back to profile' : 'Character directory'}
      </Link>

      <PageHeader
        eyebrow={isEdit ? 'Edit record' : 'New record'}
        title={isEdit ? 'Edit character' : 'Add a character'}
        description={
          isEdit
            ? 'Update the details stored in the archive. Related relationships and lore entries are unchanged.'
            : 'Add someone to the notebook. Only the name is required; the rest can be filled in later.'
        }
      />

      <form className="surface space-y-5 p-6 sm:p-7" onSubmit={handleSubmit} noValidate>
        {requestError ? (
          <ErrorMessage error={requestError} title="Could not save the character" />
        ) : null}

        <div>
          <label className="label" htmlFor="character-name">
            Name <span className="text-crimson">*</span>
          </label>
          <input
            id="character-name"
            className="input"
            value={form.name}
            onChange={update('name')}
            maxLength={80}
            autoFocus
            placeholder="e.g. Monkey D. Luffy"
            aria-invalid={Boolean(fieldErrors.name)}
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div>
          <label className="label" htmlFor="character-aliases">
            Aliases
          </label>
          <input
            id="character-aliases"
            className="input"
            value={form.aliases}
            onChange={update('aliases')}
            placeholder="Comma separated, e.g. Straw Hat Luffy, Mugiwara"
          />
          <p className="mt-1 text-xs text-ink-muted">
            Separate multiple aliases with commas. Aliases are searchable.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="character-description">
            Description
          </label>
          <textarea
            id="character-description"
            className="input min-h-32 resize-y"
            value={form.description}
            onChange={update('description')}
            maxLength={1000}
            placeholder="A short description in your own words."
          />
          <p className="mt-1 text-right text-xs text-ink-muted">{form.description.length}/1000</p>
        </div>

        <div>
          <label className="label" htmlFor="character-appearance">
            First appearance
          </label>
          <input
            id="character-appearance"
            className="input"
            value={form.firstAppearance}
            onChange={update('firstAppearance')}
            maxLength={120}
            placeholder="e.g. Manga Chapter 1 — Romance Dawn"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-line/70 pt-5">
          <Link to={isEdit ? `/characters/${id}` : '/characters'} className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add character'}
          </button>
        </div>
      </form>
    </div>
  );
}
