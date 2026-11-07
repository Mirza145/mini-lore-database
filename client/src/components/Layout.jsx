import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HatIcon from './HatIcon.jsx';

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/characters', label: 'Characters' },
  { to: '/lore', label: 'Lore' },
  { to: '/graph', label: 'Graph' },
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <header className="sticky top-0 z-40 bg-ink text-parchment shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:pb-3 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-parchment/10 ring-1 ring-parchment/20 transition group-hover:ring-gold/70">
              <HatIcon className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg leading-tight tracking-tight sm:text-xl">
                Grand Line Archive
              </span>
              <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-parchment/55">
                One Piece · Personal lore database
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto pb-1 text-sm sm:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'whitespace-nowrap rounded-full px-3.5 py-1.5 font-medium transition',
                    isActive
                      ? 'bg-parchment/12 text-gold-soft ring-1 ring-gold/30'
                      : 'text-parchment/70 hover:bg-parchment/8 hover:text-parchment',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-line/80 bg-parchment-light/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>The Grand Line Archive — a personal notebook for one fictional universe.</p>
          <p>
            One Piece and its characters belong to Eiichiro Oda. Notes here are written in our own
            words.
          </p>
        </div>
      </footer>
    </div>
  );
}
