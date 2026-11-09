const productRepository = require('../repositories/productRepository');
const bookingRepository = require('../repositories/bookingRepository');
const { sendSuccess } = require('../utils/response');

const getDashboardStats = async (req, res) => {
  const [totalProducts, totalBookings] = await Promise.all([
    productRepository.countAll(),
    bookingRepository.countAll(),
  ]);

  return sendSuccess(res, {
    data: { totalProducts, totalBookings },
  });
};

const getCategoryStats = async (req, res) => {
  const categories = await productRepository.countByCategory();
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  const categoriesWithPercentage = categories.map((category) => ({
    ...category,
    percentage: total > 0 ? Math.round((category.count / total) * 100) : 0,
  }));

  return sendSuccess(res, { data: { categories: categoriesWithPercentage } });
};

const getRecentBookings = async (req, res) => {
  const bookings = await bookingRepository.findRecent(10);
  return sendSuccess(res, { data: { bookings } });
};

module.exports = {
  getDashboardStats,
  getCategoryStats,
  getRecentBookings,
};
