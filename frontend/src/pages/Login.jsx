import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { clearAuth, saveAuth } from '../components/ProtectedRoute';

const illustrationImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5lF_tzTBuWamleuesHAMl1ebaho2Sowxek4uh-1TDevCDIgSOn7CGw9yWzvdf9RP_2JFAlq7xhxznxkZ6cZppEgtghZE_a_GfFiyMp06GkJHiU_KZeksIbLdONCDnzQz2GCO6RqYtsPXL_7V-1H5HrWtwFIi1TuTmrjad71dliF_GRJhRowhL95mNBG3vBk376PLrgWRVRU3K3IxJ24hiL1rN_GuEEYHHJWRUTBBc6RsixBks-xKdZ2_6jPoWB_ktCe0yEYyn-gxx';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email/NIM wajib diisi';
    }
    if (!formData.password) {
      errors.password = 'Password wajib diisi';
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
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.success && response.data?.data) {
        const { user, token } = response.data.data;

        // Save auth data
        saveAuth(user, token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Check account status
        if (user.status === 'pending') {
          setError('Akun Anda belum diverifikasi. Silakan tunggu konfirmasi dari admin.');
          clearAuth();
          setIsLoading(false);
          return;
        }

        if (user.status === 'blacklist') {
          setError('Akun Anda telah ditangguhkan. Hubungi admin.');
          clearAuth();
          setIsLoading(false);
          return;
        }

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (fieldName) => `
    w-full h-12 px-4 bg-surface rounded-[var(--radius-lg)] border text-on-surface text-body-md
    placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all
    ${fieldErrors[fieldName] ? 'border-error' : 'border-outline-variant'}
  `;

  return (
    <>
      {/* Left Side: Illustration & Tagline */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-fixed to-primary-container hidden lg:flex flex-col justify-center items-center p-[var(--spacing-xl)] relative overflow-hidden">
        <div className="relative z-10 text-center flex flex-col items-center">
          <img
            src={illustrationImage}
            alt="Students with rental items"
            className="max-w-[400px] w-full object-contain mb-[var(--spacing-lg)] rounded-[var(--radius-xl)] shadow-sm"
          />
          <h1 className="font-heading text-h1 text-on-primary-container mt-[var(--spacing-lg)] max-w-[400px]">
            Sewa barang jadi lebih mudah
          </h1>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white opacity-20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary opacity-20 rounded-full blur-[100px]" />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-[var(--spacing-md)] md:p-[var(--spacing-xl)] bg-surface">
        <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] md:p-[var(--spacing-lg)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] border border-outline-variant/30">
          <div className="mb-[var(--spacing-lg)] text-center lg:text-left">
            <h2 className="font-heading text-h2 text-on-surface mb-[var(--spacing-xs)]">
              Login ke NesRent
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Masuk untuk mulai menyewa barang
            </p>
          </div>

          {error && (
            <div className="bg-error-container/20 border border-error-container/50 rounded-[var(--radius-lg)] p-[var(--spacing-sm)] mb-[var(--spacing-md)] flex items-start gap-[var(--spacing-xs)]">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
              <p className="text-body-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-md)]">
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface">Email / NIM</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass('email')} pl-10`}
                  placeholder="Masukkan Email atau NIM Anda"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && <p className="text-caption text-error">{fieldErrors.email}</p>}
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass('password')} pl-10 pr-10`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {fieldErrors.password && <p className="text-caption text-error">{fieldErrors.password}</p>}
            </div>

            <div className="flex justify-between items-center mt-[var(--spacing-xs)]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-label-sm text-on-surface-variant">Ingat saya</span>
              </label>
              <Link to="/forgot-password" className="text-label-sm text-primary hover:underline">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-[var(--spacing-xs)] w-full py-[var(--spacing-xs)] rounded-[var(--radius-md)] bg-primary-container text-on-primary-container text-label-md font-bold hover:shadow-[0_8px_24px_rgba(31,41,55,0.1)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Memasuki akun...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-[var(--spacing-lg)] text-center">
            <p className="text-body-md text-on-surface-variant">
              Belum punya akun?{' '}
              <Link to="/register" className="text-label-md text-primary hover:underline font-semibold">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}