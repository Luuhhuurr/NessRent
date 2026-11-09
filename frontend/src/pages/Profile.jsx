import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { getUser } from '../lib/auth';
import { formatDate, userStatusLabel, userStatusTone } from '../lib/format';

const fields = [
  { key: 'name', label: 'Nama lengkap' },
  { key: 'nim', label: 'NIM' },
  { key: 'email', label: 'Email' },
  { key: 'faculty', label: 'Fakultas' },
  { key: 'phone', label: 'Nomor HP' },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authService.getProfile();
        setProfile(response?.data ?? getUser());
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat profil.');
        setProfile(getUser());
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="panel p-[var(--spacing-lg)] animate-pulse h-64" />
    );
  }

  return (
    <>
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Profil saya</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Data akun yang terdaftar di NesRent.
        </p>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
        <section className="lg:col-span-4 panel p-[var(--spacing-lg)] flex flex-col items-center text-center">
          <span className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container grid place-items-center font-heading text-h3">
            {(profile?.name || '?').charAt(0).toUpperCase()}
          </span>
          <h2 className="font-heading text-h3 text-on-surface mt-[var(--spacing-md)]">
            {profile?.name || '-'}
          </h2>
          <p className="text-body-sm text-on-surface-variant">{profile?.email || '-'}</p>
          <span
            className={`mt-[var(--spacing-sm)] inline-flex px-3 py-1 rounded-full text-caption ${userStatusTone(profile?.status)}`}
          >
            {userStatusLabel(profile?.status)}
          </span>

          <div className="w-full mt-[var(--spacing-lg)] pt-[var(--spacing-md)] border-t border-outline-variant flex flex-col gap-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Peran</span>
              <span className="text-on-surface capitalize">{profile?.role || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Bergabung</span>
              <span className="text-on-surface">{formatDate(profile?.created_at)}</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-8 panel p-[var(--spacing-lg)]">
          <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">Informasi akun</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <span className="text-caption text-on-surface-variant">{field.label}</span>
                <span className="text-body-sm text-on-surface">
                  {profile?.[field.key] || '-'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-[var(--spacing-lg)] pt-[var(--spacing-md)] border-t border-outline-variant flex flex-wrap gap-[var(--spacing-sm)]">
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-outline text-on-surface text-label-md hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Riwayat transaksi
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-outline text-on-surface text-label-md hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Jelajahi katalog
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
