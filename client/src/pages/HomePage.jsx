import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import api from '../services/api.js';
import { EmptyState, ErrorMessage, Loader } from '../components/Feedback.jsx';
import CategoryBadge from '../components/CategoryBadge.jsx';
import {
  ArrowRightIcon,
  BookIcon,
  GraphIcon,
  SparkIcon,
  UsersIcon,
} from '../components/Icons.jsx';
import { formatDate } from '../utils/format.js';

function CompassRose() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="82" stroke="currentColor" strokeOpacity=".14" />
      <circle cx="100" cy="100" r="64" stroke="currentColor" strokeOpacity=".1" strokeDasharray="2 6" />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeOpacity=".1" />
      {[0, 45, 90, 135].map((angle) => (
        <path
          key={angle}
          d="M100 14 110 100 100 112 90 100Z"
          fill="currentColor"
          fillOpacity=".07"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <path d="M100 24 108 96 100 104 92 96Z" fill="currentColor" fillOpacity=".28" />
      <path d="M100 176 92 104 100 96 108 104Z" fill="currentColor" fillOpacity=".12" />
      <circle cx="100" cy="100" r="4" fill="currentColor" fillOpacity=".55" />
    </svg>
  );
}

function StatCard({ to, icon, label, value }) {
  return (
    <Link
      to={to}
      className="surface group flex items-center gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-gold/60"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-[#8a641a]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-3xl font-semibold leading-none">{value}</span>
        <span className="mt-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {label}
        </span>
      </span>
      <ArrowRightIcon className="h-4 w-4 text-ink-muted/50 transition group-hover:translate-x-0.5 group-hover:text-crimson" />
    </Link>
  );
}

export default function HomePage() {
  const { data, loading, error, reload } = useApi(() => api.getStats(), []);

  if (loading && !data) return <Loader label="Opening the archive…" />;
  if (error) return <ErrorMessage error={error} onRetry={reload} title="Could not load the archive" />;

  const { universe, counts, recentLore } = data;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-parchment-light via-[#fbf5e8] to-parchment-deep p-8 shadow-[0_24px_60px_-45px_rgba(22,35,63,0.5)] sm:p-12 lg:p-14">
        <div className="paper-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-24 hidden h-80 w-80 text-ink lg:block" aria-hidden="true">
          <CompassRose />
        </div>

        <div className="relative max-w-2xl">
          <p className="eyebrow">A personal lore database</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">{universe.name}</h1>
          <p className="mt-1 font-display text-xl italic text-gold">The Grand Line Archive</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {universe.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Link to="/characters" className="btn-primary">
              Explore characters
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/lore" className="btn-secondary">
              Browse the lore
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="chip">{universe.mediaType}</span>
            <span className="chip">
              <SparkIcon className="h-3.5 w-3.5 text-gold" />
              Sourced notes
            </span>
            <span className="chip">One universe</span>
          </div>
        </div>
      </section>

      <section aria-label="Archive totals" className="grid gap-4 sm:grid-cols-3">
        <StatCard to="/characters" icon={<UsersIcon className="h-5 w-5" />} label="Characters" value={counts.characters} />
        <StatCard to="/graph" icon={<GraphIcon className="h-5 w-5" />} label="Relationships" value={counts.relationships} />
        <StatCard to="/lore" icon={<BookIcon className="h-5 w-5" />} label="Lore entries" value={counts.loreEntries} />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-line/80 px-5 py-4">
              <div>
                <h2 className="font-display text-xl font-semibold">Recently added lore</h2>
                <p className="mt-0.5 text-xs text-ink-muted">The latest entries in the notebook.</p>
              </div>
              <Link to="/lore" className="btn-ghost shrink-0 text-xs">
                View all
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentLore.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No lore entries yet"
                  description="Start with an important fact, an open question or a theory."
                  action={
                    <Link to="/lore/new" className="btn-primary">
                      Add the first entry
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-line/70">
                {recentLore.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      to={`/lore?q=${encodeURIComponent(entry.title)}`}
                      className="group flex items-start gap-3 px-5 py-4 transition hover:bg-gold/5"
                    >
                      <span className="mt-0.5 shrink-0">
                        <CategoryBadge category={entry.category} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-snug group-hover:text-crimson">
                          {entry.title}
                        </span>
                        <span className="mt-1 block truncate text-xs text-ink-muted">
                          {entry.sourceTitle}
                          {entry.episodeOrChapter ? ` · ${entry.episodeOrChapter}` : ''}
                          {entry.createdAt ? ` · ${formatDate(entry.createdAt)}` : ''}
                        </span>
                      </span>
                      <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-muted/40 transition group-hover:translate-x-0.5 group-hover:text-crimson" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="surface overflow-hidden">
            <div className="border-b border-line/80 px-5 py-4">
              <h2 className="font-display text-xl font-semibold">Navigate the archive</h2>
              <p className="mt-0.5 text-xs text-ink-muted">Three ways into the Grand Line.</p>
            </div>
            <ul className="divide-y divide-line/70">
              <li>
                <Link to="/characters" className="group flex items-start gap-3 px-5 py-4 transition hover:bg-gold/5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-ink-soft">
                    <UsersIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold group-hover:text-crimson">Characters</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                      Browse every pirate, marine and ally in the notebook.
                    </span>
                  </span>
                  <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-muted/40 transition group-hover:translate-x-0.5 group-hover:text-crimson" />
                </Link>
              </li>
              <li>
                <Link to="/lore" className="group flex items-start gap-3 px-5 py-4 transition hover:bg-gold/5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-ink-soft">
                    <BookIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold group-hover:text-crimson">Lore library</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                      Canon facts, theories, questions and disputed claims.
                    </span>
                  </span>
                  <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-muted/40 transition group-hover:translate-x-0.5 group-hover:text-crimson" />
                </Link>
              </li>
              <li>
                <Link to="/graph" className="group flex items-start gap-3 px-5 py-4 transition hover:bg-gold/5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-ink-soft">
                    <GraphIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold group-hover:text-crimson">Relationship graph</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                      See who is connected to whom, and how.
                    </span>
                  </span>
                  <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-muted/40 transition group-hover:translate-x-0.5 group-hover:text-crimson" />
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
