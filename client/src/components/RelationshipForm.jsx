import { useEffect, useMemo, useState } from 'react';
import { RELATIONSHIP_TYPES, RELATIONSHIP_TYPE_MAP } from '../constants.js';
import api from '../services/api.js';
import Modal from './Modal.jsx';
import { ErrorMessage } from './Feedback.jsx';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons.jsx';

const emptyForm = {
  otherId: '',
  direction: 'out',
  type: 'ally',
  description: '',
  sourceReference: '',
};

export default function RelationshipForm({ open, onClose, character, characters, onSaved }) {
  const others = useMemo(
    () => characters.filter((candidate) => candidate.id !== character.id),
    [characters, character.id],
  );

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptyForm, otherId: others[0]?.id ?? '' });
    setSaving(false);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const update = (field) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const other = others.find((candidate) => candidate.id === form.otherId);
  const typeMeta = RELATIONSHIP_TYPE_MAP[form.type] ?? RELATIONSHIP_TYPES[0];
  const preview = other
    ? form.direction === 'out'
      ? `${character.name} ${typeMeta.phrase} ${other.name}`
      : `${other.name} ${typeMeta.phrase} ${character.name}`
    : null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.otherId) {
      setError(new Error('Choose a character to connect to.'));
      return;
    }

    const fromCharacter = form.direction === 'out' ? character.id : form.otherId;
    const toCharacter = form.direction === 'out' ? form.otherId : character.id;

    setSaving(true);
    setError(null);

    try {
      await api.createRelationship({
        fromCharacter,
        toCharacter,
        type: form.type,
        description: form.description,
        sourceReference: form.sourceReference,
      });
      onSaved?.();
      onClose();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      title="Add a relationship"
      description={`Create a directed link between ${character.name} and another character.`}
      maxWidth="max-w-xl"
    >
      {others.length === 0 ? (
        <p className="rounded-xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900">
          There are no other characters yet. Add a second character before creating a relationship.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? <ErrorMessage error={error} title="Could not save the relationship" /> : null}

          <div>
            <label className="label" htmlFor="relationship-other">
              Other character
            </label>
            <select
              id="relationship-other"
              className="input"
              value={form.otherId}
              onChange={update('otherId')}
            >
              {others.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="label">Which way does it point?</span>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => update('direction')('out')}
                className={`flex items-start gap-2 rounded-xl border p-3 text-left text-xs transition ${
                  form.direction === 'out'
                    ? 'border-gold bg-gold/10 text-ink'
                    : 'border-line bg-white/60 text-ink-soft hover:border-gold/50'
                }`}
              >
                <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-semibold text-ink">This character → other</span>
                  {character.name} is the subject of the relationship.
                </span>
              </button>
              <button
                type="button"
                onClick={() => update('direction')('in')}
                className={`flex items-start gap-2 rounded-xl border p-3 text-left text-xs transition ${
                  form.direction === 'in'
                    ? 'border-gold bg-gold/10 text-ink'
                    : 'border-line bg-white/60 text-ink-soft hover:border-gold/50'
                }`}
              >
                <ArrowLeftIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-semibold text-ink">Other → this character</span>
                  The other character is the subject.
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="relationship-type">
              Relationship type
            </label>
            <select
              id="relationship-type"
              className="input"
              value={form.type}
              onChange={update('type')}
            >
              {RELATIONSHIP_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {preview ? (
            <p className="rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-3 text-sm text-ink">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Preview
              </span>
              <span className="mt-1 block font-medium">{preview}</span>
            </p>
          ) : null}

          <div>
            <label className="label" htmlFor="relationship-description">
              Description <span className="font-normal tracking-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id="relationship-description"
              className="input min-h-20 resize-y"
              value={form.description}
              onChange={update('description')}
              maxLength={500}
              placeholder="How do these characters know each other?"
            />
          </div>

          <div>
            <label className="label" htmlFor="relationship-source">
              Source <span className="font-normal tracking-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="relationship-source"
              className="input"
              value={form.sourceReference}
              onChange={update('sourceReference')}
              maxLength={300}
              placeholder="e.g. Manga Chapter 6"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add relationship'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
