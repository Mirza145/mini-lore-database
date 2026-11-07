import { SearchIcon, CloseIcon } from './Icons.jsx';

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="input pl-10 pr-10"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition hover:bg-ink/5 hover:text-ink"
          aria-label="Clear search"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
