export function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-16 text-sm text-ink-soft ${className}`}>
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-crimson" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorMessage({ error, onRetry, title = 'Something went wrong', className = '' }) {
  const message = error?.message || 'Please try again.';
  const details = Array.isArray(error?.details) ? error.details : [];

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-crimson/20 bg-crimson/5 p-5 text-sm text-ink ${className}`}
    >
      <p className="font-semibold text-crimson">{title}</p>
      <p className="mt-1 text-ink-soft">{message}</p>
      {details.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div
      className={`surface flex flex-col items-center justify-center gap-3 px-6 py-14 text-center ${className}`}
    >
      {icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
          {icon}
        </span>
      ) : null}
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {description ? <p className="max-w-md text-sm leading-relaxed text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
