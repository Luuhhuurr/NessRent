/**
 * Pure helpers shared by the API and covered by the unit tests.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

/**
 * Counts the rental days between two dates. A same-day rental is one day.
 */
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }

  const diff = Math.abs(end - start);
  const days = Math.ceil(diff / MS_PER_DAY);
  return days || 1;
};

const calculateTotalPrice = (pricePerDay, startDate, endDate) =>
  Number(pricePerDay) * calculateDays(startDate, endDate);

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? ''));

const validateNIM = (nim) => /^\d{8,12}$/.test(String(nim ?? ''));

module.exports = {
  formatCurrency,
  calculateDays,
  calculateTotalPrice,
  validateEmail,
  validateNIM,
};
