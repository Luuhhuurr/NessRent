import { Link } from 'react-router-dom';

const categories = [
  { name: 'Elektronik', icon: 'devices', description: 'Kamera, laptop, audio' },
  { name: 'Kendaraan', icon: 'two_wheeler', description: 'Motor, sepeda, mobil' },
  { name: 'Fashion', icon: 'checkroom', description: 'Tas, sepatu, jacket' },
  { name: 'Alat Camping', icon: 'camping', description: 'Tenda, tenda, matras' },
];

export default function CategorySection() {
  return (
    <section id="kategori" className="py-[var(--spacing-lg)] px-[var(--spacing-md)] border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-[var(--spacing-md)]">
          <div>
            <p className="text-label-sm text-primary">Kategori</p>
            <h2 className="font-heading text-h2 text-on-surface mt-2">Yang lagi disewa</h2>
          </div>
          <Link
            to="/products"
            className="text-label-md text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Lihat semua katalog
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="panel p-[var(--spacing-md)] flex flex-col gap-3 hover:border-outline transition-colors duration-200"
            >
              <span className="w-11 h-11 rounded-[var(--radius-md)] bg-primary-container text-on-primary-container grid place-items-center">
                <span className="material-symbols-outlined text-[22px]">{category.icon}</span>
              </span>
              <span>
                <span className="block text-label-md text-on-surface">{category.name}</span>
                <span className="block text-caption text-on-surface-variant mt-1">{category.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
