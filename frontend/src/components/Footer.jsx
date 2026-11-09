import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Katalog',
    links: [
      { label: 'Semua barang', to: '/products' },
      { label: 'Elektronik', to: '/products?category=Elektronik' },
      { label: 'Kendaraan', to: '/products?category=Kendaraan' },
      { label: 'Alat camping', to: '/products?category=Alat+Camping' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang NesRent', to: '/#tentang' },
      { label: 'Cara kerja', to: '/#cara-kerja' },
      { label: 'Keunggulan', to: '/#keunggulan' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'Pusat bantuan', to: '/#bantuan' },
      { label: 'Syarat penyewaan', to: '/#syarat' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full mt-[var(--spacing-xl)] border-t border-outline-variant bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)] grid gap-[var(--spacing-lg)] md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-[var(--radius-md)] bg-primary grid place-items-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">handshake</span>
            </span>
            <span className="font-heading text-h3 font-extrabold text-on-surface">NesRent</span>
          </Link>
          <p className="mt-4 text-body-sm text-on-surface-variant leading-relaxed">
            Platform sewa barang antar mahasiswa UNNES. Memudahkan mahasiswa menyewa kamera,
            kendaraan, dan perlengkapan tanpa harus membeli baru.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-label-sm text-on-surface-variant">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-[var(--spacing-md)] py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-caption text-on-surface-variant">
            &copy; {new Date().getFullYear()} NesRent. Dibuat untuk mahasiswa UNNES.
          </p>
          <p className="text-caption text-on-surface-variant">
            Demo academic project — bukan layanan komersial.
          </p>
        </div>
      </div>
    </footer>
  );
}
