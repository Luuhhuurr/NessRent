const benefits = [
  {
    title: 'Harga mahasiswa',
    description: 'Barang yang mahal disewa dengan harga jauh di bawah harga toko.',
    icon: 'savings',
  },
  {
    title: 'Terpercaya',
    description: 'Setiap akun diverifikasi admin sebelum bisa menyewa.',
    icon: 'verified_user',
  },
  {
    title: 'Di dekat campus',
    description: 'Serah terima langsung di area UNNES, tanpa ongkir.',
    icon: 'location_on',
  },
];

export default function BenefitsSection() {
  return (
    <section id="keunggulan" className="py-[var(--spacing-xl)] px-[var(--spacing-md)] border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto">
        <div className="max-w-xl mb-[var(--spacing-lg)]">
          <p className="text-label-sm text-primary">Keunggulan</p>
          <h2 className="font-heading text-h2 text-on-surface mt-2">Kenapa NesRent</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)]">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="panel p-[var(--spacing-lg)] flex flex-col gap-3">
              <span className="w-11 h-11 rounded-[var(--radius-md)] bg-primary-container text-on-primary-container grid place-items-center">
                <span className="material-symbols-outlined text-[22px]">{benefit.icon}</span>
              </span>
              <h3 className="font-heading text-h3 text-on-surface">{benefit.title}</h3>
              <p className="text-body-md text-on-surface-variant">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
