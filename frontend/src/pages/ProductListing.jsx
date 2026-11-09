import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { productService } from '../services/productService';
import { formatPrice, getProductImage, getStatusLabel } from '../lib/format';

const MAX_PRICE = 1000000;

export default function ProductListing() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    search: searchParams.get('q') ?? '',
    maxPrice: MAX_PRICE,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchProducts = useCallback(async () => {
    const params = { page, limit: 12 };
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;

    const response = await productService.getProducts(params);
    return {
      products: response?.data?.products ?? [],
      totalPages: response?.data?.pagination?.totalPages || 1,
    };
  }, [page, filters]);

  const fetchCategories = useCallback(async () => {
    const response = await productService.getCategories();
    const data = response?.data ?? response ?? [];
    return Array.isArray(data) ? data : [];
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchProducts();
        setProducts(result.products);
        setTotalPages(result.totalPages);
      } catch (err) {
        setProducts([]);
        setError(err?.message || 'Gagal memuat daftar barang.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchProducts, reloadKey]);

  useEffect(() => {
    const load = async () => {
      try {
        setCategories(await fetchCategories());
      } catch {
        setCategories([]);
      }
    };

    load();
  }, [fetchCategories]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setPage(1);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return String(a.product_name).localeCompare(String(b.product_name), 'id');
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // The slider works in rupiah while the database stores thousands.
  const filteredProducts = sortedProducts.filter(
    (product) => Number(product.price) * 1000 <= filters.maxPrice
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-xl)] flex flex-col md:flex-row gap-[var(--spacing-lg)]">
      <FilterSidebar filters={filters} categories={categories} onFilterChange={handleFilterChange} />

      <section className="flex-grow flex flex-col gap-[var(--spacing-md)] min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--spacing-md)]">
          <div>
            <h1 className="font-heading text-h2 text-on-surface">Daftar Barang</h1>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Temukan barang yang ditawarkan mahasiswa lain di sekitar kampus.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-[var(--spacing-sm)] w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                search
              </span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-colors"
                placeholder="Cari barang..."
              />
            </div>
            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Urutkan barang"
                className="w-full pl-4 pr-10 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-colors cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="price-low">Harga termurah</option>
                <option value="price-high">Harga termahal</option>
                <option value="name">Nama A-Z</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="panel h-80 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="panel p-[var(--spacing-lg)] text-center">
            <span className="material-symbols-outlined text-error text-[48px] mb-2">error</span>
            <p className="text-body-md text-error">{error}</p>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="panel p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[64px] mb-4">inventory_2</span>
            <h3 className="font-heading text-h3 text-on-surface mb-2">Tidak ada barang</h3>
            <p className="text-body-md text-on-surface-variant">
              {filters.search || filters.category
                ? 'Tidak ada barang yang sesuai dengan filter Anda.'
                : 'Belum ada barang yang tersedia.'}
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <div className="panel p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[64px] mb-4">filter_alt_off</span>
            <h3 className="font-heading text-h3 text-on-surface mb-2">Tidak ada barang dalam rentang harga</h3>
            <p className="text-body-md text-on-surface-variant">
              Coba geser slider harga ke angka yang lebih tinggi.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.product_name || 'Tanpa Nama'}
                  price={formatPrice(product.price)}
                  image={getProductImage(product.image_url || product.image)}
                  status={getStatusLabel(product.status)}
                  category={product.category}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-[var(--spacing-xs)] mt-[var(--spacing-lg)]">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Halaman sebelumnya"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-label-md transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Halaman berikutnya"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            )}

            <p className="text-center text-caption text-on-surface-variant">
              Menampilkan {filteredProducts.length} dari {products.length} barang
            </p>
          </>
        )}
      </section>
    </div>
  );
}
