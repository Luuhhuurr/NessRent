export default function Checkbox({ label, name, className = '', ...props }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        name={name}
        className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/40 accent-[var(--color-primary)] cursor-pointer"
        {...props}
      />
      <span className="text-body-sm text-on-surface-variant">{label}</span>
    </label>
  );
}
