const benefits = [
  { id: 1, title: 'Mudah dan cepat', icon: 'bolt' },
  { id: 2, title: 'Aman dan terpercaya', icon: 'shield' },
  { id: 3, title: 'Khusus mahasiswa UNNES', icon: 'school' },
  { id: 4, title: 'Sistem booking jelas', icon: 'fact_check' },
];

export default function BenefitsSection() {
  return (
    <section className="py-[var(--spacing-xl)] px-[var(--spacing-md)] max-w-[1280px] mx-auto">
      <h2 className="text-h2 font-heading mb-[var(--spacing-md)] text-center text-on-surface">
        Kenapa NesRent?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-surface p-[var(--spacing-lg)] rounded-[var(--radius-xl)] shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] flex flex-col items-start gap-[var(--spacing-xs)]"
          >
            <span className="material-symbols-outlined text-primary text-[32px] bg-primary-container/20 p-[var(--spacing-xs)] rounded-full">
              {benefit.icon}
            </span>
            <h3 className="text-label-md text-on-surface">{benefit.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}