import { Link } from 'react-router-dom';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard', active: true },
  { icon: 'category', label: 'Barang', href: '/products' },
  { icon: 'receipt', label: 'Transaksi', href: '/history' },
  { icon: 'account_circle', label: 'Profil', href: '/profile' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] w-64 border-r border-outline-variant bg-surface shadow-sm fixed left-0 top-0 h-screen z-50">
      {/* Brand */}
      <div className="mb-[var(--spacing-lg)]">
        <Link to="/" className="block">
          <h1 className="font-heading text-h3 font-extrabold text-primary">NesRent</h1>
          <p className="text-caption text-on-surface-variant">Student Marketplace</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-[var(--spacing-xs)]">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 ${item.active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'} px-4 py-3 rounded-[var(--radius-lg)] ${!item.active ? 'hover:bg-surface-container-high' : ''} transition-all duration-200`}
          >
            <span className={`material-symbols-outlined ${item.active ? 'fill-1' : ''}`}>{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <Link
          to="/logout"
          className="flex items-center gap-3 text-error px-4 py-3 hover:bg-error-container rounded-[var(--radius-lg)] transition-all duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md">Keluar</span>
        </Link>
      </div>
    </aside>
  );
}