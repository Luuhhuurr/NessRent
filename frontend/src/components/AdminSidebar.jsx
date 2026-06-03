import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/admin' },
  { icon: 'inventory_2', label: 'Manajemen Barang', href: '/admin/products' },
  { icon: 'how_to_reg', label: 'Verifikasi User', href: '/admin/verify-user' },
  { icon: 'receipt_long', label: 'Transaksi', href: '/admin/transactions' },
  { icon: 'person_off', label: 'Blacklist', href: '/admin/blacklist-user' },
];

const bottomNavItems = [
  { icon: 'settings', label: 'Settings', href: '/admin/settings' },
  { icon: 'logout', label: 'Logout', href: '/logout', isDanger: true },
];

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-surface-container-lowest h-screen w-72 flex-col fixed left-0 top-0 shadow-sm z-50 flex py-[var(--spacing-md)] gap-[var(--spacing-md)]">
      {/* Brand */}
      <div className="px-6 pb-[var(--spacing-md)]">
        <h1 className="font-heading text-h3 font-extrabold text-primary">NesRent Admin</h1>
        <p className="text-caption text-on-surface-variant mt-[var(--spacing-xs)]">
          Rental Management Platform
        </p>
      </div>

      {/* Quick Add Button */}
      <div className="px-6 py-[var(--spacing-md)]">
        <Link
          to="/admin/add-product"
          className="w-full bg-primary-container text-on-primary-container text-label-md py-3 px-4 rounded-[var(--radius-xl)] flex items-center justify-center gap-2 hover:bg-inverse-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          + Tambah Barang
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-[var(--spacing-xs)] px-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`px-4 py-3 mx-2 rounded-[var(--radius-lg)] transition-all duration-200 flex items-center gap-3 ${
              isActive(item.href)
                ? 'text-on-primary-container bg-primary-container font-bold scale-95'
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="px-2 pt-4 border-t border-surface-container-highest mt-auto pb-[var(--spacing-md)]">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`px-4 py-3 mx-2 rounded-[var(--radius-lg)] transition-all duration-200 flex items-center gap-3 ${
              item.isDanger
                ? 'text-error hover:bg-error-container'
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}