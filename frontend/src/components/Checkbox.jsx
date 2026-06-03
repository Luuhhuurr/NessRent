export default function Checkbox({ label, name, className = '', ...props }) {
  return (
    <label className={`flex items-center gap-[var(--spacing-xs)] cursor-pointer ${className}`}>
      <input
        type="checkbox"
        name={name}
        className="rounded text-primary-container focus:ring-primary-container/50 border-outline-variant bg-surface w-4 h-4 cursor-pointer"
        {...props}
      />
      <span className="text-body-md text-on-surface-variant text-sm">{label}</span>
    </label>
  );
}