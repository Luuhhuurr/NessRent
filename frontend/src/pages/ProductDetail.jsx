import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import BookingCard from '../components/BookingCard';
import ProductTabs from '../components/ProductTabs';
import { productService } from '../services/productService';
import { getUserFromStorage } from '../components/ProtectedRoute';

const formatPrice = (price) => {
  if (price === undefined || price === null) return 'Rp 0';
  const num = typeof price === 'string' ? parseFloat(price) * 1000 : price * 1000;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
};

const getStatusConfig = (status) => {
  const configs = {
    available: { label: 'Tersedia', bgColor: 'bg-[#E6F4EA]', textColor: 'text-[#137333]' },
    unavailable: { label: 'Tidak Tersedia', bgColor: 'bg-surface-variant', textColor: 'text-on-surface-variant' },
    rented: { label: 'Disewa', bgColor: 'bg-warning-container', textColor: 'text-warning' },
  };
  return configs[status] || configs.unavailable;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUserFromStorage();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiResponse = await productService.getProduct(id);
      // Safe extraction - handle any response shape
      const response = apiResponse?.data ?? apiResponse ?? {};
      const productData = response?.data ?? response ?? null;
      setProduct(productData);
    } catch (err) {
      setProduct(null);
      setError(err?.message || 'Gagal memuat detail produk');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (bookingData) => {
    const bookingInfo = {
      productId: product?.id,
      productName: product?.name ?? product?.product_name ?? 'Produk',
      productImage: product?.image ?? product?.image_url,
      pricePerDay: product?.price_per_day ?? product?.price ?? 0,
      ownerName: product?.owner_name,
      ownerPhone: product?.owner_phone,
    };
    sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    navigate('/booking');
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality
    console.log('Added to favorites:', product.id);
  };

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="animate-pulse space-y-[var(--spacing-lg)]">
          <div className="h-8 bg-surface-container rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
            <div className="lg:col-span-7">
              <div className="aspect-[4/3] bg-surface-container rounded-[var(--radius-xl)]" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-surface-container rounded w-3/4" />
              <div className="h-6 bg-surface-container rounded w-1/2" />
              <div className="h-24 bg-surface-container rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="bg-error-container/20 border border-error-container/50 rounded-[var(--radius-xl)] p-8 text-center">
          <span className="material-symbols-outlined text-error text-[64px] mb-4">error</span>
          <h2 className="text-h2 text-on-surface mb-2">{error}</h2>
          <p className="text-body-md text-on-surface-variant mb-4">Produk tidak ditemukan</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container rounded-[var(--radius-lg)] hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Daftar Barang
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const statusConfig = getStatusConfig(product.status);
  const images = product.image
    ? [{ src: product.image, alt: product.name }]
    : [{ src: 'https://placehold.co/800x600?text=No+Image', alt: product.name }];

  const productId = product?.id;
  const isOwner = productId && user?.id === productId;
  const isAvailable = true; // All products are available by default

  return (
    <div className="flex-grow w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)] space-y-[var(--spacing-xl)]">
      {/* Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[var(--spacing-xs)]">
        <Link
          to="/products"
          className="inline-flex items-center gap-[var(--spacing-xs)] text-on-surface-variant hover:text-primary transition-colors text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali ke daftar barang
        </Link>
        <div className="text-caption text-on-surface-variant flex items-center gap-[var(--spacing-xs)]">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Barang</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={images} productName={product.name} />
        </div>

        {/* Right: Details & Booking */}
        <div className="lg:col-span-5 flex flex-col gap-[var(--spacing-lg)]">
          {/* Product Info */}
          <div className="space-y-[var(--spacing-xs)]">
            <div className="flex items-start justify-between gap-[var(--spacing-xs)]">
              <h1 className="font-heading text-h2 text-on-surface">{product.name}</h1>
              <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-[var(--spacing-xs)] py-[2px] rounded-full text-caption flex items-center gap-[var(--spacing-xs)] whitespace-nowrap mt-1`}>
                <span className="material-symbols-outlined fill-1 text-[14px]">check_circle</span>
                {statusConfig.label}
              </div>
            </div>
            <p className="font-heading text-h3 text-primary">
              {formatPrice(product.price_per_day ?? product.price)}{' '}
              <span className="text-body-md text-on-surface-variant">/ hari</span>
            </p>
            <p className="text-body-md text-on-surface-variant pt-[var(--spacing-xs)]">
              {product.description?.substring(0, 150)}
              {product.description?.length > 150 && '...'}
            </p>
            <div className="flex flex-wrap gap-[var(--spacing-xs)] pt-[var(--spacing-xs)]">
              <span className="bg-primary-container/15 text-on-surface px-[var(--spacing-xs)] py-[2px] rounded-full text-caption">
                Kategori: {product.category}
              </span>
              <span className="bg-primary-container/15 text-on-surface px-[var(--spacing-xs)] py-[2px] rounded-full text-caption">
                Kondisi: {product.condition}
              </span>
              <span className="bg-primary-container/15 text-on-surface px-[var(--spacing-xs)] py-[2px] rounded-full text-caption">
                Stok: {product.stock}
              </span>
              {product.owner_faculty && (
                <span className="bg-primary-container/15 text-on-surface px-[var(--spacing-xs)] py-[2px] rounded-full text-caption">
                  Pemilik: {product.owner_faculty}
                </span>
              )}
            </div>
          </div>

          {/* Owner Info Card */}
          {product.owner_name && (
            <div className="bg-surface-container-low rounded-[var(--radius-xl)] p-[var(--spacing-md)]">
              <h3 className="text-label-md text-on-surface-variant mb-[var(--spacing-xs)]">Informasi Pemilik</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container">person</span>
                </div>
                <div>
                  <p className="text-body-md font-medium text-on-surface">{product.owner_name}</p>
                  {product.owner_faculty && (
                    <p className="text-caption text-on-surface-variant">{product.owner_faculty}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Card */}
          <BookingCard
            pricePerDay={product?.price_per_day ?? product?.price ?? 0}
            onBook={handleBook}
            onAddToFavorites={handleAddToFavorites}
            isAvailable={isAvailable && !isOwner}
            isOwner={isOwner}
          />
        </div>
      </div>

      {/* Product Tabs */}
      <ProductTabs
        description={product.description}
        specifications={product.specifications}
        category={product.category}
        condition={product.condition}
      />
    </div>
  );
}