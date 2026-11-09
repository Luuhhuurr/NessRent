import { Link } from 'react-router-dom';

export default function AuthHeader({ showBackLink = true }) {
  return (
    <header className="w-full border-b border-outline-variant bg-background">
      <div className="flex justify-between items-center w-full px-[var(--spacing-md)] py-3 max-w-[1280px] mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-[var(--radius-md)] bg-primary grid place-items-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">handshake</span>
          </span>
          <span className="font-heading text-h3 font-extrabold text-on-surface">NesRent</span>
        </Link>
        {showBackLink && (
          <Link
            to="/"
            className="flex items-center gap-1.5 text-on-surface-variant text-label-md hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke beranda
          </Link>
        )}
      </div>
    </header>
  );
}
