import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  name,
  placeholder,
  icon,
  error,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`flex flex-col gap-[var(--spacing-xs)] ${className}`}>
      {label && (
        <label className="text-label-md text-on-surface" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 rounded-[var(--radius-md)] border bg-surface-container text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/25 ${
            error ? 'border-error' : 'border-outline-variant'
          }`}
          {...props}
        />
        {isPassword && (
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
        )}
      </div>
      {error && <span className="text-caption text-error">{error}</span>}
    </div>
  );
}
