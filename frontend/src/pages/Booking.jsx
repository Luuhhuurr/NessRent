import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';
import BookingSummary from '../components/BookingSummary';
import { bookingService } from '../services/bookingService';
import { getUserFromStorage } from '../components/ProtectedRoute';

const steps = ['Booking', 'Konfirmasi'];

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Rp 0';
  const num = (typeof price === 'number' ? price : parseFloat(price) || 0) * 1000;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Get minimum date (today)
const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: getMinDate(),
    endDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = getUserFromStorage();

  // Get product from session storage
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProduct = sessionStorage.getItem('bookingInfo');
    if (!storedProduct) {
      // No product selected, redirect to products
      navigate('/products');
      return;
    }
    setProduct(JSON.parse(storedProduct));
  }, [navigate]);

  // Calculate duration
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const duration = calculateDuration();
  const deposit = 50000;
  const totalPrice = product ? product.pricePerDay * duration * 1000 : 0;

  // Validate dates
  useEffect(() => {
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('Tanggal selesai harus setelah tanggal mulai');
    } else {
      setError(null);
    }
  }, [formData.startDate, formData.endDate]);

  const handleContinue = async () => {
    if (!product || duration === 0) {
      setError('Silakan pilih tanggal yang valid');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        product_id: product.productId,
        booking_date: formData.startDate,
      };

      const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        // Clear stored product and navigate to success
        sessionStorage.removeItem('bookingInfo');
        sessionStorage.setItem('lastBooking', JSON.stringify(response.data));
        navigate('/booking-success');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex-grow pt-24 pb-[var(--spacing-xl)] px-[var(--spacing-md)] max-w-[1280px] mx-auto w-full">
        <div className="text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant animate-spin">progress_activity</span>
          <p className="text-body-md text-on-surface-variant mt-4">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow pt-24 pb-[var(--spacing-xl)] px-[var(--spacing-md)] max-w-[1280px] mx-auto w-full">
      {/* Breadcrumb & Title */}
      <div className="mb-[var(--spacing-lg)]">
        <nav aria-label="Breadcrumb" className="flex items-center text-on-surface-variant text-caption mb-[var(--spacing-xs)] flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[16px] mx-xs">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">Barang</Link>
          <span className="material-symbols-outlined text-[16px] mx-xs">chevron_right</span>
          <Link to={`/products/${product.productId}`} className="hover:text-primary transition-colors">Detail</Link>
          <span className="material-symbols-outlined text-[16px] mx-xs">chevron_right</span>
          <span className="text-on-surface font-semibold">Booking</span>
        </nav>
        <h1 className="font-heading text-h2 text-on-surface">Booking Barang</h1>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={1} steps={steps} />

      {/* Error Alert */}
      {error && (
        <div className="bg-error-container/20 border border-error-container/50 rounded-[var(--radius-lg)] p-4 mb-[var(--spacing-md)] flex items-center gap-[var(--spacing-xs)]">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
            error
          </span>
          <p className="text-body-sm text-error">{error}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)] items-start">
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-[var(--spacing-lg)]">
          <section className="bg-surface-container-lowest rounded-[var(--radius-xl)] p-[var(--spacing-md)] shadow-[0_4px_20px_rgba(31,41,55,0.04)]">
            <h2 className="font-heading text-h3 text-on-surface mb-[var(--spacing-md)]">
              Detail Booking
            </h2>

            {/* Selected Item Mini Card */}
            <div className="flex items-center gap-[var(--spacing-md)] p-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-surface-variant bg-surface mb-[var(--spacing-lg)]">
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-24 h-24 object-cover rounded-[var(--radius-md)]"
                onError={(e) => { e.target.src = 'https://placehold.co/96x96?text=No+Image'; }}
              />
              <div>
                <h3 className="text-body-lg text-on-surface mb-[var(--spacing-xs)]">{product.productName}</h3>
                <p className="text-body-md text-primary font-semibold">
                  {formatPrice(product.pricePerDay)} / hari
                </p>
                {product.ownerName && (
                  <p className="text-caption text-on-surface-variant">
                    Pemilik: {product.ownerName}
                  </p>
                )}
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-xs)] mb-[var(--spacing-md)]">
              <div className="flex flex-col">
                <label
                  className="text-label-md text-on-surface-variant mb-[var(--spacing-xs)]"
                  htmlFor="startDate"
                >
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant">
                    calendar_today
                  </span>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={getMinDate()}
                    className="w-full pl-10 pr-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-surface-container-lowest border border-outline-variant rounded-[var(--radius-lg)] text-on-surface text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  className="text-label-md text-on-surface-variant mb-[var(--spacing-xs)]"
                  htmlFor="endDate"
                >
                  Tanggal Selesai
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 text-on-surface-variant">
                    calendar_today
                  </span>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate}
                    className="w-full pl-10 pr-[var(--spacing-sm)] py-[var(--spacing-xs)] bg-surface-container-lowest border border-outline-variant rounded-[var(--radius-lg)] text-on-surface text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Duration Info */}
            <div className={`rounded-[var(--radius-lg)] p-[var(--spacing-xs)] flex items-center gap-2 mb-[var(--spacing-lg)] border ${
              duration > 0 ? 'bg-primary-container/10 border-primary-container' : 'bg-surface-variant/30 border-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className="text-label-md text-on-surface">
                Total Sewa: <span className="font-bold">{duration} Hari</span>
              </span>
              {duration > 0 && (
                <span className="ml-auto text-label-md text-primary font-semibold">
                  {formatPrice(totalPrice)}
                </span>
              )}
            </div>

            {/* Notes */}
            <div className="flex flex-col">
              <label
                className="text-label-md text-on-surface-variant mb-[var(--spacing-xs)] flex justify-between"
                htmlFor="notes"
              >
                Catatan untuk admin
                <span className="text-caption font-normal">(Opsional)</span>
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Contoh: Tolong siapkan 2 helm..."
                rows={3}
                className="w-full p-[var(--spacing-xs)] bg-surface-container-lowest border border-outline-variant rounded-[var(--radius-lg)] text-on-surface text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all outline-none resize-none"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Summary Card */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <BookingSummary
            items={[
              {
                name: `Sewa (${formatPrice(product.pricePerDay)} x ${duration} hari)`,
                price: totalPrice,
                quantity: duration,
                unit: 'hari'
              },
            ]}
            deposit={deposit}
            total={totalPrice + deposit}
            onContinue={handleContinue}
            continueLabel={loading ? 'Memproses...' : 'Lanjutkan Booking'}
            disabled={loading || duration === 0}
          />
        </div>
      </div>
    </div>
  );
}