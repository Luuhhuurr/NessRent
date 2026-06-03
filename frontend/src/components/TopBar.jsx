import { Link } from 'react-router-dom';

export default function TopBar({ user }) {
  return (
    <header className="flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-xs)] w-full sticky top-0 right-0 z-40 bg-surface/80 backdrop-blur-md shadow-sm">
      {/* Mobile Logo */}
      <div className="md:hidden">
        <Link to="/" className="font-heading text-h3 font-black text-primary">
          NesRent
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-[var(--spacing-md)]">
        <div className="relative w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all rounded-[var(--radius-md)]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-[var(--radius-md)] text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Cari barang sewaan..."
            type="text"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[var(--spacing-md)]">
        {/* Notifications */}
        <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* User Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">account_circle</span>
          <div className="hidden lg:block">
            <p className="text-label-md text-on-surface leading-tight">{user?.name || 'User'}</p>
            <p className="text-caption text-on-surface-variant leading-tight">Mahasiswa UNNES</p>
          </div>
        </Link>
      </div>
    </header>
  );
}