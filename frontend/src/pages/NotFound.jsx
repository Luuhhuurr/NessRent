import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-xl)] flex flex-col items-center text-center">
      <span className="material-symbols-outlined text-[72px] text-on-surface-variant">explore_off</span>
      <h1 className="font-heading text-h1 text-on-surface mt-[var(--spacing-md)]">404</h1>
      <p className="text-body-lg text-on-surface-variant mt-2 max-w-md">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>

      <div className="flex flex-wrap justify-center gap-[var(--spacing-sm)] mt-[var(--spacing-lg)]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-[var(--radius-md)] font-semibold text-label-md hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Kembali ke beranda
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-outline text-on-surface rounded-[var(--radius-md)] font-semibold text-label-md hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          Jelajahi katalog
        </Link>
      </div>
    </div>
  );
}
