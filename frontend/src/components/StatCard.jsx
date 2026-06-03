export default function StatCard({ label, value, icon, status, variant = 'default' }) {
  const statusColors = {
    success: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="bg-surface p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-outline-variant/30 flex flex-col justify-between h-32">
      <p className="text-label-md text-on-surface-variant">{label}</p>
      <div className="flex items-end justify-between">
        {status ? (
          <>
            <span className={`inline-flex items-center gap-1 ${statusColors[status]} px-3 py-1 rounded-full text-label-md`}>
              <span className="material-symbols-outlined text-sm fill-1">verified</span>
              {value}
            </span>
          </>
        ) : (
          <p className="font-heading text-h1 text-on-surface leading-none">{value}</p>
        )}
        <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
      </div>
    </div>
  );
}