const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate, required, string, email, nim, password } = require('../middleware/validate');

router.post(
  '/register',
  validate({
    body: {
      name: [required('Nama wajib diisi'), string({ min: 3, max: 100, label: 'Nama' })],
      email: [required('Email wajib diisi'), email()],
      password: [password({ min: 8 })],
      nim: [required('NIM wajib diisi'), nim()],
    },
  }),
  asyncHandler(register)
);

router.post(
  '/login',
  validate({
    body: {
      email: [required('Email wajib diisi'), email()],
      password: [required('Password wajib diisi')],
    },
  }),
  asyncHandler(login)
);

router.get('/profile', authenticate, asyncHandler(getProfile));

module.exports = router;
