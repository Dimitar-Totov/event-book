import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const logo = '/logo.png';

const footerLinks = {
  product: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Cookie Policy', path: '#' },
  ],
  support: [
    { label: 'Help Center', path: '#' },
    { label: 'Community', path: '#' },
    { label: 'Status', path: '#' },
  ],
};

const socialLinks = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Auth', path: '/auth' },
];

const NavLinkItem = ({
  label,
  path,
  onClick,
  className: extraClass = '',
}: {
  label: string;
  path: string;
  onClick?: () => void;
  className?: string;
}) => (
  <NavLink
    to={path}
    end={path === '/'}
    onClick={onClick}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors duration-200 hover:text-violet-600 ${isActive ? 'text-violet-600' : 'text-gray-500'} ${extraClass}`
    }
  >
    {label}
  </NavLink>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">

      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-200/40 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-200/30 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-violet-100/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 text-current no-underline" onClick={() => setMenuOpen(false)}>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl shadow-soft ring-1 ring-violet-200/60">
              <img src={logo} alt="EventBook Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Event Book</p>
              <p className="text-xs text-gray-400">Plan memorable gatherings</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 sm:flex sm:gap-8">
            {navItems.map((item) => (
              <NavLinkItem key={item.path} {...item} />
            ))}
          </nav>

          {/* Hamburger button — mobile only */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 text-gray-500 transition hover:border-violet-300 hover:text-violet-600 sm:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              /* X icon */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <nav className="border-t border-violet-100/60 bg-white/90 backdrop-blur-xl sm:hidden">
            <ul className="flex flex-col px-6 py-2">
              {navItems.map((item) => (
                <li key={item.path} className="border-b border-violet-50 last:border-0">
                  <NavLinkItem
                    {...item}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3"
                  />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-violet-100/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div className="flex flex-col gap-5">
              <Link to="/" className="flex items-center gap-3 text-current no-underline">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-violet-200/60">
                  <img src={logo} alt="EventBook Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Event Book</p>
                  <p className="text-xs text-gray-400">Plan memorable gatherings</p>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500">
                The all-in-one platform for creating, managing, and sharing events that bring people together.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 text-gray-400 transition hover:border-violet-300 hover:text-violet-500"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Product</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {footerLinks.product.map(({ label, path }) => (
                  <li key={label}>
                    <Link to={path} className="text-gray-500 transition hover:text-violet-600">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Support</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {footerLinks.support.map(({ label, path }) => (
                  <li key={label}>
                    <a href={path} className="text-gray-500 transition hover:text-violet-600">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Legal</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {footerLinks.legal.map(({ label, path }) => (
                  <li key={label}>
                    <a href={path} className="text-gray-500 transition hover:text-violet-600">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-violet-100/60 px-6 py-5 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-gray-400 sm:flex-row">
            <p>© {new Date().getFullYear()} Event Book. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <span className="mx-1 gradient-iris-text font-semibold">love</span> for event planners everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
