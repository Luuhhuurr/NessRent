import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-sm font-body text-body-md tracking-tight">
      <div className="flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-xs)] max-w-[1280px] mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-h3 font-heading font-extrabold text-primary hover:opacity-80 transition-all duration-300"
        >
          NesRent
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-[var(--spacing-md)]">
          <Link
            to="/"
            className="text-primary font-bold border-b-2 border-primary pb-1 hover:opacity-80 transition-all duration-300"
          >
            Home
          </Link>
          <a
            href="#"
            className="text-secondary font-medium hover:text-primary transition-colors hover:opacity-80"
          >
            Barang
          </a>
          <a
            href="#"
            className="text-secondary font-medium hover:text-primary transition-colors hover:opacity-80"
          >
            Cara Kerja
          </a>
          <a
            href="#"
            className="text-secondary font-medium hover:text-primary transition-colors hover:opacity-80"
          >
            Tentang
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <Link
            to="/login"
            className="text-label-md font-[600] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-on-surface text-on-surface hover:bg-surface-container-low transition-colors duration-300 inline-block"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-label-md font-[600] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-lg)] bg-primary-container text-on-primary-container hover:opacity-80 transition-all duration-300 inline-block"
          >
            Mulai Sewa
          </Link>
        </div>
      </div>
    </nav>
  );
}