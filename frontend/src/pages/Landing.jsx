import CategorySection from '../components/CategorySection';
import HowItWorksSection from '../components/HowItWorksSection';
import BenefitsSection from '../components/BenefitsSection';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzaYdfVhFU0_xVUGOozmJADU3trABnTMO5tTcr_p9Q8NFO3l2AhDZuGdCW1GP-r6M7dSs88vQKTTPkw8FOkouducEZ9_B1qUzNdFjFRXmRHmVGpPcjAccett0RN_ySpwBSXG_S1fzNhmVrfJDj9TVfrY8BuElL--NUbiuHqdnWuYgiW82gEiJ4rSIhAnYGz29G1Sztbc5E6toqHiqCHbatx6e0gYlbwyb5-PBppFXjJImuhq8TwtrzrrwXabKVBB9lJAYRUTtkg4YO';

const featuredProducts = [
  {
    id: 1,
    name: 'Kamera Canon EOS',
    price: 'Rp 50rb',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJlc9LQZFBGg5NQmty8NI3425KxNyGgPaCy0nfu4-icWWKerpSUpTpgVYjCYpvrwsxZbGKOikl3s0RecCdnwaykBrM7i4-2Bd2E5J0jO4sv0mZv737ubAIFVhn7f2QddTyeejjpmXaM21j-OhBDVFBFTDaRB_RgU16SuTED6jaMoVdD1Rr4WH4OWaDSLrNL9xMSmSjLw3BF9_b8ht611LBCZK3vWQ-fuCaDLhsS5V5Fjpe3mN6H6EeJ_-vvyE_9R4vjzXyfFo1da3G',
    status: 'Tersedia',
  },
  {
    id: 2,
    name: 'Jas Pria Navy (M)',
    price: 'Rp 35rb',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIy_GY_3wm2lc9aMtr-C6y8x2k9IdA9zAD6ovqK0QXx5eLUU5CjmRE2UlbE7r4V2K6lTfWYqIP4MCt2x0eOXj6oZaWOxnJK8LxMZmmWKXqRCidSHEo28bQhBP3vHO0_9-y0Z0prGNcRO0VGdxKPEKV-G4_NedMCKIVharkJuEWql0YzyBc7UAvyb4WDBxGObLnCEH-inHdLX2Ca5glsh427gaY2GDmODKcWEYv09usx6N97vbRdSZMha9kmCe9LGjdczgKiEiYcQU1',
    status: 'Tersedia',
  },
  {
    id: 3,
    name: 'Honda Vario 125',
    price: 'Rp 75rb',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbJVTRxuF-ji1pOCTBJZ5y58odz8Ao_lEuGEJ38wvi6VC3Szb7PqvxXj0W_vy1G7Bd2QXQtZKOLbyd3zPAjo7HoxFU4QLRojlTxmc_9CfVttuHCx_80NIqSVcuCV5RDRP6NDmDioGwC6s1wvuqhJerV8FswzpFN3nRrpr9Wsko5FV1exjYVKd02Lt7bmqESkzCIdd9g9MkvqmatxYWePAXKaPjyYJLVwy1CQEUSZwiwiKqYSlSxdUs_RVt_Op4jdC4WlDX_w1RmzyI',
    status: 'Disewa',
    disabled: true,
  },
];

export default function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-[var(--spacing-xl)] px-[var(--spacing-md)] max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-[var(--spacing-lg)]">
        <div className="flex-1 flex flex-col gap-[var(--spacing-md)] items-start">
          <h1 className="text-h1 font-heading text-on-surface">
            Cara Termudah Menyewa Barang untuk Mahasiswa
          </h1>
          <p className="text-body-lg text-secondary">
            Platform rental khusus mahasiswa UNNES. Sewa jas, kamera, hingga motor dengan harga terjangkau dan proses yang mudah.
          </p>
          <div className="flex flex-wrap gap-[var(--spacing-xs)] pt-[var(--spacing-xs)]">
            <Button variant="primary" className="shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] hover:-translate-y-1">
              Mulai Sekarang
            </Button>
            <Button variant="secondary">Lihat Barang</Button>
          </div>
        </div>
        <div className="flex-1 w-full rounded-[var(--radius-xl)] overflow-hidden shadow-[0_4px_20px_0_rgba(31,41,55,0.04)]">
          <img
            src={heroImage}
            alt="Students with rental items"
            className="w-full h-[400px] object-cover rounded-[var(--radius-xl)]"
          />
        </div>
      </section>

      {/* Spacer */}
      <div className="h-[var(--spacing-lg)]" />

      {/* Categories Section */}
      <CategorySection />

      {/* Spacer */}
      <div className="h-[var(--spacing-lg)]" />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Spacer */}
      <div className="h-[var(--spacing-lg)]" />

      {/* Featured Items Section */}
      <section className="py-[var(--spacing-lg)] px-[var(--spacing-md)] bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-h2 font-heading mb-[var(--spacing-md)] text-on-surface">
            Barang Populer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-lg)]">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                status={product.status}
                disabled={product.disabled}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-[var(--spacing-xl)]" />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Spacer */}
      <div className="h-[var(--spacing-xl)]" />

      {/* CTA Section */}
      <section className="px-[var(--spacing-md)] pb-[var(--spacing-xl)] max-w-[1280px] mx-auto">
        <div className="bg-primary-container rounded-[var(--radius-xl)] p-[var(--spacing-xl)] flex flex-col items-center text-center gap-[var(--spacing-md)] shadow-[0_4px_20px_0_rgba(31,41,55,0.04)] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-[50%] -left-[10%] w-[300px] h-[300px] bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-[50%] -right-[10%] w-[300px] h-[300px] bg-white/20 rounded-full blur-3xl" />
          <h2 className="text-h1 font-heading text-on-primary-fixed z-10 relative">
            Mulai sewa sekarang dengan mudah
          </h2>
          <Button variant="secondary-light" className="mt-[var(--spacing-xs)] shadow-[0_8px_24px_0_rgba(31,41,55,0.15)] hover:-translate-y-1 z-10 relative">
            Daftar Sekarang
          </Button>
        </div>
      </section>
    </>
  );
}