import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCardListing from '../components/ProductCardListing';
import FilterSidebar from '../components/FilterSidebar';
import { productService } from '../services/productService';

const formatPrice = (price) => {
  if (price === undefined || price === null) return 'Rp 0';
  const num = typeof price === 'string' ? parseFloat(price) * 1000 : price * 1000;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
};

const getPrice = (product) => product?.price_per_day ?? product?.price ?? 0;

const getStatusLabel = (status) => {
  const statusMap = {
    available: 'Tersedia',
    unavailable: 'Tidak Tersedia',
    rented: 'Disewa',
  };
  return statusMap[status] || status;
};

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: 'available',
    search: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 12 };
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const apiResponse = await productService.getProducts(params);

      // FIXED: apiResponse IS the data object (service unwraps Axios wrapper)
      // Structure: { success: true, data: { products: [...], pagination: {...} }
      const response = apiResponse ?? {};
      const productsList = response.data?.products ?? response.products ?? [];
      const pagination = response.data?.pagination ?? response.pagination ?? {};

      setProducts(productsList);
      setTotalPages(pagination.totalPages || 1);
      setHasMore(page < (pagination.totalPages || 1));
    } catch (err) {
      setProducts([]);
      setError(err?.message || 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const apiResponse = await productService.getCategories();
      const response = apiResponse ?? {};
      const categoriesData = response.data ?? response ?? [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

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
        return getPrice(a) - getPrice(b);
      case 'price-high':
        return getPrice(b) - getPrice(a);
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-xl)] flex flex-col md:flex-row gap-[var(--spacing-lg)]">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Product Listing Area */}
      <section className="flex-grow flex flex-col gap-[var(--spacing-md)]">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--spacing-md)] mb-[var(--spacing-xs)]">
          <h1 className="font-heading text-h2 text-on-background">Daftar Barang</h1>
          <div className="flex flex-col sm:flex-row gap-[var(--spacing-xs)] w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-[var(--radius-lg)] text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all shadow-[0_4px_20px_rgba(31,41,55,0.04)]"
                placeholder="Cari barang..."
              />
            </div>
            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-[var(--radius-lg)] text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all shadow-[0_4px_20px_rgba(31,41,55,0.04)] cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="price-low">Harga termurah</option>
                <option value="price-high">Harga termahal</option>
                <option value="name">Nama A-Z</option>
              </select>
              <span className="material-symbols-outlined absolute right-[var(--spacing-sm)] top-1/2 transform -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-4 animate-pulse">
                <div className="aspect-[4/3] bg-surface-container rounded-[var(--radius-lg)] mb-4" />
                <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                <div className="h-4 bg-surface-container rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-error-container/20 border border-error-container/50 rounded-[var(--radius-xl)] p-6 text-center">
            <span className="material-symbols-outlined text-error text-[48px] mb-2">error</span>
            <p className="text-body-md text-error">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-primary-container text-on-primary-container rounded-[var(--radius-lg)] hover:bg-primary-fixed transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-12 text-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[64px] mb-4">inventory_2</span>
            <h3 className="text-h3 text-on-surface mb-2">Tidak ada produk</h3>
            <p className="text-body-md text-on-surface-variant">
              {filters.search
                ? 'Tidak ada produk yang sesuai dengan pencarian Anda'
                : 'Belum ada produk yang tersedia'}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
              {sortedProducts.map((product) => (
                <ProductCardListing
                  key={product.id}
                  id={product.id}
                  name={product.product_name || product.name || 'Tanpa Nama'}
                  price={formatPrice(getPrice(product))}
                  image={product.image_url || product.image || ''}
                  status={product.status || 'Tersedia'}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-[var(--spacing-xs)] mt-[var(--spacing-lg)]">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-label-md transition-colors ${
                        page === pageNum
                          ? 'bg-primary-container text-on-primary-container'
                          : 'border border-outline-variant text-on-surface-variant hover:bg-surface'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            )}

            {/* Results Info */}
            <p className="text-center text-caption text-on-surface-variant mt-[var(--spacing-sm)]">
              Menampilkan {products.length} dari {totalPages * 12} produk
            </p>
          </>
        )}
      </section>
    </div>
  );
}