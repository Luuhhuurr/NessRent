import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BookingSummary from '../components/BookingSummary';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState('');

  // Mock booking data
  const bookingData = {
    id: 'BK-2024-001',
    product: {
      name: 'Honda Vario 150 eSP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8W35Fwu7g7xLdH39i2Mikup-CxoOurd4hw4h1BhJ6G0yV23FpQytmdGWf2bKT8Bp6MHatrHywzapqk6MYTzeRCBAL8D8BMnz8K1FCYe9EQHRvflnYTNgDcHe_3nnOqyIgnfNHBetsFXerQaiDsBIO0tGwMuecv4N61SDm0i7Fuh9Sw3z3a8_Fw0dTfjtTbGvrVlICAD-1o51be5OROQ59w8r8m6kNOZu0X1Qe-Cg8AGH-qKZM7iq6mQ125p-YsNWb_ds0lHQcDswP',
      specs: 'Matic • 150cc • 2021',
    },
    rentalDetails: {
      startDate: '15 Nov 2024',
      endDate: '17 Nov 2024',
      duration: 2,
      location: 'Sekitar Kampus UNNES',
    },
    pricing: {
      rentalFee: 150000,
      deposit: 50000,
      serviceFee: 0,
      total: 200000,
    },
  };

  const handleConfirm = () => {
    if (!agreedToTerms || !signature) {
      alert('Silakan setujui syarat dan ketentuan serta isi tanda tangan digital.');
      return;
    }
    // Navigate to transaction history - booking is already saved in database
    sessionStorage.removeItem('lastBooking');
    navigate('/history');
  };

  const termsContent = [
    {
      title: '1. Kewajiban Penyewa:',
      text: 'Penyewa wajib menjaga kondisi kendaraan, tidak meminjamkan kepada pihak ketiga, dan menggunakan kendaraan sesuai dengan hukum yang berlaku di Indonesia. Penyewa harus memiliki SIM C yang masih berlaku.',
    },
    {
      title: '2. Ketentuan Pengembalian:',
      text: 'Kendaraan harus dikembalikan pada waktu dan lokasi yang telah disepakati. Keterlambatan akan dikenakan denda sesuai dengan ketentuan.',
    },
    {
      title: '3. Denda:',
      text: 'Keterlambatan pengembalian lebih dari 2 jam akan dikenakan denda sebesar 10% dari tarif harian per jam. Bahan bakar saat dikembalikan harus sama dengan saat diambil.',
    },
    {
      title: '4. Kerusakan:',
      text: 'Segala bentuk kerusakan yang terjadi selama masa sewa menjadi tanggung jawab penuh penyewa. Biaya perbaikan akan dikurangi dari deposit.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TopAppBar */}
      <header className="bg-surface shadow-sm flex justify-between items-center px-[var(--spacing-lg)] py-[var(--spacing-xs)] w-full sticky top-0 z-50">
        <Link to="/" className="font-heading text-h3 font-black text-primary">
          NesRent
        </Link>
      </header>

      <main className="flex-grow max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        {/* Top Section: Breadcrumb & Title */}
        <div className="mb-[var(--spacing-lg)]">
          <nav aria-label="Breadcrumb" className="flex text-caption text-on-surface-variant mb-[var(--spacing-xs)]">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                <Link to="/booking" className="hover:text-primary transition-colors">Booking</Link>
              </li>
              <li aria-current="page" className="flex items-center">
                <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                <span className="text-primary font-bold">Konfirmasi</span>
              </li>
            </ol>
          </nav>
          <h1 className="font-heading text-h2 text-on-surface">Konfirmasi Booking</h1>
          <p className="text-body-md text-on-surface-variant mt-[var(--spacing-xs)]">
            Langkah 2 dari 2: Tinjau dan konfirmasi detail penyewaan Anda.
          </p>
        </div>

        {/* Main Content: 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-md)]">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-[var(--spacing-md)]">
            {/* Detail Penyewaan Card */}
            <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] p-[var(--spacing-md)] hover:shadow-[0_8px_24px_rgba(31,41,55,0.10)] transition-shadow duration-300">
              <h2 className="font-heading text-h3 mb-[var(--spacing-md)] flex items-center">
                <span className="material-symbols-outlined mr-[var(--spacing-md)] text-primary">motorcycle</span>
                Detail Penyewaan
              </h2>
              <div className="flex flex-col md:flex-row gap-[var(--spacing-md)] items-start">
                {/* Vehicle Image */}
                <div className="w-full md:w-1/3 aspect-[1.5] rounded-[var(--radius-lg)] overflow-hidden flex-shrink-0">
                  <img
                    src={bookingData.product.image}
                    alt={bookingData.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Details */}
                <div className="w-full md:w-2/3 space-y-[var(--spacing-xs)]">
                  <div>
                    <h3 className="text-body-lg font-semibold text-on-surface">{bookingData.product.name}</h3>
                    <p className="text-caption text-on-surface-variant mt-[var(--spacing-xs)]">
                      {bookingData.product.specs}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-xs)] pt-[var(--spacing-xs)] border-t border-outline-variant">
                    <div>
                      <p className="text-caption text-on-surface-variant">Tanggal Pengambilan</p>
                      <p className="text-body-md font-medium">{bookingData.rentalDetails.startDate}</p>
                    </div>
                    <div>
                      <p className="text-caption text-on-surface-variant">Tanggal Pengembalian</p>
                      <p className="text-body-md font-medium">{bookingData.rentalDetails.endDate}</p>
                    </div>
                    <div>
                      <p className="text-caption text-on-surface-variant">Durasi</p>
                      <p className="text-body-md font-medium">{bookingData.rentalDetails.duration} Hari</p>
                    </div>
                    <div>
                      <p className="text-caption text-on-surface-variant">Lokasi Pengambilan</p>
                      <p className="text-body-md font-medium flex items-center gap-[var(--spacing-xs)]">
                        <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                        {bookingData.rentalDetails.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Syarat & Ketentuan Section */}
            <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] p-[var(--spacing-md)] hover:shadow-[0_8px_24px_rgba(31,41,55,0.10)] transition-shadow duration-300">
              <h2 className="font-heading text-h3 mb-[var(--spacing-md)] flex items-center">
                <span className="material-symbols-outlined mr-[var(--spacing-md)] text-primary">gavel</span>
                Syarat & Ketentuan
              </h2>
              <div className="bg-surface-container-low border border-outline-variant rounded-[var(--radius-lg)] p-[var(--spacing-xs)] h-48 overflow-y-auto mb-[var(--spacing-md)] text-caption text-on-surface-variant space-y-[var(--spacing-xs)]">
                {termsContent.map((term, index) => (
                  <p key={index}>
                    <strong>{term.title}</strong> {term.text}
                  </p>
                ))}
              </div>
              <div className="space-y-[var(--spacing-md)]">
                <label className="flex items-start gap-[var(--spacing-xs)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container focus:ring-2"
                  />
                  <span className="text-body-md text-on-surface">
                    Saya telah membaca dan menyetujui syarat dan ketentuan yang berlaku untuk penyewaan ini.
                  </span>
                </label>
                <div>
                  <label className="block text-label-md text-on-surface mb-[var(--spacing-xs)]" htmlFor="signature">
                    Tanda Tangan Digital (Ketik Nama Lengkap Anda)
                  </label>
                  <input
                    id="signature"
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full border border-outline-variant rounded-[var(--radius-md)] p-[var(--spacing-xs)] text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-[100px] space-y-[var(--spacing-md)]">
              {/* Ringkasan Pembayaran Card */}
              <div className="bg-surface-container-lowest rounded-[var(--radius-xl)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] p-[var(--spacing-md)] hover:shadow-[0_8px_24px_rgba(31,41,55,0.10)] transition-shadow duration-300">
                <h2 className="font-heading text-h3 mb-[var(--spacing-md)]">Ringkasan Pembayaran</h2>
                <div className="space-y-[var(--spacing-xs)] text-body-md mb-[var(--spacing-md)] border-b border-outline-variant pb-[var(--spacing-md)]">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Biaya Sewa ({bookingData.rentalDetails.duration} Hari)</span>
                    <span>Rp {bookingData.pricing.rentalFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Deposit Keamanan</span>
                    <span>Rp {bookingData.pricing.deposit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Biaya Layanan</span>
                    <span>Rp {bookingData.pricing.serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-[var(--spacing-md)]">
                  <span className="text-body-lg font-semibold">Total Pembayaran</span>
                  <span className="font-heading text-h2 text-primary">
                    Rp {bookingData.pricing.total.toLocaleString('id-ID')}
                  </span>
                </div>
                {/* Info Box */}
                <div className="bg-secondary-container/30 rounded-[var(--radius-lg)] p-[var(--spacing-xs)] flex items-start gap-[var(--spacing-xs)] mb-[var(--spacing-lg)]">
                  <span className="material-symbols-outlined text-primary mt-xs" style={{ fontVariationSettings: '"FILL" 1' }}>info</span>
                  <p className="text-caption text-on-surface-variant">
                    Deposit keamanan sebesar Rp {bookingData.pricing.deposit.toLocaleString('id-ID')} akan dikembalikan penuh setelah kendaraan dikembalikan dalam kondisi baik.
                  </p>
                </div>
                {/* CTA Button */}
                <button
                  onClick={handleConfirm}
                  disabled={!agreedToTerms || !signature}
                  className="w-full bg-primary-container text-on-primary-fixed text-label-md py-[var(--spacing-xs)] px-[var(--spacing-md)] rounded-[var(--radius-lg)] hover:bg-primary-fixed-dim transition-colors flex justify-center items-center gap-[var(--spacing-xs)] shadow-[0_4px_20px_rgba(31,41,55,0.04)] active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Konfirmasi & Kirim Booking
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <p className="text-caption text-center text-on-surface-variant mt-[var(--spacing-xs)]">
                  Anda akan diarahkan ke halaman pembayaran yang aman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container mt-[var(--spacing-xl)] py-[var(--spacing-lg)]">
        <div className="max-w-[1280px] mx-auto px-[var(--spacing-lg)] text-center">
          <p className="font-heading text-h3 font-black text-primary mb-[var(--spacing-xs)]">NesRent</p>
          <p className="text-caption text-on-surface-variant">
            &copy; 2024 NesRent. Empowering student living.
          </p>
        </div>
      </footer>
    </div>
  );
}