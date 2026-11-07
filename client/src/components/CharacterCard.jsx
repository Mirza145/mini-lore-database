import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { ArrowRightIcon, BookIcon } from './Icons.jsx';

export default function CharacterCard({ character }) {
  const aliases = character.aliases ?? [];

  return (
    <Link
      to={`/characters/${character.id}`}
      className="surface group flex flex-col gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_18px_40px_-30px_rgba(22,35,63,0.55)]"
    >
      <div className="flex items-start gap-3">
        <Avatar name={character.name} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-lg font-semibold leading-snug transition group-hover:text-crimson">
            {character.name}
          </h2>
          {aliases.length > 0 ? (
            <p className="mt-0.5 truncate text-xs text-ink-muted">Also known as {aliases.join(' · ')}</p>
          ) : null}
        </div>
        <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-muted/60 transition group-hover:translate-x-0.5 group-hover:text-crimson" />
      </div>

      {character.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{character.description}</p>
      ) : null}

      {character.firstAppearance ? (
        <p className="mt-auto flex items-start gap-1.5 border-t border-line/70 pt-3 text-xs text-ink-muted">
          <BookIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{character.firstAppearance}</span>
        </p>
      ) : null}
    </Link>
  );
}
