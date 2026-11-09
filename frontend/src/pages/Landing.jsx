import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import HowItWorksSection from '../components/HowItWorksSection';
import BenefitsSection from '../components/BenefitsSection';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { getProductImage, formatPrice, getStatusLabel } from '../lib/format';

const stats = [
  { value: '120+', label: 'Barang aktif' },
  { value: '300+', label: 'Transaksi selesai' },
  { value: '1.2K', label: 'Mahasiswa terdaftar' },
  { value: 'UNNES', label: 'Kampus' },
];

/**
 * A preview of the product catalogue, composed from the real products. It
 * replaces the previous hotlinked stock photo, so the page has no external
 * image dependency and renders the same offline.
 */
function CataloguePreview({ products }) {
  const preview = products.slice(0, 3);

  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-primary/10 rounded-full blur-[100px]" />
      <div
        className="relative rounded-[var(--radius-xl)] border border-outline-variant bg-surface-container-lowest p-4 sm:p-5"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-label-sm text-on-surface-variant">Katalog terbaru</span>
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
          </span>
        </div>

        <div className="space-y-3">
          {preview.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-outline-variant bg-surface-container px-3 py-3"
              style={{ transform: `translateX(${index * 10}px)` }}
            >
              <img
                src={getProductImage(product.image_url || product.image)}
                alt={product.product_name}
                className="w-12 h-12 rounded-[var(--radius-md)] object-cover bg-surface-container-high shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-label-md text-on-surface truncate">{product.product_name}</p>
                <p className="text-caption text-on-surface-variant mt-0.5">
                  {product.category || 'Umum'} · {getStatusLabel(product.status)}
                </p>
              </div>
              <span className="text-caption text-on-surface shrink-0">{formatPrice(product.price)}</span>
            </div>
          ))}

          {preview.length === 0 && (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-outline-variant px-4 py-8 text-center">
              <p className="text-body-sm text-on-surface-variant">Katalog sedang dimuat…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts();
        setProducts(response?.data?.products ?? []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-outline-variant">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute -top-40 right-[-10%] w-[36rem] h-[36rem] bg-primary/10 rounded-full blur-[120px]" />

        <div className="relative max-w-[1280px] mx-auto px-[var(--spacing-md)] pt-[var(--spacing-xl)] pb-[var(--spacing-xl)] grid lg:grid-cols-[1.05fr_1fr] gap-[var(--spacing-xl)] items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">school</span>
              Platform sewa mahasiswa UNNES
            </span>

            <h1 className="font-heading text-h1 text-on-surface mt-6 max-w-xl">
              Sewa barang dari mahasiswa lain, tanpa drama.
            </h1>

            <p className="text-body-lg text-on-surface-variant mt-5 max-w-lg">
              Kamera, motor, hingga perlengkapan camping — semua ada di sekitar kampus.
              Terverifikasi, terarah, dan mudah dijadwalkan lewat satu aplikasi.
            </p>

            <div className="flex flex-wrap items-center gap-[var(--spacing-sm)] mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
              >
                Mulai sewa
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors"
              >
                Daftar gratis
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-6 text-caption text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-success">verified</span>
              Setiap akun diverifikasi admin sebelum dapat menyewa.
            </div>
          </div>

          <CataloguePreview products={products} />
        </div>

        <div className="relative border-t border-outline-variant">
          <div className="max-w-[1280px] mx-auto px-[var(--spacing-md)] grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-6 px-2 text-center ${
                  index > 0 ? 'lg:border-l border-outline-variant' : ''
                } ${index % 2 === 1 ? 'border-l border-outline-variant lg:border-l' : ''}`}
              >
                <p className="font-heading text-h2 text-on-surface">{stat.value}</p>
                <p className="text-caption text-on-surface-variant mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <HowItWorksSection />

      <section id="populer" className="py-[var(--spacing-xl)] px-[var(--spacing-md)] border-t border-outline-variant">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-[var(--spacing-md)]">
            <div>
              <p className="text-label-sm text-primary">Barang populer</p>
              <h2 className="font-heading text-h2 text-on-surface mt-2">Sedang banyak disewa</h2>
            </div>
            <Link
              to="/products"
              className="text-label-md text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Lihat katalog lengkap
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="panel h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="panel p-10 text-center">
              <p className="text-body-md text-on-surface-variant">
                Belum ada barang yang dipublikasikan. Jalankan <code className="text-primary">npm run seed</code> di
                folder backend untuk mengisi data contoh.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)]">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.product_name}
                  price={formatPrice(product.price)}
                  image={getProductImage(product.image_url || product.image)}
                  status={getStatusLabel(product.status)}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <BenefitsSection />

      <section id="cta" className="px-[var(--spacing-md)] pb-[var(--spacing-xl)]">
        <div className="max-w-[1280px] mx-auto rounded-[var(--radius-xl)] border border-outline-variant bg-primary-container/40 px-[var(--spacing-lg)] py-[var(--spacing-xl)] text-center">
          <h2 className="font-heading text-h2 text-on-surface max-w-2xl mx-auto">
            Punya barang yang jarang dipakai?
          </h2>
          <p className="text-body-lg text-on-surface-variant mt-4 max-w-xl mx-auto">
            Daftarkan barang Anda hari ini dan bantu fellow mahasiswa — sekaligus menghasilkan uang sampingan.
          </p>
          <div className="flex flex-wrap justify-center gap-[var(--spacing-sm)] mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
            >
              Buat akun gratis
            </Link>
            <Link
              to="/user/add-product"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors"
            >
              Tambah barang
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
