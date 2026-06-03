import { Link, useLocation } from 'react-router-dom';

const successImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZF2J1cQJPf5o8g5ZwC5HbuQpw6TW3g9nyWk6OYkSdUna1FbUpDukVJ1D552HtFNtSyDB4mnDvDXX1cftIzqBhTg6tDh0Ro7JLvlp6YO-E3XMEO9iglKzHh5_iCSPw_4SBQq50fnrN3DsZTh3XmVTqPSuTwDH5-kdZioCi2UOZFrj-iBLWvIjqmxM6XZNgu36EPYSFPo2eZuXlfe_rMUUPPz0qd6hDutpud_CXtcAbjY-C7KukODqa-BMquziMiomc6xjDgVyIVgx';

export default function RegisterSuccess() {
  const location = useLocation();
  const message = location.state?.message || 'Pendaftaran berhasil! Silakan tunggu verifikasi akun.';
  const email = location.state?.email || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-[var(--spacing-md)] bg-surface">
      <div className="w-full max-w-[520px] flex flex-col items-center gap-[var(--spacing-lg)]">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary text-[48px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-heading text-h1 text-on-background mb-[var(--spacing-xs)]">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {message}
          </p>
        </div>

        {/* Info Card */}
        <div className="w-full bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] flex flex-col gap-[var(--spacing-sm)]">
          <div className="flex items-center gap-[var(--spacing-sm)] text-body-md text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
            <span>Email: <strong>{email || 'your email'}</strong></span>
          </div>
          <div className="flex items-center gap-[var(--spacing-sm)] text-body-md text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">pending</span>
            <span>Status: <span className="inline-flex items-center px-2 py-0.5 rounded-full text-caption bg-warning-container/20 text-warning font-semibold">Menunggu Verifikasi</span></span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-primary-container/10 border border-primary-container/30 rounded-[var(--radius-xl)] p-[var(--spacing-md)] w-full">
          <h3 className="text-label-md text-on-primary-container font-semibold mb-[var(--spacing-xs)] flex items-center gap-[var(--spacing-xs)]">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            Informasi
          </h3>
          <ul className="text-body-sm text-secondary space-y-[var(--spacing-xs)]">
            <li className="flex items-start gap-[var(--spacing-xs)]">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">subdirectory_arrow_right</span>
              <span>Akun Anda akan diverifikasi oleh admin dalam 1x24 jam</span>
            </li>
            <li className="flex items-start gap-[var(--spacing-xs)]">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">subdirectory_arrow_right</span>
              <span>Anda akan menerima notifikasi setelah akun diverifikasi</span>
            </li>
            <li className="flex items-start gap-[var(--spacing-xs)]">
              <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">subdirectory_arrow_right</span>
              <span>Hubungi admin jika belum diverifikasi setelah 24 jam</span>
            </li>
          </ul>
        </div>

        {/* Action */}
        <Link
          to="/login"
          className="w-full h-14 bg-primary-container text-on-primary-container text-label-md rounded-[var(--radius-lg)] hover:bg-primary-fixed transition-all hover:shadow-[0_8px_24px_0_rgba(31,41,55,0.1)] active:scale-[0.98] flex items-center justify-center gap-[var(--spacing-xs)]"
        >
          Login sekarang
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>

        {/* Back to Home */}
        <Link
          to="/"
          className="text-label-md text-secondary hover:text-primary transition-colors flex items-center gap-[var(--spacing-xs)]"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}