import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useProgress } from '../lib/store';
import { levelFor } from '../lib/game';
import { Toasts } from './Toasts';
import { Logo } from './Logo';

const NAV = [
  { to: '/', label: 'Learn', icon: '🗺️' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/badges', label: 'Badges', icon: '🏅' },
  { to: '/exam', label: 'Final Exam', icon: '🎓' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Layout() {
  const { progress, updateSettings } = useProgress();
  const lvl = levelFor(progress.xp);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [loc.pathname]);

  const t = progress.settings.theme;
  const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight" aria-label="LearnPlay AI home">
            <Logo className="h-8 w-8" />
            <span className="hidden text-lg sm:inline">
              LearnPlay <span className="text-brand-600 dark:text-brand-400">AI</span>
            </span>
          </Link>

          <nav className="ml-4 hidden gap-1 md:flex">
            {NAV.slice(0, 4).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-sm font-bold text-orange-600 dark:bg-orange-950/50 dark:text-orange-400" title="Daily streak">
              🔥 {progress.streak}
            </div>
            <Link to="/progress" className="group flex items-center gap-2" title={`${progress.xp} XP — ${lvl.title}`}>
              <span className="text-xl">{lvl.emoji}</span>
              <div className="hidden w-28 sm:block">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Lv {lvl.index}</span>
                  <span>{progress.xp} XP</span>
                </div>
                <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-700" style={{ width: `${lvl.pct * 100}%` }} />
                </div>
              </div>
            </Link>
            <button
              className="hidden rounded-lg p-2 text-lg hover:bg-slate-100 sm:block dark:hover:bg-slate-800"
              onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button className="rounded-lg p-2 text-xl hover:bg-slate-100 md:hidden dark:hover:bg-slate-800" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              ☰
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-slate-800">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>{n.icon}</span> {n.label}
              </NavLink>
            ))}
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}>
              <span>{isDark ? '☀️' : '🌙'}</span> {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="no-print border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        <p>
          LearnPlay AI · Learn AI from A to Z by playing ·{' '}
          <Link to="/settings" className="underline hover:text-brand-600">
            Settings
          </Link>
        </p>
        <p className="mt-1 text-xs">Your progress is saved privately in this browser.</p>
      </footer>
      <Toasts />
    </div>
  );
}
