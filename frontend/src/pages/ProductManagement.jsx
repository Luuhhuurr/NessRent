import { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Vario 150 eSP',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhJ2jSkKqS-OnHKIuRFhCT7_NJ8zqN-vAqKwWMSh5N9-sT3b9nPOlSp1ZlIbTESW8Z5Zr34RBOHvjzc8rg5EFisYv6vV2KkHYPcFeGhf2lNkJklajf6sCXNloQVUT4mZD3yax3QU6jhUDGN9H8mEnW-cm-IUArAn3QhuTQ8hDmEOOmsLkQiXFy0OHbmczl20Vju8eAjvmNScV_xknqp5sREiypOKqrNVf3mZk91HpZptu4pVrFRv59KWe91',
    category: 'Kendaraan',
    price: 75000,
    status: 'Tersedia',
  },
  {
    id: 2,
    name: 'Proyektor Epson',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXRIjrxtPY5jAg_j6izGkZMSUYf0QWZZzxyr6RBEn63IahGuqZW_xCTvR9o4FM0G02uIQZ0aHDU0eVOvj1TjaOQiT9JW-2yF3ZyCOKN3jtk1YC2vKRUUBI5vyOyWFKb5bhpQvnOOPwW2rNJ2iLXcLWVkmG4z2FJbU4kBi3pYVJsVI7iS7s6fI_n8HDm-panLJ9AAuhBllqL-tJd3ycjpPmOeXNtJOE9cC4bF8UZJiEFkNphmU9Fayr8tW73pCxFI-YHiR9T63XIdKj',
    category: 'Elektronik',
    price: 50000,
    status: 'Tersedia',
  },
  {
    id: 3,
    name: 'Kamera Sony A7III',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeVc6eQJk2RhEPcw1WZotYg0Qzaex6uCCW0TudJVLQlOpjMdrq9OKizn-lp-03nBXwMiBA8-y_AQXNuUZXblKqwSqv-Z2raezRDMGRUb55gwpJoq1doBs5A3OIFp_V21miluPx2ftMLvaqivCU-fgD2HdlCC0XMNX1xd0gWiDwd1be--Jq5IdPSJYWujcFhp2OVXLtslzhX8J95KxzFKDKJie0wW9FDF5-j6pK6rZ8dLhwRz438khT_sCwkmzbwUsULUsxWc9HNdYZ',
    category: 'Elektronik',
    price: 250000,
    status: 'Tidak Tersedia',
  },
];

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-xs)] w-full sticky top-0 z-40">
        <div className="flex items-center gap-[var(--spacing-md)] flex-1">
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-container-highest rounded-[var(--radius-lg)] text-on-surface focus:ring-2 focus:ring-primary-container focus:outline-none transition-shadow text-body-md"
            />
          </div>
        </div>
        <div className="flex items-center gap-[var(--spacing-md)]">
          <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-[var(--radius-lg)] text-label-md font-bold hover:bg-primary-fixed-dim transition-colors shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            + Tambah Barang
          </button>
          <button className="text-on-surface-variant hover:text-primary-container p-2 rounded-full hover:bg-surface-container-highest">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden cursor-pointer hover:ring-2 ring-primary-container transition-all">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">account_circle</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-[var(--spacing-md)] pb-[var(--spacing-xl)] min-h-[calc(100vh-80px)]">
        {/* Page Header */}
        <div className="mb-[var(--spacing-lg)] flex justify-between items-end">
          <div>
            <h1 className="font-heading text-h1 text-on-background mb-2">Manajemen Barang</h1>
            <p className="text-body-lg text-on-surface-variant">Kelola semua data barang penyewaan</p>
          </div>
          <Link
            to="/admin/add-product"
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-[var(--radius-xl)] text-label-md font-bold hover:bg-primary-fixed-dim transition-colors shadow-[0_4px_20px_rgba(31,41,55,0.04)] flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            + Tambah Barang
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] p-[var(--spacing-md)] mb-[var(--spacing-lg)] flex flex-col md:flex-row gap-[var(--spacing-md)] items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari barang..."
              className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-[var(--radius-lg)] text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md"
            />
          </div>
          <div className="flex items-center gap-[var(--spacing-xs)] w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-surface border border-outline-variant rounded-[var(--radius-lg)] text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                <option value="Kendaraan">Kendaraan</option>
                <option value="Elektronik">Elektronik</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
            <div className="relative w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 bg-surface border border-outline-variant rounded-[var(--radius-lg)] text-on-surface focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-body-md cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Product Table Card */}
        <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-container-highest">
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Gambar</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Nama Barang</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Kategori</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Harga per hari</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant">Status</th>
                  <th className="py-4 px-6 text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface transition-colors duration-150 group">
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 rounded-[var(--radius-md)] overflow-hidden bg-surface-container-high border border-outline-variant">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-label-md text-on-background group-hover:text-primary transition-colors">{product.name}</span>
                    </td>
                    <td className="py-4 px-6 text-body-md text-on-surface-variant">{product.category}</td>
                    <td className="py-4 px-6 text-label-md text-on-background">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption font-semibold ${
                        product.status === 'Tersedia'
                          ? 'bg-[#E6F4EA] text-[#137333]'
                          : 'bg-surface-variant text-on-surface-variant border border-outline-variant'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-all" title="Detail">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-all" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-all" title="Hapus">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-surface px-6 py-4 border-t border-surface-container-highest flex items-center justify-between">
            <span className="text-caption text-on-surface-variant">Menampilkan 1-{filteredProducts.length} dari 24 barang</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-md bg-primary-container text-on-primary-container text-label-md flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-md text-on-surface-variant hover:bg-surface-container-highest text-label-md flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-md text-on-surface-variant hover:bg-surface-container-highest text-label-md flex items-center justify-center">3</button>
              <button className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container-highest">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}