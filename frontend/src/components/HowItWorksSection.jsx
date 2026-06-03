const steps = [
  { id: 1, title: 'Cari barang', description: 'Temukan barang yang Anda butuhkan.', icon: 'search', highlight: true },
  { id: 2, title: 'Pilih tanggal', description: 'Tentukan durasi penyewaan.', icon: 'calendar_month' },
  { id: 3, title: 'Booking', description: 'Lakukan pembayaran dengan aman.', icon: 'shopping_cart_checkout' },
  { id: 4, title: 'Ambil barang', description: 'Barang siap digunakan!', icon: 'local_mall' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-[var(--spacing-xl)] px-[var(--spacing-md)] max-w-[1280px] mx-auto">
      <h2 className="text-h2 font-heading mb-[var(--spacing-md)] text-center text-on-surface">
        Cara Kerja
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-md)] relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute top-[40px] left-[12%] right-[12%] h-[2px] bg-tertiary-container z-0" />

        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center gap-[var(--spacing-xs)] z-10 relative"
          >
            <div
              className={`w-[80px] h-[80px] rounded-full flex items-center justify-center shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] ${
                step.highlight
                  ? 'bg-primary-container'
                  : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[32px] ${
                  step.highlight ? 'text-on-primary-container' : 'text-on-surface'
                }`}
              >
                {step.icon}
              </span>
            </div>
            <h3 className="text-h3 font-heading text-on-surface mt-[var(--spacing-xs)]">
              {step.id}. {step.title}
            </h3>
            <p className="text-body-md text-secondary">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}