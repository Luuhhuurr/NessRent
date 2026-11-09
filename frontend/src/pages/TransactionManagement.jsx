import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { formatPrice, formatDate, statusLabel, statusTone } from '../lib/format';

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
];

const STATUS_FLOW = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'completed', label: 'Selesai' },
];

export default function TransactionManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchBookings = useCallback(async () => {
    const params = { limit: 50 };
    if (statusFilter) params.status = statusFilter;

    const response = await bookingService.getAllBookings(params);
    return response?.data?.bookings ?? [];
  }, [statusFilter]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setBookings(await fetchBookings());
      } catch (err) {
        setBookings([]);
        setError(err?.response?.data?.message || 'Gagal memuat daftar transaksi.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchBookings, reloadKey]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionError(null);
    setActionMessage(null);
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      setReloadKey((key) => key + 1);
      setSelectedBooking(null);
      setActionMessage(`Status transaksi #${bookingId} diubah menjadi ${statusLabel(newStatus)}.`);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Gagal mengubah status transaksi.');
    }
  };

  const handleDelete = async (bookingId) => {
    setActionError(null);
    setActionMessage(null);
    try {
      await bookingService.deleteBooking(bookingId);
      setReloadKey((key) => key + 1);
      setSelectedBooking(null);
      setActionMessage(`Transaksi #${bookingId} berhasil dihapus.`);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Gagal menghapus transaksi.');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;

    return (
      String(booking.customer_name ?? '').toLowerCase().includes(term) ||
      String(booking.customer_nim ?? '').includes(term) ||
      String(booking.product_name ?? '').toLowerCase().includes(term) ||
      String(booking.id).includes(term)
    );
  });

  const selectedStage = STATUS_FLOW.findIndex((stage) => stage.value === selectedBooking?.status);

  return (
    <>
      <div className="mb-[var(--spacing-lg)]">
        <h1 className="font-heading text-h2 text-on-surface">Manajemen transaksi</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Tinjau, setujui, dan selesaikan booking dari mahasiswa.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] md:items-center justify-between mb-[var(--spacing-md)]">
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari peminjam atau barang..."
            className="w-full pl-10 pr-3 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-[var(--spacing-xs)] overflow-x-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value || 'all'}
              onClick={() => setStatusFilter(filter.value)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-label-md transition-colors ${
                statusFilter === filter.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-[var(--radius-md)] bg-success-container/40 border border-success/25 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
          <p className="text-body-sm text-on-success-container">{actionMessage}</p>
        </div>
      )}

      {actionError && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{actionError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-[var(--spacing-lg)]">
        <div className="xl:col-span-3 panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-[var(--spacing-md)] py-3 text-label-md text-on-surface-variant whitespace-nowrap">Peminjam</th>
                  <th className="px-[var(--spacing-md)] py-3 text-label-md text-on-surface-variant whitespace-nowrap">Barang</th>
                  <th className="px-[var(--spacing-md)] py-3 text-label-md text-on-surface-variant whitespace-nowrap">Mulai</th>
                  <th className="px-[var(--spacing-md)] py-3 text-label-md text-on-surface-variant whitespace-nowrap">Total</th>
                  <th className="px-[var(--spacing-md)] py-3 text-label-md text-on-surface-variant whitespace-nowrap">Status</th>
                  <th className="px-[var(--spacing-md)] py-3 text-label-md text-on-surface-variant text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-body-sm text-on-surface">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-[var(--spacing-md)] py-10 text-center text-on-surface-variant">
                      Memuat...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-[var(--spacing-md)] py-10 text-center text-error">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-[var(--spacing-md)] py-10 text-center text-on-surface-variant">
                      Tidak ada transaksi
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`border-b border-outline-variant/40 hover:bg-surface-container transition-colors cursor-pointer ${
                        selectedBooking?.id === booking.id ? 'bg-surface-container' : ''
                      }`}
                    >
                      <td className="px-[var(--spacing-md)] py-3 whitespace-nowrap">
                        <span className="font-medium">{booking.customer_name || `User #${booking.user_id}`}</span>
                        {booking.customer_nim && (
                          <span className="block text-caption text-on-surface-variant">{booking.customer_nim}</span>
                        )}
                      </td>
                      <td className="px-[var(--spacing-md)] py-3 whitespace-nowrap">
                        {booking.product_name || '-'}
                      </td>
                      <td className="px-[var(--spacing-md)] py-3 whitespace-nowrap text-on-surface-variant">
                        {formatDate(booking.booking_date)}
                      </td>
                      <td className="px-[var(--spacing-md)] py-3 whitespace-nowrap font-medium">
                        {formatPrice(booking.total_price)}
                      </td>
                      <td className="px-[var(--spacing-md)] py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-caption ${statusTone(booking.status)}`}>
                          {statusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="px-[var(--spacing-md)] py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            aria-label="Lihat detail"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(booking);
                            }}
                            className="p-1.5 rounded-[var(--radius-md)] text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          {['completed', 'rejected', 'cancelled'].includes(booking.status) && (
                            <button
                              type="button"
                              aria-label="Hapus transaksi"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(booking.id);
                              }}
                              className="p-1.5 rounded-[var(--radius-md)] text-error hover:bg-error-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="px-[var(--spacing-md)] py-3 border-t border-outline-variant flex items-center justify-between">
            <span className="text-caption text-on-surface-variant">
              Menampilkan {filteredBookings.length} dari {bookings.length} transaksi
            </span>
          </div>
        </div>

        {selectedBooking && (
          <aside className="xl:col-span-1">
            <div className="panel p-[var(--spacing-md)] sticky top-24 flex flex-col gap-[var(--spacing-md)]">
              <div className="flex items-center justify-between border-b border-outline-variant pb-[var(--spacing-sm)]">
                <h3 className="font-heading text-h3 text-on-surface">Detail booking</h3>
                <button
                  type="button"
                  aria-label="Tutup detail"
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {STATUS_FLOW.map((stage, index) => {
                  const reached = selectedStage >= index;
                  return (
                    <div key={stage.value} className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          reached ? 'bg-primary' : 'bg-outline-variant'
                        }`}
                      />
                      <span
                        className={`text-body-sm ${reached ? 'text-on-surface' : 'text-on-surface-variant'}`}
                      >
                        {stage.label}
                      </span>
                      {index === 0 && (
                        <span className="text-caption text-on-surface-variant ml-auto">
                          {formatDate(selectedBooking.created_at)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[var(--radius-md)] bg-surface-container p-[var(--spacing-sm)] flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <div className="min-w-0">
                  <p className="text-body-sm text-on-surface truncate">
                    {selectedBooking.customer_name || 'Peminjam'}
                  </p>
                  <p className="text-caption text-on-surface-variant">
                    NIM: {selectedBooking.customer_nim || '-'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-label-md text-on-surface border-b border-outline-variant pb-1">Informasi sewa</h4>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-body-sm text-on-surface-variant">Barang</span>
                  <span className="text-body-sm text-on-surface text-right">
                    {selectedBooking.product_name || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-body-sm text-on-surface-variant">Periode</span>
                  <span className="text-body-sm text-on-surface text-right">
                    {formatDate(selectedBooking.booking_date)} — {formatDate(selectedBooking.end_date)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-body-sm text-on-surface-variant">Lokasi</span>
                  <span className="text-body-sm text-on-surface text-right">
                    {selectedBooking.notes || '-'}
                  </span>
                </div>
                <div className="border-t border-outline-variant pt-2 flex justify-between items-baseline">
                  <span className="text-label-md text-on-surface">Total biaya</span>
                  <span className="font-heading text-h3 text-on-surface">
                    {formatPrice(selectedBooking.total_price)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-[var(--spacing-sm)] border-t border-outline-variant">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'approved')}
                      className="w-full py-2.5 rounded-[var(--radius-md)] bg-primary text-on-primary text-label-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Setujui booking
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'rejected')}
                      className="w-full py-2.5 rounded-[var(--radius-md)] border border-error text-error text-label-md font-semibold hover:bg-error-container transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      Tolak booking
                    </button>
                  </>
                )}

                {selectedBooking.status === 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                    className="w-full py-2.5 rounded-[var(--radius-md)] bg-primary text-on-primary text-label-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    Tandai selesai
                  </button>
                )}

                {['completed', 'rejected', 'cancelled'].includes(selectedBooking.status) && (
                  <p className="text-center text-body-sm text-on-surface-variant py-2">
                    Transaksi ini sudah diproses.
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
