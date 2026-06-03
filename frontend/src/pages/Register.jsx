import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const illustrationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVc850PbQg_f6n8g5ZwC5HbuQpw6TW3g9nyWk6OYkSdUna1FbUpDukVJ1D552HtFNtSyDB4mnDvDXX1cftIzqBhTg6tDh0Ro7JLvlp6YO-E3XMEO9iglKzHh5_iCSPw_4SBQq50fnrN3DsZTh3XmVTqPSuTwDH5-kdZioCi2UOZFrj-iBLWvIjqmxM6XZNgu36EPYSFPo2eZuXlfe_rMUUPPz0qd6hDutpud_CXtcAbjY-C7KukODqa-BMquziMiomc6xjDgVyIVgx';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nim: '',
    password: '',
    confirmPassword: '',
    identityFile: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    // Clear field error when user starts typing
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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(formData);

      if (response.success) {
        // Store token and user data
        if (response.data.token) {
          localStorage.setItem('nesrent_token', response.data.token);
          localStorage.setItem('nesrent_user', JSON.stringify(response.data.user));
        }

        // Show success and redirect to login
        navigate('/register-success', {
          state: {
            message: response.message || 'Pendaftaran berhasil! Silakan tunggu verifikasi akun.',
            email: formData.email,
          },
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';

      // Handle specific field errors
      if (err.response?.data?.field) {
        setFieldErrors((prev) => ({
          ...prev,
          [err.response.data.field]: errorMessage,
        }));
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (fieldName) => `
    w-full h-12 px-[var(--spacing-sm)] bg-surface rounded-[var(--radius-lg)] border text-on-background text-body-md
    placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all
    ${fieldErrors[fieldName] ? 'border-error' : 'border-outline-variant'}
  `;

  return (
    <>
      {/* Left Split: Graphic & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-[#fff2a8] to-primary-container p-[var(--spacing-xl)] flex-col justify-between relative overflow-hidden">
        {/* Brand Logo */}
        <div className="font-heading text-h2 font-black text-on-primary-container relative z-10">
          NesRent
        </div>

        {/* Illustration */}
        <div className="flex-1 w-full flex items-center justify-center my-[var(--spacing-lg)] relative z-10">
          <img
            src={illustrationImage}
            alt="Students Illustration"
            className="w-full max-w-[400px] object-contain drop-shadow-2xl opacity-90"
          />
        </div>

        {/* Tagline */}
        <div className="relative z-10 max-w-[90%]">
          <h1 className="font-heading text-h1 text-on-primary-container">
            Gabung dan mulai sewa barang dengan mudah
          </h1>
        </div>

        {/* Decorative Ambient Shapes */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-fixed/40 rounded-full blur-3xl" />
      </div>

      {/* Right Split: Registration Form */}
      <div className="w-full lg:w-7/12 min-h-screen flex flex-col items-center justify-center p-[var(--spacing-md)] relative bg-surface">
        {/* Minimal Navigation (Back Button) */}
        <div className="absolute top-0 left-0 w-full p-[var(--spacing-md)] flex items-center justify-between lg:justify-end max-w-[1280px] mx-auto">
          <div className="font-heading text-h3 font-black text-primary lg:hidden">
            NesRent
          </div>
          <Link
            to="/"
            className="flex items-center gap-[var(--spacing-xs)] text-label-md text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Kembali ke beranda
          </Link>
        </div>

        {/* Form Card Container */}
        <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-[var(--radius-lg)] shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] p-[var(--spacing-md)] lg:p-[var(--spacing-lg)] mt-[var(--spacing-xl)] lg:mt-0 flex flex-col gap-[var(--spacing-lg)] border border-surface-variant/50">
          {/* Header */}
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <h2 className="font-heading text-h2 text-on-background">
              Daftar Akun NesRent
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Buat akun untuk mulai menyewa
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-error-container/20 border border-error-container/50 rounded-[var(--radius-lg)] p-[var(--spacing-sm)] flex items-center gap-[var(--spacing-xs)]">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
              <p className="text-body-md text-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-md)]">
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-background">
                Nama Lengkap
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass('fullName')}
                placeholder="Masukkan nama lengkap"
                type="text"
                disabled={isLoading}
              />
              {fieldErrors.fullName && (
                <p className="text-caption text-error">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email & NIM Row */}
            <div className="flex flex-col sm:flex-row gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)] w-full">
                <label className="text-label-md text-on-background">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                  placeholder="nama@kampus.ac.id"
                  type="email"
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <p className="text-caption text-error">{fieldErrors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-[var(--spacing-xs)] w-full">
                <label className="text-label-md text-on-background">NIM</label>
                <input
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  className={inputClass('nim')}
                  placeholder="10 digit NIM"
                  type="text"
                  maxLength={10}
                  disabled={isLoading}
                />
                {fieldErrors.nim && (
                  <p className="text-caption text-error">{fieldErrors.nim}</p>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div className="flex flex-col sm:flex-row gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)] w-full relative">
                <label className="text-label-md text-on-background">Password</label>
                <div className="relative w-full">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass('password')} pr-10`}
                    placeholder="Minimal 8 karakter"
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-background transition-colors flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-caption text-error">{fieldErrors.password}</p>
                )}
              </div>
              <div className="flex flex-col gap-[var(--spacing-xs)] w-full relative">
                <label className="text-label-md text-on-background">Konfirmasi Password</label>
                <div className="relative w-full">
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass('confirmPassword')} pr-10`}
                    placeholder="Ulangi password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-background transition-colors flex items-center justify-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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

            {/* Identity Verification Upload */}
            <div className="flex flex-col gap-[var(--spacing-xs)] mt-[var(--spacing-xs)]">
              <label className="text-label-md text-on-background">
                Upload Identitas
              </label>
              <p className="text-caption text-on-surface-variant mb-[var(--spacing-xs)]">
                Digunakan untuk verifikasi akun (KTM / KTP)
              </p>
              <div className="w-full border-2 border-dashed border-outline-variant rounded-[var(--radius-lg)] p-[var(--spacing-md)] flex flex-col items-center justify-center gap-[var(--spacing-xs)] bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
                <input
                  type="file"
                  name="identityFile"
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  className="hidden"
                  id="identity-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="identity-upload"
                  className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">upload_file</span>
                </label>
                <div className="text-center">
                  <span className="text-label-md text-primary group-hover:text-primary-fixed-dim transition-colors block">
                    {formData.identityFile ? formData.identityFile.name : 'Klik untuk upload foto'}
                  </span>
                  <span className="text-caption text-on-surface-variant">
                    JPG, PNG atau PDF (Maks. 5MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-[var(--spacing-xs)] bg-primary-container text-on-primary-container text-label-md rounded-[var(--radius-lg)] hover:bg-primary-fixed transition-all hover:shadow-[0_8px_24px_0_rgba(31,41,55,0.1)] active:scale-[0.98] flex items-center justify-center gap-[var(--spacing-xs)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Mendaftar...
                </>
              ) : (
                <>
                  Daftar
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Secondary Action / Link */}
          <div className="w-full text-center">
            <p className="text-body-md text-on-surface-variant">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="text-primary font-bold hover:text-primary-fixed-dim hover:underline transition-colors"
              >
                Login sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}