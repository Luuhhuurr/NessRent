import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopBar({ user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const displayName = user?.name || user?.email?.split('@')[0] || 'Pengguna';
  const displayRole = user?.faculty || (user?.role === 'admin' ? 'Administrator' : 'Mahasiswa');

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/products?q=${encodeURIComponent(term)}` : '/products');
  };

  return (
    <header className="flex items-center justify-between px-[var(--spacing-md)] py-3 w-full sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-outline-variant">
      <div className="md:hidden">
        <Link to="/" className="font-heading text-h3 font-extrabold text-on-surface">
          NesRent
        </Link>
      </div>

      <div className="hidden md:flex flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-colors"
            placeholder="Cari barang sewaan..."
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari barang"
          />
        </form>
      </div>

      <div className="flex items-center gap-[var(--spacing-md)]">
        <button
          className="text-on-surface-variant hover:text-on-surface transition-colors relative"
          aria-label="Notifikasi"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container grid place-items-center text-caption font-bold">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div className="hidden lg:block">
            <p className="text-label-md text-on-surface leading-tight">{displayName}</p>
            <p className="text-caption text-on-surface-variant leading-tight">{displayRole}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
