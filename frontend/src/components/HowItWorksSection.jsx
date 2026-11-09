const steps = [
  {
    title: 'Cari',
    description: 'Telusuri katalog barang yang ditawarkan oleh mahasiswa lain di kampus.',
    icon: 'search',
  },
  {
    title: 'Pesan',
    description: 'Pilih tanggal, kirim pesanan, dan tunggu persetujuan pemilik barang.',
    icon: 'event_available',
  },
  {
    title: 'Serah terima',
    description: 'Ambil barang langsung dari campus, lalu kembalikan sesuai jadwal.',
    icon: 'handshake',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="py-[var(--spacing-xl)] px-[var(--spacing-md)] border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto">
        <div className="max-w-xl mb-[var(--spacing-lg)]">
          <p className="text-label-sm text-primary">Cara kerja</p>
          <h2 className="font-heading text-h2 text-on-surface mt-2">Tiga langkah, selesai</h2>
          <p className="text-body-lg text-on-surface-variant mt-3">
            Dari mencari sampai barang di tangan, semuanya lewat satu alur yang jelas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)] relative">
          <div className="hidden md:block absolute top-[30px] left-[16%] right-[16%] h-px bg-outline-variant" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col gap-4">
              <div className="w-[60px] h-[60px] rounded-[var(--radius-lg)] bg-primary-container text-on-primary-container grid place-items-center border border-outline-variant">
                <span className="material-symbols-outlined text-[26px]">{step.icon}</span>
              </div>
              <div>
                <p className="text-label-sm text-primary">Langkah {index + 1}</p>
                <h3 className="font-heading text-h3 text-on-surface mt-1">{step.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-2 max-w-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
