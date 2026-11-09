import { Link, useLocation } from 'react-router-dom';

export default function RegisterSuccess() {
  const location = useLocation();
  const message = location.state?.message || 'Pendaftaran berhasil! Silakan tunggu verifikasi akun.';
  const email = location.state?.email || '';

  return (
    <div className="w-full max-w-[520px] mx-auto flex flex-col gap-[var(--spacing-lg)] text-center">
      <div className="w-20 h-20 rounded-full bg-success-container/40 border border-success/25 grid place-items-center mx-auto">
        <span className="material-symbols-outlined text-success text-[48px]">check_circle</span>
      </div>

      <div>
        <h1 className="font-heading text-h1 text-on-surface">Pendaftaran berhasil</h1>
        <p className="text-body-md text-on-surface-variant mt-2">{message}</p>
      </div>

      <div className="panel p-[var(--spacing-md)] flex flex-col gap-[var(--spacing-sm)] text-left">
        <div className="flex items-center gap-2 text-body-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
          <span>
            Email: <strong>{email || '-'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-[20px]">pending</span>
          <span>
            Status:{' '}
            <span className="inline-flex px-2 py-0.5 rounded-full text-caption bg-warning-container text-on-warning-container">
              Menunggu verifikasi
            </span>
          </span>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-primary-container/40 border border-primary/25 p-[var(--spacing-md)] text-left">
        <h3 className="text-label-md text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">info</span>
          Informasi
        </h3>
        <ul className="flex flex-col gap-2">
          {[
            'Akun Anda akan diverifikasi oleh admin dalam 1x24 jam.',
            'Anda akan menerima notifikasi setelah akun diverifikasi.',
            'Hubungi admin jika belum diverifikasi setelah 24 jam.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                subdirectory_arrow_right
              </span>
              <span className="text-body-sm text-on-surface-variant">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/login"
        className="w-full py-3 bg-primary text-on-primary text-label-md rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        Masuk sekarang
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>

      <Link
        to="/"
        className="text-label-md text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5 justify-center"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Kembali ke beranda
      </Link>
    </div>
  );
}
