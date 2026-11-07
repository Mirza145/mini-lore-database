import { CATEGORY_MAP } from '../constants.js';

export default function CategoryBadge({ category, className = '' }) {
  const meta = CATEGORY_MAP[category];

  if (!meta) {
    return (
      <span className={`inline-flex items-center rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink-soft ${className}`}>
        {category}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
