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
          <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-lg' : 'pl-[var(--spacing-sm)]'} pr-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-md)] border bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-body-md text-on-surface outline-none ${
            error ? 'border-error' : 'border-outline-variant'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        )}
      </div>
      {error && (
        <span className="text-caption text-error">{error}</span>
      )}
    </div>
  );
}