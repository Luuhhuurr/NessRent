export default function StatCard({ label, value, icon, hint }) {
  return (
    <div className="panel p-[var(--spacing-md)] flex items-start justify-between gap-[var(--spacing-md)]">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="font-heading text-h3 text-on-surface leading-none truncate">{value}</p>
        {hint && <p className="text-caption text-on-surface-variant">{hint}</p>}
      </div>
      {icon && (
        <span className="shrink-0 w-10 h-10 rounded-[var(--radius-md)] bg-primary-container text-on-primary-container grid place-items-center">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </span>
      )}
    </div>
  );
}
