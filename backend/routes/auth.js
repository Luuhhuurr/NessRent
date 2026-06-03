const { register, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const router = require('express').Router();

// Debug: Log when register is called
router.post('/register', (req, res, next) => {
  console.log('[AUTH DEBUG] Register called with body:', req.body.email);
  register(req, res, next);
});
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
