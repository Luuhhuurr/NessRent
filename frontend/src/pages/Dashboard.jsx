import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Kamera Canon EOS',
    price: 'Rp 50rb',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ugaOFlt2CMxmYDgwT-X-oEf7kddoYepUr8IvtZUcOKQ26rZSm4CO5uKdwwIQMEbA_Kx1PyyXKclexMCpSik-0tMo0bbGpl2dorbOOOXHdIHNwUBxAzMEPtMbx_wYbVc7xU4wyZ_MucntOsZhsUFDkUpcsPFPaq_ZSNZEPam3I3_0x25ukIlnqYn7rD0xOy9uiQIZeVecW-lP0uUv5dapmte8uNMkAuk-1ZJT_GhCYLNWQEJMBui4LMpoM4',
    status: 'Tersedia',
  },
  {
    id: 2,
    name: 'Jas Pria Navy',
    price: 'Rp 35rb',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjUOiT1I4eJ8OHO5lVVEewmeM8S3E1KqLW2r1o9KicQeYKHX_Axktzw8-qyrj6aBIbcpxj165_RPMJFl906po0lqVxNYvVw3JKsX8fkMaS4-cDUa9UsLSIBKu34Vd8aMgsU3jbZOT45GFdUAeOdbioNeFfFgk8z1IX7tKcbjZUjw5QwyLENqXTh_5ZvatfI3ExkYuoRFu3jwJ_6GOYx6XjnlTCZWzygool2nV0rTlnmnSzHraJwaz-IOKd4D-0jDf9JU90h9PNKLQj',
    status: 'Tersedia',
  },
  {
    id: 3,
    name: 'Honda Vario 125',
    price: 'Rp 75rb',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhJ2jSkKqS-OnHKIuRFhCT7_NJ8zqN-vAqKwWMSh5N9-sT3b9nPOlSp1ZlIbTESW8Z5Zr34RBOHvjzc8rg5EFisYv6vV2KkHYPcFeGhf2lNkJklajf6sCXNloQVUT4mZD3yax3QU6jhUDGN9H8mEnW-cm-IUArAn3QhuTQ8hDmEOOmsLkQiXFy0OHbmczl20Vju8eAjvmNScV_xknqp5sREiypOKqrNVf3mZk91HpZptu4pVrFRv59KWe91',
    status: 'Sedang Disewa',
    disabled: true,
  },
];

const recentTransactions = [
  { id: 1, name: 'Kamera Canon EOS', date: '12 Okt 2023', status: 'Disetujui', statusType: 'success' },
  { id: 2, name: 'Jas Pria Navy', date: '05 Okt 2023', status: 'Selesai', statusType: 'info' },
  { id: 3, name: 'Honda Vario 125', date: '01 Okt 2023', status: 'Ditolak', statusType: 'error' },
];

export default function Dashboard() {
  return (
    <>
      {/* Welcome Section */}
      <section className="mb-[var(--spacing-lg)]">
        <h2 className="font-heading text-h2 text-on-surface mb-[var(--spacing-xs)]">
          Selamat datang, Martino Otniel
        </h2>
        <p className="text-body-lg text-on-surface-variant">
          Siap menyewa barang hari ini?
        </p>
      </section>

      {/* Summary Cards Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <div className="bg-surface p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-outline-variant/30 flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant">Total Transaksi</p>
          <div className="flex items-end justify-between">
            <p className="font-heading text-h1 text-on-surface leading-none">12</p>
            <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
          </div>
        </div>
        <div className="bg-surface p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-outline-variant/30 flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant">Booking Aktif</p>
          <div className="flex items-end justify-between">
            <p className="font-heading text-h1 text-on-surface leading-none">2</p>
            <span className="material-symbols-outlined text-primary text-3xl">pending_actions</span>
          </div>
        </div>
        <div className="bg-surface p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-outline-variant/30 flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant">Transaksi Selesai</p>
          <div className="flex items-end justify-between">
            <p className="font-heading text-h1 text-on-surface leading-none">10</p>
            <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
          </div>
        </div>
        <div className="bg-surface p-[var(--spacing-md)] rounded-[var(--radius-xl)] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-outline-variant/30 flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant">Status Verifikasi</p>
          <div className="flex items-end justify-between">
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-label-md">
              <span className="material-symbols-outlined text-sm fill-1">verified</span>
              Verified
            </span>
            <span className="material-symbols-outlined text-primary text-3xl">shield_person</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-[var(--spacing-sm)] mb-[var(--spacing-lg)]">
        <Link
          to="/products"
          className="bg-primary-container text-on-primary-fixed flex items-center gap-2 px-6 py-3 rounded-[var(--radius-lg)] text-label-md hover:bg-primary-fixed transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined">search</span>
          Cari Barang
        </Link>
        <Link
          to="/history"
          className="bg-surface border border-outline-variant text-on-surface flex items-center gap-2 px-6 py-3 rounded-[var(--radius-lg)] text-label-md hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">list_alt</span>
          Lihat Transaksi
        </Link>
        <Link
          to="/profile"
          className="bg-surface border border-outline-variant text-on-surface flex items-center gap-2 px-6 py-3 rounded-[var(--radius-lg)] text-label-md hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">person</span>
          Profil Saya
        </Link>
      </section>

      {/* Featured Items */}
      <section className="mb-[var(--spacing-lg)]">
        <div className="flex items-center justify-between mb-[var(--spacing-md)]">
          <h3 className="font-heading text-h3 text-on-surface">Barang Populer</h3>
          <Link to="/products" className="text-label-md text-primary hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-surface rounded-[var(--radius-xl)] shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden rounded-t-[var(--radius-xl)]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-4 left-4 backdrop-blur px-3 py-1 rounded-full text-label-md text-caption ${
                    product.status === 'Tersedia'
                      ? 'bg-primary-container/90 text-on-primary-fixed'
                      : 'bg-surface-variant/90 text-on-surface-variant'
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="p-[var(--spacing-md)] flex-1 flex flex-col">
                <h4 className="text-body-lg text-on-surface mb-1">{product.name}</h4>
                <p className="font-heading text-h3 text-primary mb-4 mt-auto">
                  {product.price}
                  <span className="text-body-md text-caption text-on-surface-variant">/hari</span>
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className={`w-full text-center py-3 rounded-[var(--radius-lg)] text-label-md transition-colors ${
                    product.disabled
                      ? 'bg-surface-container border border-outline-variant text-on-surface-variant cursor-not-allowed opacity-70'
                      : 'bg-primary-container text-on-primary-fixed hover:bg-primary-fixed'
                  }`}
                >
                  {product.disabled ? 'Tidak Tersedia' : 'Sewa Sekarang'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="bg-surface rounded-[var(--radius-xl)] shadow-sm border border-outline-variant/30 p-[var(--spacing-md)] overflow-hidden">
        <h3 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/50">
                <th className="py-3 px-4 text-label-md text-on-surface-variant">Nama Barang</th>
                <th className="py-3 px-4 text-label-md text-on-surface-variant">Tanggal</th>
                <th className="py-3 px-4 text-label-md text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="text-body-md text-on-surface">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{transaction.name}</td>
                  <td className="py-4 px-4 text-on-surface-variant">{transaction.date}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-caption ${
                        transaction.statusType === 'success'
                          ? 'bg-green-100 text-green-800'
                          : transaction.statusType === 'info'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}