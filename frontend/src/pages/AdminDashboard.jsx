import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { adminService } from '../services/adminService';
import { formatDate, statusLabel, statusTone } from '../lib/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalBookings: 0 });
  const [categories, setCategories] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsResponse, categoryResponse, recentResponse] = await Promise.all([
          adminService.getStats(),
          adminService.getCategoryStats(),
          adminService.getRecentBookings(),
        ]);

        setStats(statsResponse?.data ?? { totalProducts: 0, totalBookings: 0 });
        setCategories(categoryResponse?.data?.categories ?? []);
        setRecentBookings(recentResponse?.data?.bookings ?? []);
      } catch (err) {
        setError(err?.message || 'Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-[var(--spacing-lg)]">
        <div>
          <h2 className="font-heading text-h2 text-on-surface">Dashboard admin</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Ringkasan aktivitas marketplace NesRent.
          </p>
        </div>
        <Link
          to="/admin/transactions"
          className="text-label-md text-primary hover:underline inline-flex items-center gap-1"
        >
          Kelola transaksi
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
        <StatCard
          label="Total barang"
          value={loading ? '-' : stats.totalProducts}
          icon="inventory_2"
          hint="Barang yang terdaftar di katalog"
        />
        <StatCard
          label="Total transaksi"
          value={loading ? '-' : stats.totalBookings}
          icon="receipt_long"
          hint="Seluruh booking yang pernah dibuat"
        />
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-md)]">
        <section className="panel p-[var(--spacing-md)]">
          <h3 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">Kategori populer</h3>

          {loading && <div className="h-40 animate-pulse bg-surface-container rounded-[var(--radius-md)]" />}

          {!loading && categories.length === 0 && (
            <p className="text-body-sm text-on-surface-variant">Belum ada barang di katalog.</p>
          )}

          <div className="flex flex-col gap-[var(--spacing-md)]">
            {categories.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-body-sm text-on-surface">{category.category}</span>
                  <span className="text-caption text-on-surface-variant">{category.count} barang</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${category.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-[var(--spacing-md)] lg:col-span-2 overflow-hidden">
          <div className="flex justify-between items-center mb-[var(--spacing-md)]">
            <h3 className="font-heading text-h3 text-on-surface">Transaksi terbaru</h3>
            <Link to="/admin/transactions" className="text-label-md text-primary hover:underline">
              Lihat semua
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-on-surface-variant text-body-sm">Memuat data...</div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-body-sm">Belum ada transaksi</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant">
                    <th className="pb-3 pr-4 font-medium text-label-md">Peminjam</th>
                    <th className="pb-3 pr-4 font-medium text-label-md">Barang</th>
                    <th className="pb-3 pr-4 font-medium text-label-md">Mulai</th>
                    <th className="pb-3 font-medium text-label-md">Status</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface text-body-sm">
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-outline-variant/40 hover:bg-surface-container transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold text-caption">
                            {(booking.customer_name || '?').charAt(0).toUpperCase()}
                          </span>
                          <span className="font-medium">{booking.customer_name || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-on-surface-variant">{booking.product_name || '-'}</td>
                      <td className="py-3 pr-4 text-on-surface-variant">{formatDate(booking.booking_date)}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-caption ${statusTone(booking.status)}`}>
                          {statusLabel(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
