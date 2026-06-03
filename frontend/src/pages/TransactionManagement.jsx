import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-primary-container/20', text: 'text-on-primary-container', border: 'border-primary-container' },
  approved: { label: 'Disetujui', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  completed: { label: 'Selesai', bg: 'bg-surface-variant', text: 'text-on-surface-variant', border: 'border-surface-variant' },
  cancelled: { label: 'Dibatalkan', bg: 'bg-surface-variant', text: 'text-on-surface-variant', border: 'border-surface-variant' },
};

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Rp 0';
  const num = (typeof price === 'number' ? price : parseFloat(price) || 0) * 1000;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusFilters = [
  { key: '', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Disetujui' },
  { key: 'rejected', label: 'Ditolak' },
  { key: 'completed', label: 'Selesai' },
];

export default function TransactionManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchBookings(statusFilter);
  }, []);

  const fetchBookings = async (currentStatus) => {
  setLoading(true);
  console.log('%c====================================', 'color: #ff0055; font-weight: bold;');
  console.log('%c[DIAGNOSTIC] STARTING FETCH', 'color: #00ffcc; font-weight: bold;');

  // CAPTURE THE EXACT PARAMETER PASSED - never trust defaults!
  console.log('[DIAGNOSTIC] currentStatus ARGUMENT received:', JSON.stringify(currentStatus));
  console.log('[DIAGNOSTIC] currentStatus TYPE:', typeof currentStatus);
  console.log('[DIAGNOSTIC] currentStatus is TRUTHY?:', Boolean(currentStatus));

  // If argument was falsy, check what the state is
  if (!currentStatus) {
    console.log('[DIAGNOSTIC] ⚠️ currentStatus is falsy! Falling back to statusFilter state.');
    currentStatus = statusFilter;
    console.log('[DIAGNOSTIC] After fallback, currentStatus now:', JSON.stringify(currentStatus));
  }

  const effectiveStatus = currentStatus;
  console.log('[DIAGNOSTIC] FINAL effectiveStatus to use:', JSON.stringify(effectiveStatus));

  try {
    const params = { limit: 50 };
    if (effectiveStatus) {
      params.status = effectiveStatus;
    }

    console.log('[fetchBookings] Calling API with params:', params);
    const response = await bookingService.getAllBookings(params);

    // ============================================================
    // SAFE ARRAY EXTRACTION from various response shapes
    // Backend sends: { success: true, data: { bookings: [...] } }
    // bookingService returns: axios response.data (the parsed body)
    // ============================================================
    console.log('[fetchBookings] Full response object keys:', Object.keys(response || {}));

    let extractedBookings = [];

    // Check each possible path and log results
    if (response && response.data && Array.isArray(response.data.bookings)) {
      console.log('[fetchBookings] Found array at: response.data.bookings');
      extractedBookings = response.data.bookings;
    } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
      console.log('[fetchBookings] Found array at: response.data.data');
      extractedBookings = response.data.data;
    } else if (response && response.data && Array.isArray(response.data)) {
      console.log('[fetchBookings] Found array at: response.data (direct)');
      extractedBookings = response.data;
    } else if (response && response.bookings && Array.isArray(response.bookings)) {
      console.log('[fetchBookings] Found array at: response.bookings');
      extractedBookings = response.bookings;
    } else if (response && Array.isArray(response)) {
      console.log('[fetchBookings] Found array at: response (direct)');
      extractedBookings = response;
    } else {
      console.log('[fetchBookings] WARNING: Could not find array! Logging full response:');
      console.log('[fetchBookings] response:', JSON.stringify(response, null, 2));
    }

    console.log('[fetchBookings] SUCCESS! Extracted Rows Count:', extractedBookings.length);
    if (extractedBookings.length > 0) {
      console.log('[fetchBookings] First item keys:', Object.keys(extractedBookings[0]));
      console.log('[fetchBookings] First item:', extractedBookings[0]);
    }

    setBookings(extractedBookings);
  } catch (err) {
    console.error('%c[DIAGNOSTIC] CRITICAL API ERROR:', 'color: #ff0000; font-weight: bold;', err);
    console.log('[DIAGNOSTIC] Error Response Data:', err.response?.data);
    setBookings([]);
  } finally {
    setLoading(false);
    console.log('%c[DIAGNOSTIC] ENDING FETCH', 'color: #00ffcc; font-weight: bold;');
    console.log('%c====================================', 'color: #ff0055; font-weight: bold;');
  }
};

  const handleTabChange = (statusKey) => {
    console.log('[handleTabChange] Switching to status:', statusKey);
    setStatusFilter(statusKey);
    setActiveFilter(statusFilters.find(f => f.key === statusKey)?.label || statusKey);
    fetchBookings(statusKey);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    console.log('>>>====================================');
    console.log('>>> [handleUpdateStatus] FUNCTION CALLED!');
    console.log('>>> [handleUpdateStatus] bookingId:', bookingId, '| Type:', typeof bookingId);
    console.log('>>> [handleUpdateStatus] newStatus:', newStatus);
    console.log('>>> [handleUpdateStatus] selectedBooking:', selectedBooking);

    if (!bookingId) {
      console.error('>>> [handleUpdateStatus] ERROR: bookingId is undefined or null!');
      alert('Error: Booking ID not found');
      return;
    }

    if (!selectedBooking) {
      console.error('>>> [handleUpdateStatus] ERROR: selectedBooking is null!');
      alert('Error: No booking selected');
      return;
    }

    try {
      console.log('>>> [handleUpdateStatus] Calling bookingService.updateBookingStatus...');
      const response = await bookingService.updateBookingStatus(bookingId, newStatus);
      console.log('>>> [handleUpdateStatus] API SUCCESS! Response:', response);

      // ============================================================
      // CRITICAL: Force React to re-fetch the latest bookings
      // based on the currently active tab filter
      // ============================================================
      console.log('>>> [handleUpdateStatus] Re-fetching bookings with current statusFilter:', statusFilter);
      await fetchBookings(statusFilter);

      // Close the detail sidebar/modal so user sees the refreshed table
      console.log('>>> [handleUpdateStatus] Closing detail panel...');
      setSelectedBooking(null);

      // Show success message
      alert(`Status transaksi berhasil diperbarui menjadi: ${newStatus}`);
      console.log('>>> [handleUpdateStatus] COMPLETE! UI should now show updated data.');
    } catch (err) {
      console.error('>>> [handleUpdateStatus] CRITICAL ERROR:', err);
      alert('Gagal mengupdate status: ' + (err.response?.data?.message || err.message));
    }
    console.log('>>>====================================');
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchTerm = searchQuery?.toLowerCase().trim();
    if (!searchTerm) return true; // If search bar is empty, allow ALL records!

    // Use the correct properties returned by our backend SQL query
    // Backend maps: u.name as customer_name, u.nim as customer_nim, p.product_name
    const userName = booking.customer_name || booking.user_name || booking.name || '';
    const productName = booking.product_name || '';
    const userNim = booking.customer_nim || booking.nim || '';
    const bookingId = booking.id?.toString() || '';

    return userName.toLowerCase().includes(searchTerm) ||
           productName.toLowerCase().includes(searchTerm) ||
           userNim.toString().includes(searchTerm) ||
           bookingId.includes(searchTerm);
  });

  const getStatusConfig = (status) => statusConfig[status] || statusConfig.pending;

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface flex justify-between items-center px-[var(--spacing-md)] py-[var(--spacing-xs)] w-full sticky top-0 z-40">
        <div className="flex items-center gap-[var(--spacing-md)] flex-1">
          <div className="relative w-full max-w-md hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama user / barang..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-container-highest rounded-[var(--radius-lg)] text-on-surface focus:ring-2 focus:ring-primary-container focus:outline-none transition-shadow text-body-md"
            />
          </div>
        </div>
        <div className="flex items-center gap-[var(--spacing-md)]">
          <button className="text-on-surface-variant hover:bg-primary-container/10 p-[var(--spacing-base)] rounded-full transition-colors flex items-center justify-center focus:ring-2 focus:ring-primary-container outline-none">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:bg-primary-container/10 p-[var(--spacing-base)] rounded-full transition-colors flex items-center justify-center focus:ring-2 focus:ring-primary-container outline-none">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden cursor-pointer hover:ring-2 ring-primary-container transition-all ml-2">
            <img
              alt="Administrator profile"
              src="https://lh3.googleusercontent.com/aida/ADBb0uhpdApwkfHA_CWRdIaecUXwpQ2S5SNlK8rIaaRXqn-7Q8bNAJcZyqIxZ0d0MsuJg_oRISJ1oCrcFVspLaDNzVIKfinL9ZJkz7LCeFg70KJmifcSGMccGVGXwoXkhidpEbZbZypdsylLJmOfET7EDrlQ2gqkpynWpKgF0WPTI5xVMoz4c-VAqXJaOpGWAzCKx0y1gRUhxWfUgc3bicLKP5cb2LrG2pOERNyxZEIih6INxPL_ZMyuU3xeISlVYSK9T0gCxpanjXVlDuQ"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-[var(--spacing-md)] pb-[var(--spacing-xl)] min-h-[calc(100vh-80px)] flex gap-[var(--spacing-lg)]">
        {/* Left Column: Table */}
        <div className="flex-1 flex flex-col gap-[var(--spacing-lg)]">
          {/* Page Header */}
          <div>
            <h1 className="font-heading text-h1 text-on-surface">Manajemen Transaksi</h1>
            <p className="text-body-lg text-secondary mt-2">Kelola semua booking penyewaan</p>
          </div>

          {/* Filters & Controls */}
          <div className="flex flex-col sm:flex-row gap-[var(--spacing-md)] items-end justify-between">
            <div className="flex items-center gap-[var(--spacing-sm)] bg-surface-container-lowest p-1 rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] border border-surface-variant w-full sm:w-auto overflow-x-auto">
              {statusFilters.map((filter, index) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    console.log('[TAB CLICK] index:', index, '| filter.key:', filter.key, '| filter.label:', filter.label);
                    handleTabChange(filter.key);
                  }}
                  className={`px-[var(--spacing-md)] py-2 rounded-[var(--radius-lg)] text-label-md transition-colors whitespace-nowrap ${
                    activeFilter === filter.label
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-surface-container-lowest rounded-[var(--radius-2xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] overflow-hidden hover:shadow-[0_12px_32px_rgba(31,41,55,0.08)] transition-shadow border border-surface-variant/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-variant bg-surface-container-low/50">
                    <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-on-surface-variant whitespace-nowrap">Nama User</th>
                    <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-on-surface-variant whitespace-nowrap">Barang</th>
                    <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-on-surface-variant whitespace-nowrap">Tanggal Sewa</th>
                    <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-on-surface-variant whitespace-nowrap">Total Harga</th>
                    <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-on-surface-variant whitespace-nowrap">Status</th>
                    <th className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-md text-on-surface-variant text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-body-md text-on-surface">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center text-on-surface-variant">Memuat...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center text-error">{error}</td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center text-on-surface-variant">Tidak ada transaksi</td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => {
                      const statusInfo = getStatusConfig(booking.status);
                      return (
                        <tr
                          key={booking.id}
                          className={`border-b border-surface-variant/50 hover:bg-surface-container-low/30 transition-colors cursor-pointer ${
                            selectedBooking?.id === booking.id ? 'bg-primary-container/5' : ''
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] whitespace-nowrap">
                            <span className="font-medium text-on-surface">{booking.customer_name || 'User #' + booking.user_id}</span>
                          </td>
                          <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] whitespace-nowrap">{booking.product_name || '-'}</td>
                          <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-secondary whitespace-nowrap">
                            {formatDate(booking.start_date || booking.booking_date)}
                          </td>
                          <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-medium whitespace-nowrap">
                            {formatPrice(booking.total_price || booking.price)}
                          </td>
                          <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption font-caption ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 rounded-[var(--radius-lg)] text-on-surface hover:bg-surface-container hover:text-primary transition-colors"
                                onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                              >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-[var(--spacing-md)] py-[var(--spacing-sm)] border-t border-surface-variant bg-surface-container-lowest flex items-center justify-between">
              <span className="text-caption text-secondary">
                Menampilkan 1-{filteredBookings.length} dari {bookings.length} transaksi
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        {selectedBooking && (
          <aside className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-[var(--radius-2xl)] shadow-[0_12px_32px_rgba(31,41,55,0.08)] border border-surface-variant p-[var(--spacing-md)] sticky top-24 flex flex-col gap-[var(--spacing-md)]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-surface-variant pb-[var(--spacing-sm)]">
                <h3 className="font-heading text-h3 text-on-surface">Detail Booking</h3>
                <button
                  className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors"
                  onClick={() => setSelectedBooking(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Status Timeline */}
              <div className="py-[var(--spacing-sm)]">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary-container border-2 border-primary-container"></div>
                    <div className="w-0.5 h-6 bg-surface-variant"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-label-md text-on-surface">Pending</p>
                    <p className="text-caption text-secondary">{formatDate(selectedBooking.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      ['approved', 'completed'].includes(selectedBooking.status)
                        ? 'bg-green-500 border-green-500'
                        : 'bg-surface-container-highest border-surface-variant'
                    }`}></div>
                    <div className="w-0.5 h-6 bg-surface-variant opacity-50"></div>
                  </div>
                  <div className="pb-6">
                    <p className={`text-label-md ${['approved', 'completed'].includes(selectedBooking.status) ? 'text-on-surface' : 'text-secondary'}`}>Disetujui</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedBooking.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : 'bg-surface-container-highest border-surface-variant'
                    }`}></div>
                  </div>
                  <div>
                    <p className={`text-label-md ${selectedBooking.status === 'completed' ? 'text-on-surface' : 'text-secondary'}`}>Selesai</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-surface-container-low rounded-[var(--radius-xl)] p-[var(--spacing-sm)] flex items-center gap-[var(--spacing-md)]">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">person</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{selectedBooking.customer_name || 'User'}</p>
                  <p className="text-caption text-secondary">NIM: {selectedBooking.customer_nim || '-'}</p>
                </div>
              </div>

              {/* Rental Info */}
              <div className="flex flex-col gap-[var(--spacing-sm)]">
                <h4 className="text-label-md text-on-surface border-b border-surface-variant pb-1">Informasi Sewa</h4>
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-secondary">Barang</span>
                  <span className="font-medium text-on-surface">{selectedBooking.product_name || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-secondary">Tanggal</span>
                  <span className="font-medium text-on-surface">{formatDate(selectedBooking.start_date || selectedBooking.booking_date)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-surface-variant border-dashed">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-body-md text-secondary">Biaya Sewa</span>
                    <span className="font-medium text-on-surface">{formatPrice(selectedBooking.total_price || selectedBooking.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-surface-variant">
                    <span className="text-label-md text-on-surface">Total Biaya</span>
                    <span className="font-heading text-h3 text-primary">{formatPrice(selectedBooking.total_price || selectedBooking.price)}</span>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Catatan Admin</label>
                <textarea
                  className="w-full p-[var(--spacing-sm)] rounded-[var(--radius-xl)] border border-surface-variant bg-surface-container-lowest text-on-surface text-body-md focus:ring-2 focus:ring-primary-container focus:outline-none transition-shadow resize-none h-20"
                  placeholder="Tambahkan catatan jika perlu..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Actions - Status: {selectedBooking.status} */}
              <div className="flex flex-col gap-2 pt-[var(--spacing-md)] border-t border-surface-variant">
                {selectedBooking.status?.trim() === 'pending' && (
                  <>
                    <button
                      className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-label-md font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                      onClick={() => {
                        console.log('[JSX] Setujui button clicked! selectedBooking.id:', selectedBooking.id);
                        handleUpdateStatus(selectedBooking.id, 'approved');
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      Setujui Booking
                    </button>
                    <button
                      className="w-full py-3 rounded-xl bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 text-label-md font-semibold transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        console.log('[JSX] Tolak button clicked! selectedBooking.id:', selectedBooking.id);
                        handleUpdateStatus(selectedBooking.id, 'rejected');
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">cancel</span>
                      Tolak Booking
                    </button>
                  </>
                )}
                {selectedBooking.status?.trim() === 'approved' && (
                  <button
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-label-md font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    onClick={() => {
                      console.log('[JSX] Selesai button clicked! selectedBooking.id:', selectedBooking.id);
                      handleUpdateStatus(selectedBooking.id, 'completed');
                    }}
                  >
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    Tandai Selesai
                  </button>
                )}
                {(selectedBooking.status?.trim() === 'completed' || selectedBooking.status?.trim() === 'rejected' || selectedBooking.status?.trim() === 'cancelled') && (
                  <p className="text-center text-on-surface-variant text-body-md py-3">Transaksi sudah selesai diproses</p>
                )}
              </div>
            </div>
          </aside>
        )}
      </main>
    </>
  );
}
