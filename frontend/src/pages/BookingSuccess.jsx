import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatPrice, formatDate, getProductImage } from '../lib/format';

const termsContent = [
  {
    title: '1. Kewajiban penyewa:',
    text: 'Penyewa wajib menjaga kondisi barang, tidak meminjamkannya kepada pihak ketiga, dan menggunakannya sesuai ketentuan. Penyewa harus menunjukkan identitas mahasiswa yang masih berlaku.',
  },
  {
    title: '2. Ketentuan pengembalian:',
    text: 'Barang harus dikembalikan pada waktu dan lokasi yang telah disepakati. Keterlambatan dikenakan denda sesuai ketentuan.',
  },
  {
    title: '3. Denda:',
    text: 'Keterlambatan pengembalian dikenakan denda sebesar 10% dari tarif harian per jam.',
  },
  {
    title: '4. Kerusakan:',
    text: 'Segala bentuk kerusakan yang terjadi selama masa sewa menjadi tanggung jawab penuh penyewa.',
  },
];

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState('');
  const [bookingData] = useState(() => {
    try {
      const stored = sessionStorage.getItem('lastBooking');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState(null);

  const handleConfirm = () => {
    if (!agreedToTerms || !signature.trim()) {
      setError('Setujui syarat dan ketentuan, lalu isi tanda tangan digital Anda.');
      return;
    }
    sessionStorage.removeItem('lastBooking');
    navigate('/history');
  };

  if (!bookingData) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center">
        <span className="material-symbols-outlined text-[56px] text-on-surface-variant animate-spin">
          progress_activity
        </span>
        <p className="text-body-md text-on-surface-variant mt-4">Memuat data booking...</p>
      </div>
    );
  }

  const duration = bookingData.duration || 1;
  const pricePerDay = bookingData.price_per_day || 0;
  const total = pricePerDay * duration;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
      <div className="mb-[var(--spacing-lg)]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-caption text-on-surface-variant mb-[var(--spacing-sm)]">
          <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/booking" className="hover:text-primary transition-colors">Booking</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Konfirmasi</span>
        </nav>
        <h1 className="font-heading text-h2 text-on-surface">Konfirmasi booking</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Langkah 2 dari 2: tinjau dan konfirmasi detail penyewaan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
        <div className="lg:col-span-8 flex flex-col gap-[var(--spacing-lg)]">
          <section className="panel p-[var(--spacing-md)]">
            <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">inventory_2</span>
              Detail penyewaan
            </h2>

            <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] items-start">
              <div className="w-full md:w-1/3 aspect-[1.5] rounded-[var(--radius-md)] overflow-hidden flex-shrink-0 bg-surface-container">
                <img
                  src={getProductImage(bookingData.product_image || bookingData.image_url)}
                  alt={bookingData.product_name || 'Barang'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-2/3 flex flex-col gap-[var(--spacing-sm)]">
                <div>
                  <h3 className="text-body-lg font-semibold text-on-surface">{bookingData.product_name}</h3>
                  <p className="text-caption text-on-surface-variant mt-1">
                    {pricePerDay ? `${formatPrice(pricePerDay)} / hari` : '-'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-sm)] pt-[var(--spacing-sm)] border-t border-outline-variant">
                  <div>
                    <p className="text-caption text-on-surface-variant">Tanggal pengambilan</p>
                    <p className="text-body-sm text-on-surface font-medium">
                      {formatDate(bookingData.start_date || bookingData.booking_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-on-surface-variant">Tanggal pengembalian</p>
                    <p className="text-body-sm text-on-surface font-medium">{formatDate(bookingData.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-caption text-on-surface-variant">Durasi</p>
                    <p className="text-body-sm text-on-surface font-medium">{duration} hari</p>
                  </div>
                  <div>
                    <p className="text-caption text-on-surface-variant">Lokasi pengambilan</p>
                    <p className="text-body-sm text-on-surface font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                      {bookingData.pickup_location || bookingData.notes || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel p-[var(--spacing-md)]">
            <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)] flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">gavel</span>
              Syarat &amp; ketentuan
            </h2>

            <div className="rounded-[var(--radius-md)] bg-surface-container border border-outline-variant p-[var(--spacing-sm)] max-h-52 overflow-y-auto mb-[var(--spacing-md)] text-caption text-on-surface-variant flex flex-col gap-2">
              {termsContent.map((term) => (
                <p key={term.title}>
                  <strong className="text-on-surface">{term.title}</strong> {term.text}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-[var(--spacing-md)]">
              <label className="flex items-start gap-[var(--spacing-sm)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setError(null);
                  }}
                  className="mt-1 w-4 h-4 rounded border-outline-variant accent-primary focus:ring-primary/25"
                />
                <span className="text-body-sm text-on-surface">
                  Saya telah membaca dan menyetujui syarat dan ketentuan yang berlaku untuk penyewaan ini.
                </span>
              </label>

              <div>
                <label className="block text-label-md text-on-surface mb-[var(--spacing-xs)]" htmlFor="signature">
                  Tanda tangan digital (ketik nama lengkap Anda)
                </label>
                <input
                  id="signature"
                  type="text"
                  value={signature}
                  onChange={(e) => {
                    setSignature(e.target.value);
                    setError(null);
                  }}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-surface-container border border-outline-variant rounded-[var(--radius-md)] p-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none transition-colors"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 panel p-[var(--spacing-md)]">
            <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">Ringkasan pembayaran</h2>

            <div className="flex flex-col gap-2 text-body-sm mb-[var(--spacing-md)] border-b border-outline-variant pb-[var(--spacing-md)]">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Biaya sewa ({duration} hari)</span>
                <span className="text-on-surface">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-[var(--spacing-md)]">
              <span className="text-label-md text-on-surface-variant">Total pembayaran</span>
              <span className="font-heading text-h2 text-on-surface">{formatPrice(total)}</span>
            </div>

            {error && (
              <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-2.5 mb-[var(--spacing-sm)] flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <p className="text-caption text-on-error-container">{error}</p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!agreedToTerms || !signature.trim()}
              className="w-full bg-primary text-on-primary text-label-md py-2.5 px-[var(--spacing-md)] rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Konfirmasi &amp; kirim booking
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <p className="text-caption text-center text-on-surface-variant mt-[var(--spacing-sm)]">
              Anda akan diarahkan ke halaman riwayat transaksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
