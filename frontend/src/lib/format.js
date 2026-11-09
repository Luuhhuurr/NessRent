import { ASSET_URL } from './config.js';

// Served from /public so it works outside the bundler too (and in tests).
const PLACEHOLDER_IMAGE = '/product-placeholder.svg';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

/**
 * Prices are stored in the database in thousands of rupiah, so 60 means
 * Rp 60.000. Every screen used to format this on its own — nine of them
 * multiplied by 1000 and one did not, which made the same product show two
 * different prices. This is the single rule now.
 */
export const formatPrice = (price) => {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  if (value === undefined || value === null || Number.isNaN(value)) return 'Rp 0';
  return rupiahFormatter.format(value * 1000);
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return dateFormatter.format(date);
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${dateFormatter.format(date)}, ${date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

/** Builds the absolute URL of an uploaded product image. */
export const getProductImage = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const path = imageUrl.includes('/uploads/')
    ? imageUrl.startsWith('/')
      ? imageUrl
      : `/${imageUrl}`
    : `/uploads/products/${imageUrl}`;

  return `${ASSET_URL}${path}`;
};

const BOOKING_STATUS = {
  pending: { label: 'Menunggu', tone: 'bg-warning-container text-on-warning-container' },
  confirmed: { label: 'Dikonfirmasi', tone: 'bg-info-container text-on-info-container' },
  approved: { label: 'Disetujui', tone: 'bg-success-container text-on-success-container' },
  completed: { label: 'Selesai', tone: 'bg-success-container text-on-success-container' },
  rejected: { label: 'Ditolak', tone: 'bg-error-container text-on-error-container' },
  cancelled: { label: 'Dibatalkan', tone: 'bg-surface-container-high text-on-surface-variant' },
};

export const BOOKING_STATUS_OPTIONS = Object.entries(BOOKING_STATUS).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

export const statusLabel = (status) => {
  if (!status) return '-';
  return BOOKING_STATUS[status]?.label ?? status;
};

export const statusTone = (status) =>
  BOOKING_STATUS[status]?.tone ?? 'bg-surface-container-high text-on-surface-variant';

const PRODUCT_STATUS = {
  available: 'Tersedia',
  tersedia: 'Tersedia',
  unavailable: 'Tidak Tersedia',
  'tidak tersedia': 'Tidak Tersedia',
};

export const getStatusLabel = (status) =>
  PRODUCT_STATUS[status?.toLowerCase()] ?? status ?? 'Tersedia';

export const isProductAvailable = (product) => {
  const raw = product?.status ?? product?.availability ?? 'tersedia';
  const normalized = String(raw).toLowerCase();
  return normalized === 'available' || normalized === 'tersedia' || normalized === 'true';
};

const USER_STATUS = {
  pending: { label: 'Menunggu Verifikasi', tone: 'bg-warning-container text-on-warning-container' },
  verified: { label: 'Terverifikasi', tone: 'bg-success-container text-on-success-container' },
  rejected: { label: 'Ditolak', tone: 'bg-error-container text-on-error-container' },
  blacklist: { label: 'Diblokir', tone: 'bg-error-container text-on-error-container' },
};

export const userStatusLabel = (status) => USER_STATUS[status]?.label ?? status ?? '-';

export const userStatusTone = (status) =>
  USER_STATUS[status]?.tone ?? 'bg-surface-container-high text-on-surface-variant';
