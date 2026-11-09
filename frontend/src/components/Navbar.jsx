import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUser, clearAuth } from '../lib/auth';

const navLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Katalog', to: '/products' },
  { label: 'Cara Kerja', to: '/#cara-kerja' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    clearAuth();
    navigate('/', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-[var(--spacing-md)] h-16 flex items-center justify-between gap-[var(--spacing-md)]">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-[var(--radius-md)] bg-primary grid place-items-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">handshake</span>
          </span>
          <span className="font-heading text-h3 font-extrabold text-on-surface">NesRent</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-[var(--radius-md)] text-body-md transition-colors ${
                  isActive ? 'text-on-surface bg-surface-container' : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-[var(--spacing-sm)]">
          {loggedIn ? (
            <>
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] hover:bg-surface-container transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container grid place-items-center text-caption font-bold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="text-label-md text-on-surface">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-[var(--radius-md)] text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-[var(--radius-md)] text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-[var(--radius-md)] bg-primary text-on-primary text-label-md font-semibold hover:bg-primary/90 transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden p-2 -mr-2 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-background px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-body-md text-on-surface-variant hover:text-on-surface"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 pt-3 border-t border-outline-variant flex flex-col gap-2">
            {loggedIn ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-body-md text-on-surface"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-left py-2.5 text-body-md text-on-surface-variant">
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2.5 text-body-md text-on-surface">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-body-md text-primary font-semibold"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
