/**
 * Booking status lives in the database as an ENUM. The admin UI speaks
 * Indonesian, so the labels the interface sends are translated here — once —
 * instead of being translated separately in the list and the update path.
 */

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const ALL_STATUSES = Object.values(BOOKING_STATUS);

const LABEL_TO_STATUS = {
  disetujui: BOOKING_STATUS.APPROVED,
  ditolak: BOOKING_STATUS.REJECTED,
  selesai: BOOKING_STATUS.COMPLETED,
  dibatalkan: BOOKING_STATUS.CANCELLED,
  menunggu: BOOKING_STATUS.PENDING,
  dikonfirmasi: BOOKING_STATUS.CONFIRMED,
};

/**
 * Maps a status coming from a request into a database enum value.
 * Returns null when the value is not a status we know about.
 */
const normalizeStatus = (value) => {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim().toLowerCase();
  if (ALL_STATUSES.includes(trimmed)) return trimmed;

  return LABEL_TO_STATUS[trimmed] || null;
};

module.exports = { BOOKING_STATUS, ALL_STATUSES, normalizeStatus };
