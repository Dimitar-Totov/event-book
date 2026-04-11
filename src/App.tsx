import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const NavLinkItem = ({ label, path }: { label: string; path: string }) => (
  <NavLink
    to={path}
    end={path === '/'}
    className={({ isActive }) =>
      `text-slate-200 transition hover:text-white ${isActive ? 'font-semibold text-white' : 'opacity-80'}`
    }
  >
    {label}
  </NavLink>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 text-current no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-base font-bold text-white shadow-soft">
              EB
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Event Book</p>
              <p className="text-sm text-slate-400">Plan memorable gatherings</p>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm sm:gap-8">
            {navItems.map((item) => (
              <NavLinkItem key={item.path} {...item} />
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/95 px-6 py-8 text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Event Book. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href="#" className="transition hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <div className="flex items-center gap-3">
              <span className="sr-only">Twitter</span>
              <a href="#" className="transition hover:text-white">Twitter</a>
              <span className="sr-only">LinkedIn</span>
              <a href="#" className="transition hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
