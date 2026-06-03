import { Link } from 'react-router-dom';

export default function AuthHeader({ showBackLink = true }) {
  return (
    <header className="w-full bg-surface shadow-sm z-50">
      <div className="flex justify-between items-center w-full px-[var(--spacing-md)] py-[var(--spacing-xs)] max-w-[1280px] mx-auto">
        <Link
          to="/"
          className="text-h3 font-heading font-black text-primary tracking-tight"
        >
          NesRent
        </Link>
        {showBackLink && (
          <Link
            to="/"
            className="flex items-center gap-[var(--spacing-xs)] text-secondary text-label-md hover:text-primary-container transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-body-md">arrow_back</span>
            Back to home
          </Link>
        )}
      </div>
    </header>
  );
}