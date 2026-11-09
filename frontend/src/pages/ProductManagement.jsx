import { useCallback, useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { getProductImage, getStatusLabel, formatPrice } from '../lib/format';

const CATEGORIES = ['Elektronik', 'Kendaraan', 'Fashion', 'Alat Camping'];

const STATUS_OPTIONS = [
  { value: '', label: 'Semua status' },
  { value: 'available', label: 'Tersedia' },
  { value: 'unavailable', label: 'Tidak tersedia' },
];

const getStatusClass = (status) =>
  status === 'available' || status === 'tersedia'
    ? 'bg-success-container text-on-success-container'
    : 'bg-surface-container-high text-on-surface-variant';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProducts = useCallback(async () => {
    const response = await productService.getProducts();
    return response?.data?.products ?? [];
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setProducts(await fetchProducts());
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat daftar barang.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const name = String(product.product_name ?? '').toLowerCase();
    const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter ||
      String(product.category ?? '').toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus =
      !statusFilter ||
      product.status === statusFilter ||
      getStatusLabel(product.status) === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProduct = async (productId) => {
    setError(null);
    setNotice(null);
    try {
      await productService.deleteProduct(productId);
      setProducts((current) => current.filter((p) => p.id !== productId));
      setNotice(`Barang #${productId} berhasil dihapus.`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal menghapus barang.');
    }
  };

  return (
    <>
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Manajemen barang</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Kelola seluruh barang yang tercatat di katalog NesRent.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] md:items-center justify-between mb-[var(--spacing-md)]">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari barang..."
            className="w-full pl-10 pr-3 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-[var(--spacing-sm)] w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter kategori"
            className="bg-surface-container border border-outline-variant rounded-[var(--radius-md)] px-3 py-2.5 text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors cursor-pointer"
          >
            <option value="">Semua kategori</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter status"
            className="bg-surface-container border border-outline-variant rounded-[var(--radius-md)] px-3 py-2.5 text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors cursor-pointer"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notice && (
        <div className="rounded-[var(--radius-md)] bg-success-container/40 border border-success/25 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
          <p className="text-body-sm text-on-success-container">{notice}</p>
        </div>
      )}

      {error && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      {loading && (
        <div className="panel p-[var(--spacing-lg)] text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[40px] animate-spin">
            progress_activity
          </span>
          <p className="text-body-sm text-on-surface-variant mt-2">Memuat data...</p>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="panel p-[var(--spacing-xl)] text-center">
          <span className="material-symbols-outlined text-[56px] text-on-surface-variant mb-4">inventory_2</span>
          <h3 className="font-heading text-h3 text-on-surface mb-2">Tidak ada barang</h3>
          <p className="text-body-md text-on-surface-variant">
            {searchQuery || categoryFilter || statusFilter
              ? 'Tidak ada barang yang sesuai dengan filter Anda.'
              : 'Belum ada barang di database.'}
          </p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Barang</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Kategori</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Harga/hari</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Status</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-outline-variant/40 hover:bg-surface-container transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[var(--radius-md)] overflow-hidden bg-surface-container border border-outline-variant shrink-0">
                          <img
                            src={getProductImage(product.image_url)}
                            alt={product.product_name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-body-sm text-on-surface">{product.product_name || 'Tanpa nama'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-on-surface-variant">
                      {product.category || '-'}
                    </td>
                    <td className="py-3 px-4 text-body-sm text-on-surface font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption ${getStatusClass(product.status)}`}
                      >
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        aria-label={`Hapus ${product.product_name}`}
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-[var(--radius-md)] text-on-surface-variant hover:text-error hover:bg-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-outline-variant">
            <span className="text-caption text-on-surface-variant">
              Menampilkan {filteredProducts.length} dari {products.length} barang
            </span>
          </div>
        </div>
      )}
    </>
  );
}
