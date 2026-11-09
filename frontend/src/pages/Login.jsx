import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthIllustration from '../components/AuthIllustration';
import authService from '../services/authService';
import { clearAuth } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    location.state?.reason === 'blacklist' ? 'Akun Anda telah diblokir. Hubungi admin.' : null
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = 'Email wajib diisi';
    if (!formData.password) errors.password = 'Password wajib diisi';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      const user = response?.data?.user;

      if (!user) {
        setError('Respons login tidak valid. Silakan coba lagi.');
        return;
      }

      if (user.status === 'pending') {
        clearAuth();
        setError('Akun Anda belum diverifikasi. Silakan tunggu konfirmasi dari admin.');
        return;
      }

      if (user.status === 'blacklist') {
        clearAuth();
        setError('Akun Anda telah diblokir. Hubungi admin.');
        return;
      }

      const fallback = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectTo || fallback, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full h-11 px-3 bg-surface-container rounded-[var(--radius-md)] border text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors ${
      fieldErrors[fieldName] ? 'border-error' : 'border-outline-variant'
    }`;

  return (
    <>
      <AuthIllustration
        title="Sewa barang dari mahasiswa lain."
        subtitle="NesRent menghubungkan peminjam dan pemilik barang di sekitar kampus UNNES."
        points={['Akun terverifikasi admin', 'Harga mahasiswa, serah terima di campus', 'Riwayat pesanan tersimpan rapi']}
      />

      <div className="w-full lg:w-1/2 flex justify-center items-center px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="w-full max-w-[400px]">
          <div className="mb-[var(--spacing-lg)]">
            <h1 className="font-heading text-h2 text-on-surface">Masuk ke NesRent</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              Masuk untuk mulai menyewa barang.
            </p>
          </div>

          {error && (
            <div className="bg-error-container/40 border border-error/30 rounded-[var(--radius-md)] p-3 mb-[var(--spacing-md)] flex items-start gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">error</span>
              <p className="text-body-sm text-on-error-container">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-md)]">
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass('email')}
                placeholder="nama@student.unnes.ac.id"
                autoComplete="email"
                disabled={isLoading}
              />
              {fieldErrors.email && <p className="text-caption text-error">{fieldErrors.email}</p>}
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass('password')} pr-11`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {fieldErrors.password && <p className="text-caption text-error">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-[var(--radius-md)] bg-primary text-on-primary text-label-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Memasuki akun…
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className="text-body-sm text-on-surface-variant mt-[var(--spacing-lg)] text-center">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
