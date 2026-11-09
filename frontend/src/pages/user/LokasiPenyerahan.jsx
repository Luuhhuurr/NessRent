import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { formatDate } from '../../lib/format';

export default function LokasiPenyerahan() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const fetchDeliveries = useCallback(async () => {
    const response = await bookingService.getOwnerDeliveries();
    return response?.data?.deliveries ?? [];
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const deliveries = await fetchDeliveries();
        setDeliveries(deliveries);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat data lokasi penyerahan.');
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchDeliveries]);

  const handleMarkDelivered = async (bookingId) => {
    setError(null);
    setNotice(null);
    try {
      await bookingService.deleteBooking(bookingId);
      setDeliveries((current) => current.filter((d) => d.id !== bookingId));
      setNotice(`Pesanan #${bookingId} ditandai sudah diserahkan.`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal menandai barang.');
    }
  };

  return (
    <>
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Lokasi penyerahan</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Barang milik Anda yang sedang disewa, beserta lokasi pengambilannya.
        </p>
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

      {!loading && deliveries.length === 0 && (
        <div className="panel p-[var(--spacing-xl)] text-center">
          <span className="material-symbols-outlined text-[56px] text-on-surface-variant mb-4">
            inventory_2
          </span>
          <h3 className="font-heading text-h3 text-on-surface mb-2">
            Belum ada barang yang perlu diserahkan
          </h3>
          <p className="text-body-md text-on-surface-variant mb-6">
            Belum ada barang milik Anda yang sedang disewa.
          </p>
          <Link
            to="/products"
            className="inline-flex px-4 py-2 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
          >
            Lihat katalog
          </Link>
        </div>
      )}

      {!loading && deliveries.length > 0 && (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Barang</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Penyewa</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Mulai</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant">Lokasi pengambilan</th>
                  <th className="py-3 px-4 text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-outline-variant/40 hover:bg-surface-container transition-colors"
                  >
                    <td className="py-3 px-4 text-body-sm text-on-surface font-medium">
                      {item.product_name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold text-caption">
                          {String(item.tenant_name || '?').charAt(0).toUpperCase()}
                        </span>
                        <span className="text-body-sm text-on-surface">{item.tenant_name || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-on-surface-variant">
                      {formatDate(item.booking_date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                          location_on
                        </span>
                        <span className="text-body-sm text-on-surface">
                          {item.pickup_location || item.notes || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleMarkDelivered(item.id)}
                        className="px-3 py-1.5 bg-surface-container text-on-surface text-label-md rounded-[var(--radius-md)] border border-outline-variant hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Sudah diserahkan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-outline-variant">
            <span className="text-caption text-on-surface-variant">
              Menampilkan {deliveries.length} item
            </span>
          </div>
        </div>
      )}
    </>
  );
}
