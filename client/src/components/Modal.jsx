import { useEffect } from 'react';
import { CloseIcon } from './Icons.jsx';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-ink/45 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`rise-in max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-3xl border border-line bg-parchment-light p-6 shadow-2xl sm:rounded-3xl`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-tight">{title}</h2>
            {description ? <p className="mt-1.5 text-sm text-ink-soft">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-muted transition hover:bg-ink/5 hover:text-ink"
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
