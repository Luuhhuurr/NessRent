import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthIllustration from '../components/AuthIllustration';
import Checkbox from '../components/Checkbox';
import authService from '../services/authService';

const faculties = [
  'FIP',
  'FIB',
  'FIS',
  'FIK',
  'FTM',
  'FT',
  'FKIP',
  'FPP',
  'FMIPA',
  'FPPK',
  'OTHER',
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nim: '',
    faculty: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!formData.nim.trim()) {
      errors.nim = 'NIM wajib diisi';
    } else if (!/^\d{10}$/.test(formData.nim)) {
      errors.nim = 'NIM harus 10 digit angka';
    }

    if (!formData.password) {
      errors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      errors.password = 'Password minimal 8 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    if (!formData.agree) {
      errors.agree = 'Anda harus menyetujui syarat penyewaan';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        nim: formData.nim,
        faculty: formData.faculty,
        phone: formData.phone,
        password: formData.password,
      });

      if (response?.success) {
        navigate('/register-success', {
          state: {
            message: response.message || 'Pendaftaran berhasil! Silakan tunggu verifikasi akun.',
            email: formData.email,
          },
        });
      }
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
        title="Gabung dan mulai sewa dengan mudah."
        subtitle="Satu akun untuk menyewa sekaligus menitipkan barang yang jarang dipakai."
        points={['Verifikasi cepat oleh admin', 'Katalog barang dari fellow mahasiswa', 'Riwayat transaksi transparan']}
      />

      <div className="w-full lg:w-1/2 flex justify-center items-center px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="w-full max-w-[440px]">
          <div className="mb-[var(--spacing-lg)]">
            <h1 className="font-heading text-h2 text-on-surface">Daftar akun NesRent</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              Gratis, dan butuh waktu kurang dari satu menit.
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
              <label className="text-label-md text-on-surface" htmlFor="fullName">
                Nama lengkap
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass('fullName')}
                placeholder="Nama sesuai KTP"
                type="text"
                disabled={isLoading}
              />
              {fieldErrors.fullName && <p className="text-caption text-error">{fieldErrors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                  placeholder="nama@student.unnes.ac.id"
                  type="email"
                  disabled={isLoading}
                />
                {fieldErrors.email && <p className="text-caption text-error">{fieldErrors.email}</p>}
              </div>

              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface" htmlFor="nim">
                  NIM
                </label>
                <input
                  id="nim"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  className={inputClass('nim')}
                  placeholder="10 digit NIM"
                  type="text"
                  maxLength={10}
                  disabled={isLoading}
                />
                {fieldErrors.nim && <p className="text-caption text-error">{fieldErrors.nim}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface" htmlFor="faculty">
                  Fakultas
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className={`${inputClass('faculty')} cursor-pointer`}
                  disabled={isLoading}
                >
                  <option value="">Pilih fakultas</option>
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface" htmlFor="phone">
                  Nomor HP
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass('phone')}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass('password')} pr-11`}
                    placeholder="Minimal 8 karakter"
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {fieldErrors.password && <p className="text-caption text-error">{fieldErrors.password}</p>}
              </div>

              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface" htmlFor="confirmPassword">
                  Konfirmasi password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass('confirmPassword')} pr-11`}
                    placeholder="Ulangi password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-caption text-error">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <Checkbox
                name="agree"
                label="Saya setuju dengan syarat penyewaan NesRent"
                checked={formData.agree}
                onChange={handleChange}
                disabled={isLoading}
              />
              {fieldErrors.agree && <p className="text-caption text-error mt-1">{fieldErrors.agree}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-[var(--radius-md)] bg-primary text-on-primary text-label-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Mendaftarkan…
                </>
              ) : (
                <>
                  Daftar
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="text-body-sm text-on-surface-variant mt-[var(--spacing-lg)] text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
