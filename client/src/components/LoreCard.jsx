import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge.jsx';
import { BookIcon, ExternalLinkIcon, PencilIcon, TrashIcon } from './Icons.jsx';
import { safeHttpUrl } from '../utils/format.js';

export default function LoreCard({ entry, onDelete }) {
  const characters = entry.characters ?? [];
  const sourceUrl = safeHttpUrl(entry.sourceUrl);

  return (
    <article className="surface flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <CategoryBadge category={entry.category} />
          <h2 className="mt-2 font-display text-xl font-semibold leading-snug">
            <Link
              to={`/lore/${entry.id}/edit`}
              className="link-underline transition hover:text-crimson"
            >
              {entry.title}
            </Link>
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Link
            to={`/lore/${entry.id}/edit`}
            className="rounded-full p-2 text-ink-muted transition hover:bg-ink/5 hover:text-ink"
            aria-label={`Edit ${entry.title}`}
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="rounded-full p-2 text-ink-muted transition hover:bg-crimson/10 hover:text-crimson"
            aria-label={`Delete ${entry.title}`}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="line-clamp-4 text-sm leading-relaxed text-ink-soft">{entry.content}</p>

      {characters.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {characters.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              className="chip transition hover:border-gold/70 hover:text-ink"
            >
              {character.name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-auto space-y-1.5 border-t border-line/70 pt-3 text-xs text-ink-muted">
        <p className="flex items-start gap-1.5">
          <BookIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-ink-soft underline decoration-line underline-offset-2 hover:text-crimson"
              >
                {entry.sourceTitle}
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            ) : (
              entry.sourceTitle
            )}
            {entry.episodeOrChapter ? <span className="text-ink-muted"> · {entry.episodeOrChapter}</span> : null}
          </span>
        </p>
      </div>
    </article>
  );
}
