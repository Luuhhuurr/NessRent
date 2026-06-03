export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const baseClasses = 'text-label-md font-[600] px-[var(--spacing-sm)] py-[var(--spacing-xs)] rounded-[var(--radius-lg)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-container text-on-primary-container hover:opacity-80 shadow-[0_4px_20px_0_rgba(31,41,55,0.04)]',
    secondary: 'border border-on-surface text-on-surface hover:bg-surface-container-low',
    'secondary-light': 'bg-on-surface text-background hover:bg-on-surface/90',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}