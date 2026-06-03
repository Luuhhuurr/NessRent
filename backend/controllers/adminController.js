const { pool } = require('../config/database');

const getDashboardStats = async (req, res, next) => {
  try {
    const [[totalProducts]] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [[totalUsers]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    const [[totalBookings]] = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [[pendingBookings]] = await pool.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
    const [[totalRevenue]] = await pool.query("SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = 'completed'");

    res.json({
      success: true,
      data: {
        totalProducts: totalProducts.count,
        totalUsers: totalUsers.count,
        totalBookings: totalBookings.count,
        pendingBookings: pendingBookings.count,
        totalRevenue: totalRevenue.total,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryStats = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC'
    );

    const total = categories.reduce((sum, cat) => sum + cat.count, 0);
    const categoriesWithPercentage = categories.map((cat) => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
    }));

    res.json({
      success: true,
      data: categoriesWithPercentage,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentBookings = async (req, res, next) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.id, u.name as user_name, p.name as product_name, b.start_date, b.end_date, b.status, b.total_price
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN products p ON b.product_id = p.id
       ORDER BY b.created_at DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getCategoryStats,
  getRecentBookings,
};
