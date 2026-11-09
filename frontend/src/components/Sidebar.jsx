import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth } from '../lib/auth';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'category', label: 'Katalog', href: '/products' },
  { icon: 'receipt', label: 'Transaksi', href: '/history' },
  { icon: 'location_on', label: 'Lokasi Penyerahan', href: '/dashboard/penyerahan' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href) =>
    href === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(href);

  const handleLogout = () => {
    clearAuth();
    navigate('/', { replace: true });
  };

  return (
    <aside className="hidden md:flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)] w-64 border-r border-outline-variant bg-surface-container-lowest fixed left-0 top-0 h-screen z-50">
      <Link to="/" className="flex items-center gap-2.5 mb-[var(--spacing-lg)] px-2">
        <span className="w-8 h-8 rounded-[var(--radius-md)] bg-primary grid place-items-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]">handshake</span>
        </span>
        <span>
          <span className="block font-heading text-h3 font-extrabold text-on-surface leading-none">NesRent</span>
          <span className="block text-caption text-on-surface-variant mt-1">Student Marketplace</span>
        </span>
      </Link>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-colors ${
              isActive(item.href)
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        <span className="text-label-md">Keluar</span>
      </button>
    </aside>
  );
}
