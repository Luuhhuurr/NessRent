const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-md)] ' +
  'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

const VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90',
  secondary: 'border border-outline text-on-surface hover:bg-surface-container hover:border-outline-variant',
  ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
  danger: 'bg-error-container text-on-error-container hover:bg-error/80 hover:text-on-error',
};

const SIZES = {
  sm: 'text-label-md px-3 py-1.5',
  md: 'text-label-md px-4 py-2.5',
  lg: 'text-body-md px-6 py-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
