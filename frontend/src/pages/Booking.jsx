import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import BookingSummary from '../components/BookingSummary';
import { bookingService } from '../services/bookingService';
import { getUser } from '../lib/auth';
import { formatPrice, getProductImage } from '../lib/format';

const steps = ['Booking', 'Konfirmasi'];

const getMinDate = () => new Date().toISOString().slice(0, 10);

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return 0;
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

const readBookingInfo = () => {
  try {
    const stored = sessionStorage.getItem('bookingInfo');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export default function Booking() {
  const navigate = useNavigate();
  const [product] = useState(readBookingInfo);
  const [formData, setFormData] = useState(() => {
    const info = readBookingInfo();
    return {
      startDate: info?.startDate || getMinDate(),
      endDate: info?.endDate || '',
      notes: '',
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = getUser();

  useEffect(() => {
    if (!product) navigate('/products', { replace: true });
  }, [navigate, product]);

  const duration = calculateDuration(formData.startDate, formData.endDate);
  // Prices live in thousands of rupiah everywhere, matching the database.
  const totalPrice = product ? product.pricePerDay * duration : 0;

  const dateError =
    formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)
      ? 'Tanggal selesai harus setelah tanggal mulai.'
      : null;
  const visibleError = error || dateError;

  const handleContinue = async () => {
    if (!product || duration === 0) {
      setError('Silakan pilih tanggal yang valid.');
      return;
    }
    if (!user) {
      navigate('/login', { state: { from: '/booking' } });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await bookingService.createBooking({
        product_id: product.productId,
        booking_date: formData.startDate,
        end_date: formData.endDate,
        notes: formData.notes,
      });

      if (response?.success) {
        sessionStorage.setItem(
          'lastBooking',
          JSON.stringify({
            ...response.data,
            product_name: product.productName,
            product_image: product.productImage,
            price_per_day: product.pricePerDay,
            pickup_location: formData.notes,
            start_date: formData.startDate,
            end_date: formData.endDate,
            total_price: totalPrice,
            duration,
          })
        );
        navigate('/booking-success');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center">
        <span className="material-symbols-outlined text-[56px] text-on-surface-variant animate-spin">
          progress_activity
        </span>
        <p className="text-body-md text-on-surface-variant mt-4">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
      <div className="mb-[var(--spacing-lg)]">
        <nav aria-label="Breadcrumb" className="flex items-center text-on-surface-variant text-caption mb-[var(--spacing-sm)] flex-wrap gap-1">
          <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">Barang</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to={`/products/${product.productId}`} className="hover:text-primary transition-colors">Detail</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Booking</span>
        </nav>
        <h1 className="font-heading text-h2 text-on-surface">Booking Barang</h1>
      </div>

      <StepIndicator currentStep={1} steps={steps} />

      {visibleError && (
        <div className="rounded-[var(--radius-md)] bg-error-container/40 border border-error/30 p-3 mb-[var(--spacing-md)] flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-[20px]">error</span>
          <p className="text-body-sm text-on-error-container">{visibleError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)] items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <section className="panel p-[var(--spacing-md)]">
            <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">Detail Booking</h2>

            <div className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-outline-variant bg-surface-container mb-[var(--spacing-lg)]">
              <img
                src={getProductImage(product.productImage)}
                alt={product.productName}
                className="w-20 h-20 object-cover rounded-[var(--radius-md)] bg-surface-container-high"
              />
              <div className="min-w-0">
                <h3 className="text-body-lg text-on-surface mb-1">{product.productName}</h3>
                <p className="text-body-md text-on-surface font-semibold">
                  {formatPrice(product.pricePerDay)} / hari
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)] mb-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface-variant" htmlFor="startDate">
                  Tanggal mulai
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={getMinDate()}
                  className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-on-surface text-body-sm focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors outline-none"
                />
              </div>
              <div className="flex flex-col gap-[var(--spacing-xs)]">
                <label className="text-label-md text-on-surface-variant" htmlFor="endDate">
                  Tanggal selesai
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  className="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-on-surface text-body-sm focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors outline-none"
                />
              </div>
            </div>

            <div
              className={`rounded-[var(--radius-md)] p-[var(--spacing-sm)] flex items-center gap-2 mb-[var(--spacing-lg)] border ${
                duration > 0
                  ? 'bg-primary-container/40 border-primary/25'
                  : 'bg-surface-container border-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
              <span className="text-label-md text-on-surface">
                Total sewa: <span className="font-bold">{duration} hari</span>
              </span>
              {duration > 0 && (
                <span className="ml-auto text-label-md text-on-surface font-semibold">
                  {formatPrice(totalPrice)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <label className="text-label-md text-on-surface-variant flex justify-between" htmlFor="notes">
                Lokasi pengambilan
                <span className="text-caption font-normal">(Opsional)</span>
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Contoh: di depan FIK, sekitar kampus UNNES, atau depan Gang Kalisegoro."
                rows={3}
                className="w-full p-3 bg-surface-container border border-outline-variant rounded-[var(--radius-md)] text-on-surface text-body-sm placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors outline-none resize-none"
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <BookingSummary
            items={[
              {
                name: `Sewa ${product.productName} (${duration} hari)`,
                price: product.pricePerDay,
                quantity: duration,
              },
            ]}
            total={totalPrice}
            onContinue={handleContinue}
            continueLabel={loading ? 'Memproses...' : 'Lanjutkan booking'}
            disabled={loading || duration === 0}
          />
        </div>
      </div>
    </div>
  );
}
