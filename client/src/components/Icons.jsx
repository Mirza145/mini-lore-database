const base = 'h-4 w-4';

export function SearchIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M4 12h16m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M20 12H4m0 0 6-6m-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BookIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="M12 6.5C10.2 5.3 7.8 4.8 4.5 5v13c3.3-.2 5.7.3 7.5 1.5 1.8-1.2 4.2-1.7 7.5-1.5V5c-3.3-.2-5.7.3-7.5 1.5Z" strokeLinejoin="round" />
      <path d="M12 6.5V20" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M13 5h6v6M19 5l-8 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 14v4.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H10" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19c.4-3.1 2.5-5 5.5-5s5.1 1.9 5.5 5" strokeLinecap="round" />
      <path d="M15.5 5.8a3.2 3.2 0 0 1 0 6M17 14.2c2 .5 3.2 2.1 3.5 4.3" strokeLinecap="round" />
    </svg>
  );
}

export function GraphIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <circle cx="12" cy="5.5" r="2.5" />
      <circle cx="5" cy="17.5" r="2.5" />
      <circle cx="19" cy="17.5" r="2.5" />
      <path d="m10.7 7.7-4.4 7.6M13.3 7.7l4.4 7.6M7.5 17.5h9" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="M4 7h16M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5.5M14 11v5.5" strokeLinecap="round" />
    </svg>
  );
}

export function PencilIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="m14.5 5.5 4 4M4.5 19.5l1-4.5L16 4.5a1.8 1.8 0 0 1 2.5 0l1 1a1.8 1.8 0 0 1 0 2.5L9 18.5l-4.5 1Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AlertIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="M12 4 2.8 20h18.4L12 4Z" strokeLinejoin="round" />
      <path d="M12 9.5v4.5M12 17.2v.1" strokeLinecap="round" />
    </svg>
  );
}

export function CompassIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkIcon({ className = base }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M12 3.5c.7 4.3 2.2 5.8 6.5 6.5-4.3.7-5.8 2.2-6.5 6.5-.7-4.3-2.2-5.8-6.5-6.5 4.3-.7 5.8-2.2 6.5-6.5Z" strokeLinejoin="round" />
      <path d="M18.5 15.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z" strokeLinejoin="round" />
    </svg>
  );
}
