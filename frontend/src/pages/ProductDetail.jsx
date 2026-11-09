import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import BookingCard from '../components/BookingCard';
import ProductTabs from '../components/ProductTabs';
import { productService } from '../services/productService';
import { getUser } from '../lib/auth';
import { formatPrice, getProductImage, getStatusLabel, isProductAvailable } from '../lib/format';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getUser();

  const fetchProduct = useCallback(async () => {
    const response = await productService.getProduct(id);
    return response?.data ?? response ?? null;
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setProduct(await fetchProduct());
      } catch (err) {
        setProduct(null);
        setError(err?.message || 'Gagal memuat detail barang.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchProduct]);

  const handleBook = ({ startDate, endDate, duration, totalPrice }) => {
    sessionStorage.setItem(
      'bookingInfo',
      JSON.stringify({
        productId: product.id,
        productName: product.product_name,
        productImage: getProductImage(product.image_url),
        pricePerDay: product.price,
        startDate,
        endDate,
        duration,
        totalPrice,
      })
    );
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="animate-pulse flex flex-col gap-[var(--spacing-lg)]">
          <div className="h-4 bg-surface-container rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
            <div className="lg:col-span-7 aspect-[4/3] bg-surface-container rounded-[var(--radius-xl)]" />
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-8 bg-surface-container rounded w-3/4" />
              <div className="h-6 bg-surface-container rounded w-1/2" />
              <div className="h-24 bg-surface-container rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]">
        <div className="panel p-[var(--spacing-lg)] text-center">
          <span className="material-symbols-outlined text-error text-[56px] mb-4">error</span>
          <h2 className="font-heading text-h2 text-on-surface mb-2">Barang tidak ditemukan</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            {error || 'Barang yang Anda cari mungkin sudah tidak tersedia.'}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-[var(--radius-md)] hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke daftar barang
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = Boolean(user?.id) && user.id === product.owner_id;
  const available = isProductAvailable(product);
  const statusText = getStatusLabel(product.status);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)] flex flex-col gap-[var(--spacing-xl)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[var(--spacing-sm)]">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Kembali ke daftar barang
        </Link>
        <div className="text-caption text-on-surface-variant flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Beranda</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Barang</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">{product.product_name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-lg)]">
        <div className="lg:col-span-7">
          <ImageGallery
            images={[{ src: getProductImage(product.image_url) }]}
            productName={product.product_name}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-[var(--spacing-lg)]">
          <div className="flex flex-col gap-[var(--spacing-sm)]">
            <div className="flex items-start justify-between gap-[var(--spacing-sm)]">
              <h1 className="font-heading text-h2 text-on-surface">{product.product_name}</h1>
              <span
                className={`px-2.5 py-1 rounded-full text-caption whitespace-nowrap mt-1.5 ${
                  available
                    ? 'bg-success-container text-on-success-container'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {statusText}
              </span>
            </div>

            <p className="font-heading text-h3 text-on-surface">
              {formatPrice(product.price)}
              <span className="text-body-md text-on-surface-variant font-body"> / hari</span>
            </p>

            <p className="text-body-md text-on-surface-variant">
              {product.description?.substring(0, 200)}
              {product.description?.length > 200 && '...'}
            </p>

            <div className="flex flex-wrap gap-[var(--spacing-xs)]">
              {product.category && (
                <span className="px-2.5 py-1 rounded-full text-caption bg-surface-container text-on-surface-variant">
                  {product.category}
                </span>
              )}
              {product.condition && (
                <span className="px-2.5 py-1 rounded-full text-caption bg-surface-container text-on-surface-variant">
                  Kondisi: {product.condition}
                </span>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="rounded-[var(--radius-md)] bg-info-container/40 border border-info/25 p-[var(--spacing-sm)] flex items-start gap-2">
              <span className="material-symbols-outlined text-info text-[18px] mt-0.5">info</span>
              <p className="text-caption text-on-info-container">
                Ini adalah barang Anda sendiri, jadi tidak bisa disewa lewat halaman ini.
              </p>
            </div>
          )}

          <BookingCard
            pricePerDay={product.price}
            onBook={handleBook}
            isAvailable={available && !isOwner}
          />
        </div>
      </div>

      <ProductTabs description={product.description} />
    </div>
  );
}
